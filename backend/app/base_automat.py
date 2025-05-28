# base_automat.py
class BaseAutomat:
    def __init__(self, states, transitions_data, start_state, accept_states, setup):
        self.states = {s["id"] for s in states}
        self.transitions_data = transitions_data
        self.start_state = start_state
        self.accept_states = set(accept_states)
        self.setup = setup

        self.money_to_letter = self._create_money_mapping()
        self.letter_to_money = {v: k for k, v in self.money_to_letter.items()}

    def _create_money_mapping(self):
        alphabet = [float(k) for k in self.setup.get("transition_values") or self.setup.get("alphabet_count", {}).keys()]
        mapping = {}
        for i, value in enumerate(alphabet):
            mapping[float(value)] = chr(ord('a') + i)
        return mapping
    
    def __repr__(self):
        return f"BaseAutomat(states={self.states}, transitions_data={self.transitions_data}, start_state={self.start_state}, accept_states={self.accept_states}, setup={self.setup})"

    def get_money_to_letter(self):
        return self.money_to_letter

    def get_letter_to_money(self):
        return self.letter_to_money
