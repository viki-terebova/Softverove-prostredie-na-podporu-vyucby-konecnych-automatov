from decimal import Decimal
from collections import deque
from app.automat_nfa import AutomatNFA

class ValidatorNFA:
    def __init__(self, automat_nfa:AutomatNFA, setup:dict):
        self.nfa = automat_nfa.get_nfa()
        self.money_to_letter = automat_nfa.get_money_to_letter()
        self.letter_to_money = automat_nfa.get_letter_to_money()
        self.setup = setup
        self.accepted_values = setup.get("accepted_values", [])
        self.accept_all = setup.get("accept_all", True)
        self.max_length = setup.get("max_input_length", 50)
        self.required_sequences = setup.get("sequences", [])

        print("NFA:")
        print("States:", self.nfa.states)
        print("Input Symbols:", self.nfa.input_symbols)
        print("Transitions:", self.nfa.transitions)
        print("Initial State:", self.nfa.initial_state)
        print("Final States:", self.nfa.final_states)
        print("Money to Letter Mapping:", self.money_to_letter)
        print("Letter to Money Mapping:", self.letter_to_money)
        print("Level Setup:", self.setup)
        print("Accepted Values:", self.accepted_values)
        print("Accept All:", self.accept_all)
        print("Max Length:", self.max_length)
        print("Required Sequences:", self.required_sequences)

    def walk_accepted_paths(self):
        biggest_goal = max(self.accepted_values)

        valid_paths = []
        invalid_paths = []

        queue = deque()
        # Start from initial state: (state, path_letters, path_coins, total_sum)
        queue.append((self.nfa.initial_state, [], [], 0.0))

        while queue:
            state, path_letters, path_coins, total_sum = queue.popleft()
            total_sum = round(total_sum, 2)

            # If this path ends in accept state, check the sum
            if state in self.nfa.final_states:
                print(path_coins.copy(), path_letters.copy(), total_sum)
                if total_sum in self.accepted_values:
                    valid_paths.append((path_coins.copy(), path_letters.copy()))
                else:
                    invalid_paths.append((path_coins.copy(), total_sum))

            if len(path_letters) >= self.max_length:
                continue  # Prune long paths

            # Explore next transitions from current state
            state_transitions = self.nfa.transitions.get(state, {})
            for symbol, next_states in state_transitions.items():
                for next_state in next_states:
                    coin = self.letter_to_money[symbol]
                    new_total = total_sum + coin

                    queue.append((
                        next_state,
                        path_letters + [symbol],
                        path_coins + [coin],
                        new_total
                    ))
        print(valid_paths)
        print(invalid_paths)
        return {
            "accepted": True,
            "valid_paths": valid_paths,
            "invalid_paths": invalid_paths
        }

    def check_required_sequences(self):
        missing = []

        for sequence in self.required_sequences:
            # Convert sequence of money values to symbol string
            try:
                encoded = "".join(
                    self.money_to_letter[s] for s in sequence
                )
            except KeyError:
                missing.append(sequence)
                continue

            if not self.nfa.accepts_input(encoded):
                missing.append(sequence)

        return missing

    def run(self):
        # Step 1: Walk all accepted paths and check invalid acceptances
        walk_result = self.walk_accepted_paths()

        if not walk_result["accepted"]:
            # Automat accepted a wrong value → fail immediately
            return {
                "accepted": False,
                "reason": walk_result["reason"],
                "invalid_paths": walk_result["invalid_paths"]
            }

        valid_paths = walk_result["valid_paths"]

        # Step 2: Check required sequences
        missing_sequences = self.check_required_sequences()

        if missing_sequences:
            return {
                "accepted": False,
                "reason": "Required sequences missing.",
                "missing_sequences": missing_sequences
            }

        # Step 3: Final acceptance decision
        if self.accept_all:
            # All possible accepted_values must be covered by paths
            covered_totals = {sum(path[0]) for path in valid_paths}
            missing_totals = [val for val in self.accepted_values if val not in covered_totals]
            if missing_totals:
                return {
                    "accepted": False,
                    "reason": "Not all accepted values are covered.",
                    "missing_totals": [str(v) for v in missing_totals]
                }
            else:
                return {
                    "accepted": True,
                    "valid_paths": valid_paths
                }
        else:
            # Only one valid path is enough
            if valid_paths:
                return {
                    "accepted": True,
                    "valid_paths": valid_paths
                }
            else:
                return {
                    "accepted": False,
                    "reason": "No right paths found."
                }
