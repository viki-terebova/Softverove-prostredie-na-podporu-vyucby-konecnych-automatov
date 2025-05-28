from collections import deque
from app.base_validator import BaseValidator

class ValidatorNFA(BaseValidator):
    def __init__(self, automat_nfa, setup):
        super().__init__(automat_nfa, setup)
        self.nfa = automat_nfa.get_nfa()

    def accepts(self, encoded_input: str) -> bool:
        return self.nfa.accepts_input(encoded_input)

    def find_valid_paths(self):
        valid_paths = []
        invalid_paths = []

        queue = deque()
        queue.append((self.nfa.initial_state, [], [], 0.0))

        while queue:
            state, path_letters, path_coins, total_sum = queue.popleft()
            total_sum = round(total_sum, 2)

            if state in self.nfa.final_states:
                if total_sum in self.accepted_values:
                    valid_paths.append((path_coins.copy(), path_letters.copy()))
                else:
                    invalid_paths.append((path_coins.copy(), total_sum))

            if len(path_letters) >= self.max_length:
                continue

            state_transitions = self.nfa.transitions.get(state, {})
            for symbol, next_states in state_transitions.items():
                for next_state in next_states:
                    coin = self.letter_to_money[symbol]
                    queue.append((
                        next_state,
                        path_letters + [symbol],
                        path_coins + [coin],
                        total_sum + coin
                    ))

        return {
            "accepted": True,
            "valid_paths": valid_paths,
            "invalid_paths": invalid_paths
        }