from app.base_automat import BaseAutomat

class AutomatDFA(BaseAutomat):
    def __init__(self, states, transitions_data, start_state, accept_states, setup):
        super().__init__(states, transitions_data, start_state, accept_states, setup)
        self.transitions_data_original = transitions_data
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
    
    def validate_dfa_completeness(self):
        expected_inputs = {float(k) for k in self.alphabet}
        transition_keys = set()
        transitions_by_state = {}

        for t in self.transitions_data_original:
            from_state = t["from"]
            value = float(t["value"])
            key = (from_state, value)

            if key in transition_keys:
                return {
                    "accepted": False,
                    "reason": f"DFA Error: multiple transitions from state '{from_state}' on value '{value}'."
                }
            transition_keys.add(key)
            transitions_by_state.setdefault(from_state, set()).add(value)

        from collections import deque
        reachable_states = set()
        queue = deque([self.start_state])

        while queue:
            state = queue.popleft()
            if state in reachable_states:
                continue
            reachable_states.add(state)
            for t in self.transitions_data_original:
                if t["from"] == state:
                    queue.append(t["to"])

        for state in reachable_states:
            if state.startswith("Reject"):
                continue
            defined_values = transitions_by_state.get(state, set())

            if defined_values != expected_inputs:
                return {
                    "accepted": False,
                    "reason": (
                        f"DFA state '{state}' is missing transitions. "
                        f"Expected all of: {expected_inputs}, found: {defined_values}"
                    )
                }

        return { "accepted": True }
