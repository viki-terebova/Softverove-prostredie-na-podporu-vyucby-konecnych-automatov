class BaseAutomat:
    def __init__(self, states, transitions_data, start_state, accept_states, setup):
        self.states = {s["id"] for s in states}
        self.transitions_data = transitions_data
        self.start_state = start_state
        self.accept_states = set(accept_states)
        self.setup = setup
        self.alphabet = self.setup.get("alphabet_count", {}).keys()
    
    def __repr__(self):
        return f"BaseAutomat(\n    states={self.states}\n    transitions_data={self.transitions_data}\n    start_state={self.start_state}\n    accept_states={self.accept_states}\n    setup={self.setup})"

