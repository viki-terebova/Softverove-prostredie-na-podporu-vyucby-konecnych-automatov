from itertools import product
from collections import Counter, defaultdict, deque

class BaseValidator:
    def __init__(self, automat, setup):
        self.automat = automat
        self.setup = setup
        self.wallet = {float(k): v for k, v in setup.get("alphabet_count", {}).items()}
        self.accepted_values = setup.get("accepted_values", [])
        self.accept_all = setup.get("accept_all", False)
        self.forbidden_values = set(setup.get("forbidden_values", []))
        self.required_sequences = setup.get("sequences", [])
        self.accept_all_sequences = setup.get("accept_all_sequences", False)
        print(setup)
        self.max_input_length = setup.get("max_input_length", 40)

    def run(self):
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

        queue = deque([(self.automat.start_state, [], Counter())])
        matched_sequences = []
        matched_required = set()
        matched_values = set()

        while queue:
            state, path, used = queue.popleft()

            if self.automat.accepts(path):
                if self.max_input_length and len(path) > self.max_input_length:
                    continue

                if any(c in self.forbidden_values for c in path):
                    return {
                        "accepted": False,
                        "reason": f"Sequence {path} contains forbidden coin."
                    }

                if not self._is_within_wallet(path):
                    return {
                        "accepted": False,
                        "reason": f"The person does not have enough money in wallet for sequence: {path}."
                    }

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
                    else:
                        matched_values.add(total)

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
                for ns in next_states:
                    queue.append((ns, path + [value], used + Counter([value])))

        if self.accept_all_sequences and len(matched_required) < len(self.required_sequences):
            missing = [s for s in self.required_sequences if tuple(s) not in matched_required]
            return {"accepted": False, "reason": "Not all required sequences matched.", "missing_sequences": missing}
        elif self.required_sequences and not matched_required:
            return {"accepted": False, "reason": "No required sequences matched."}

        if self.accepted_values and not matched_values:
            return {"accepted": False, "reason": "No sequences matched the accepted values."}
        print(self.accept_all, len(matched_values), len(self.accepted_values))
        if self.accept_all and len(matched_values) < len(self.accepted_values):
            missing = [v for v in self.accepted_values if v not in matched_values]
            return {"accepted": False, "reason": "Not all required accepted values matched.", "missing_values": missing}
        return {"accepted": True, "valid_paths": matched_sequences}

    def _is_within_wallet(self, combo):
        counts = Counter(combo)
        for k, v in counts.items():
            if v > self.wallet.get(k, 0):
                return False
        return True
