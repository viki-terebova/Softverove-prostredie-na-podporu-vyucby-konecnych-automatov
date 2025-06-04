
from app.base_automat import BaseAutomat
from collections import deque

class AutomatNFA(BaseAutomat):
    def __init__(self, states, transitions_data, start_state, accept_states, setup):
        super().__init__(states, transitions_data, start_state, accept_states, setup)
        self.graph = self._build_graph()

    def _build_graph(self):
        graph = {}
        for t in self.transitions_data:
            f, t_, v = t["from"], t["to"], float(t["value"])
            graph.setdefault(f, {}).setdefault(v, []).append(t_)
        return graph
    
    def __repr__(self):
        return super().__repr__()

    def accepts(self, sequence):
        queue = deque([(self.start_state, 0)])
        while queue:
            state, index = queue.popleft()
            if index == len(sequence):
                if state in self.accept_states:
                    return True
                continue
            coin = sequence[index]
            for next_state in self.graph.get(state, {}).get(coin, []):
                queue.append((next_state, index + 1))
        return False

    def ends_in_reject(self, sequence):
        queue = deque([(self.start_state, 0)])
        while queue:
            state, index = queue.popleft()
            if index == len(sequence):
                if state == "Reject":
                    return True
                continue
            coin = sequence[index]
            for next_state in self.graph.get(state, {}).get(coin, []):
                queue.append((next_state, index + 1))
        return False
