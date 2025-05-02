from app.automat_nfa import AutomatNFA
from decimal import Decimal
from collections import deque
from decimal import Decimal

class ValidatorNFA:
    def __init__(self, automat_nfa:AutomatNFA, setup):
        self.nfa = automat_nfa.get_nfa()
        self.money_to_letter = automat_nfa.get_money_to_letter()
        self.letter_to_money = automat_nfa.get_letter_to_money()
        self.setup = setup
        self.valid_inputs = []
        self.sequences = setup.get("sequences", [])
        self.accepted_values = setup.get("accepted_values", [])
        self.accept_all = setup.get("accept_all", True)
        self.forbiden_values = setup.get("forbidden_values", [])
        alphabet_length = len(setup.get("alphabet", [])) - len(self.forbiden_values)
        self.limit = int(300 / (alphabet_length if alphabet_length > 0 else 1))

    def generate_combinations_bfs(self):
        alphabet = self.setup.get("alphabet", [])
        alphabet_count = self.setup.get("alphabet_count", {})
        max_input_length = self.setup.get("max_states", None)

        biggest_goal = max(self.setup["accepted_values"])

# okay go back to the validation, would it be better approach if we made the combinations based on the automat the user created and if the accept_all is false, it will be accepted if only one does meet the requirements and if accept_all = true we just need to find one that does not meet the requirements 

        pool = []
        for value in alphabet:
            count = alphabet_count.get(value)
            if count is not None:
                pool.extend([value] * count)
            else:
                pool.extend([value] * self.limit)

        queue = deque()
        queue.append(([], pool))

        valid_combinations = set()

        while queue:
            path, remaining = queue.popleft()

            total = sum(path)
            if total > biggest_goal:
                continue
            if max_input_length and len(path) > max_input_length:
                continue

            if path:
                valid_combinations.add(tuple(sorted(path)))

            for i, coin in enumerate(remaining):
                new_path = path + [coin]
                new_remaining = remaining[:i] + remaining[i+1:]  # remove used coin
                queue.append((new_path, new_remaining))

        self.validate_combinations(list(valid_combinations))

    def encode_input(self, combination):
        return "".join([self.money_to_letter[v] for v in combination])

    def validate_combinations(self, combinations):
        for combination in combinations:
            total = sum(combination)

            if total in self.accepted_values:
                input_string = self.encode_input(combination)

                if self.nfa.accepts_input(input_string):
                    self.valid_inputs.append((combination, True))
                else:
                    self.valid_inputs.append((combination, False))

    def validate_sequences(self):
        self.sequence_results = []

        for seq in self.sequences:
            encoded = "".join([self.money_to_letter[s] for s in seq])

            if self.nfa.accepts_input(encoded):
                self.sequence_results.append((seq, True))
            else:
                self.sequence_results.append((seq, False))

    def validate(self):
        self.generate_combinations_bfs()
        self.validate_sequences()
        
        print(f"self.nfa: {self.nfa}\nself.money_to_letter: {self.money_to_letter}\nself.letter_to_money: {self.letter_to_money}\nself.setup: {self.setup}")
        print(f"self.valid_inputs: {self.valid_inputs}\nself.sequences: {self.sequences}\nself.accepted_values: {self.accepted_values}\nself.accept_all: {self.accept_all}")

        passed_inputs = [combination for combination, ok in self.valid_inputs if ok]
        failed_sequences = [seq for seq, ok in self.sequence_results if not ok]

        accepted = False

        if self.accept_all:
            accepted = len(passed_inputs) == len(self.valid_inputs)
        else:
            accepted = len(passed_inputs) >= 1

        if failed_sequences:
            accepted = False

        return {
            "accepted": accepted,
            "passed_inputs": passed_inputs,
            "failed_sequences": failed_sequences
        }


# self.nfa: NFA(states={'Start', 'Accept'}, input_symbols={'a'}, transitions={'Start': {'a': {'Accept'}}}, initial_state='Start', final_states={'Accept'})
# self.money_to_letter: {0.1: 'a'}
# self.letter_to_money: {'a': 0.1}
# self.setup: {'alphabet': [0.1], 'accepted_values': [0.1], 'accept_all': False, 'max_states': -1}
# self.valid_inputs: [((0.1,), True), ((0.1,), True), ((0.1,), True), ((0.1,), True), ((0.1,), True)]
# self.sequences: []
# self.accepted_values: [0.1]
# self.accept_all: False
# {'accepted': True, 'passed_inputs': [(0.1,), (0.1,), (0.1,), (0.1,), (0.1,)], 'failed_sequences': []}