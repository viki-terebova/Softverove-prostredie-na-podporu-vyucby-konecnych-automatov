from itertools import product
from collections import Counter, defaultdict, deque

class BaseValidator:
    def __init__(self, automat, setup):
        self.automat = automat
        self.setup = setup
        self.wallet = setup.get("alphabet_count", {})
        self.accepted_values = setup.get("accepted_values", [])
        self.accept_all = setup.get("accept_all_values", False)
        self.forbidden_values = set(setup.get("forbidden_values", []))
        self.required_sequences = setup.get("sequences", [])
        self.accept_all_sequences = setup.get("accept_all_sequences", False)
        print(setup)
        self.max_length = setup.get("max_input_length", 10)

    def run(self):
        print(self.automat)
        if self.setup.get("type", "").upper() == "DFA":
            expected_inputs = {float(k) for k in self.wallet.keys()}
            for state in self.automat.states:
                if state.startswith("Reject"):
                    continue
                transitions = self.automat.graph.get(state, {})
                if set(transitions.keys()) != expected_inputs:
                    return {
                        "accepted": False,
                        "reason": f"DFA state '{state}' is missing transitions. Expected: {expected_inputs}, found: {set(transitions.keys())}"
                    }

        visited = set()
        queue = deque([(self.automat.start_state, [], Counter())])
        matched_sequences = []
        matched_required = set()

        while queue:
            state, path, used = queue.popleft()

            print(path, self.max_length)
            if self.max_length and len(path) > self.max_length:
                continue

            path_key = (state, tuple(sorted(used.items())))
            if path_key in visited:
                continue
            visited.add(path_key)

            if not self._is_within_wallet(path):
                return {
                    "accepted": False,
                    "reason": f"Sequence {path} exceeds wallet limits."
                }

            if any(c in self.forbidden_values for c in path):
                return {
                    "accepted": False,
                    "reason": f"Sequence {path} contains forbidden coin."
                }

            if self.automat.accepts(path):
                if isinstance(self.accepted_values, dict):
                    for rule, expected in self.accepted_values.items():
                        if rule == "ends_with" and not path[-1:] == expected:
                            return {"accepted": False, "reason": f"Accepted sequence {path} does not end with {expected}."}
                        elif rule == "starts_with" and not path[:1] == expected:
                            return {"accepted": False, "reason": f"Accepted sequence {path} does not start with {expected}."}
                        elif rule == "alternating":
                            if not all(path[i] == expected[i % len(expected)] for i in range(len(path))):
                                return {"accepted": False, "reason": f"Accepted sequence {path} does not match alternating pattern {expected}."}
                        elif rule == "repeat":
                            val, count = expected[0], expected[1]
                            if path.count(val) < count:
                                return {"accepted": False, "reason": f"Accepted sequence {path} does not repeat {val} at least {count} times."}
                        elif rule == "start_from_each":
                            if not any(all(path[i] == v for i, v in enumerate(pat)) for pat in expected if len(path) >= len(pat)):
                                return {"accepted": False, "reason": f"Accepted sequence {path} does not match any required start pattern."}
                else:
                    total = round(sum(path), 2)
                    required = set(round(v, 2) for v in self.accepted_values)
                    if total not in required:
                        return {"accepted": False, "reason": f"Accepted sequence {path} total {total} not in allowed totals {required}."}

                matched_sequences.append(path)
                for req in self.required_sequences:
                    for i in range(len(path) - len(req) + 1):
                        if path[i:i+len(req)] == req:
                            matched_required.add(tuple(req))

                if self.automat.ends_in_reject(path):
                    return {"accepted": False, "reason": f"Sequence {path} is accepted but ends in Reject state."}

            if self.automat.accepts(path) and self.automat.ends_in_reject(path):
                return {"accepted": False, "reason": f"Sequence {path} leads to both Accept and Reject."}

            for value, next_states in self.automat.graph.get(state, {}).items():
                if used[value] < self.wallet.get(str(value), 0):
                    for ns in next_states:
                        queue.append((ns, path + [value], used + Counter([value])))

        if self.accept_all_sequences and len(matched_required) < len(self.required_sequences):
            missing = [s for s in self.required_sequences if tuple(s) not in matched_required]
            return {"accepted": False, "reason": "Not all required sequences matched.", "missing_sequences": missing}
        elif self.required_sequences and not matched_required:
            print(self.required_sequences, matched_required)
            return {"accepted": False, "reason": "No required sequences matched."}

        return {"accepted": True, "valid_paths": matched_sequences}

    def _is_within_wallet(self, combo):
        counts = Counter(combo)
        for k, v in counts.items():
            if v > self.wallet.get(str(k), 0):
                return False
        return True
