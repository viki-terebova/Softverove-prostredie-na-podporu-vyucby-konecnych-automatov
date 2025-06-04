from app.base_automat import BaseAutomat

class AutomatDFA(BaseAutomat):
    def __init__(self, states, transitions_data, start_state, accept_states, setup):
        super().__init__(states, transitions_data, start_state, accept_states, setup)
        self.graph = self._build_graph()

    def __repr__(self):
        return super().__repr__()

    def _build_graph(self):
        graph = {}
        for t in self.transitions_data:
            f, t_, v = t["from"], t["to"], float(t["value"])
            graph.setdefault(f, {})[v] = t_
        return graph

    def accepts(self, sequence):
        state = self.start_state
        for coin in sequence:
            if coin not in self.graph.get(state, {}):
                return False
            state = self.graph[state][coin]
        return state in self.accept_states

    def ends_in_reject(self, sequence):
        state = self.start_state
        for coin in sequence:
            if coin not in self.graph.get(state, {}):
                return False
            state = self.graph[state][coin]
        return state == "Reject"
    
    def _validate_dfa_completeness(self):
        symbols = [float(k) for k in self.setup.get("transition_values") or self.setup.get("alphabet_count", {}).keys()]
        for state in self.states:
            transitions = self.graph.get(state, {})
            for symbol in symbols:
                if symbol not in transitions:
                    raise ValueError(f"DFA missing transition from '{state}' on input '{symbol}'")
