from app.base_validator import BaseValidator

class ValidatorDFA(BaseValidator):
    def __init__(self, automat_dfa, setup):
        super().__init__(automat_dfa, setup)
        self.dfa = automat_dfa.get_dfa()

    def accepts(self, encoded_input: str) -> bool:
        return self.dfa.accepts_input(encoded_input)

    def find_valid_paths(self):
        from itertools import product

        alphabet = [float(k) for k in self.setup.get("transition_values") or self.setup.get("alphabet_count", {}).keys()]
        max_len = self.max_length
        valid_paths = []
        invalid_paths = []

        # Try combinations of coins up to max length
        for l in range(1, max_len + 1):
            for combo in product(alphabet, repeat=l):
                total = round(sum(combo), 2)
                encoded = self.encode_sequence(combo)
                if not encoded:
                    continue

                if self.dfa.accepts_input(encoded):
                    if total in self.accepted_values:
                        valid_paths.append((list(combo), list(encoded)))
                    else:
                        invalid_paths.append((list(combo), total))

        return {
            "accepted": True,
            "valid_paths": valid_paths,
            "invalid_paths": invalid_paths
        }