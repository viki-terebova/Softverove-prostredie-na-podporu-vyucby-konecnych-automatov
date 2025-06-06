from itertools import combinations
from collections import Counter, deque
from app.automat_nfa import AutomatNFA
from app.automat_dfa import AutomatDFA

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
        self.max_input_length = setup.get("max_input_length", 10)
        print(self.automat)

    def run(self):
        if not self.automat or type(self.automat) not in (AutomatNFA, AutomatDFA):
            return {"accepted": False, "reason": "Automat is not defined."}
        if type(self.automat) == AutomatDFA:
            result = self.automat.validate_dfa_completeness()
            if not result.get("accepted", True):
                return result

        queue = deque([(self.automat.start_state, [], Counter())])
        matched_sequences = []
        matched_required = set()
        matched_values = set()

        while queue:
            state, path, used = queue.popleft()
            print(path)

            if self.automat.accepts(path):
                if self.max_input_length and len(path) > self.max_input_length:
                    continue

                if self.forbidden_values and any(c in self.forbidden_values for c in path):
                    return {
                        "accepted": False,
                        "reason": f"Sequence {path} contains forbidden coin."
                    }

                if not self._is_within_wallet(path):
                    return {
                        "accepted": False,
                        "reason": f"The person does not have enough money in wallet for sequence: {path}."
                    }
                
                if isinstance(self.accepted_values, list):
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

            for value, next in self.automat.graph.get(state, {}).items():
                new_path = path + [value]
                if self.max_input_length and len(new_path) > self.max_input_length:
                    continue

                if isinstance(next, list):
                    for ns in next:
                        queue.append((ns, new_path, used + Counter([value])))
                else:
                    queue.append((next, new_path, used + Counter([value])))

        if isinstance(self.accepted_values, dict):
            rule_matched = [p for p in matched_sequences if self._matches_rule(p)]
            if not rule_matched:
                return {"accepted": False, "reason": "No sequences matched the accepted rule."}
            return {"accepted": True, "valid_paths": rule_matched}

        if self.accept_all_sequences and len(matched_required) < len(self.required_sequences):
            missing = [s for s in self.required_sequences if tuple(s) not in matched_required]
            return {"accepted": False, "reason": "Not all required sequences matched.", "missing_sequences": missing}
        elif self.required_sequences and not matched_required:
            return {"accepted": False, "reason": "No required sequences matched."}

        if self.accepted_values and not matched_values:
            return {"accepted": False, "reason": "No sequences matched the accepted values."}
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
    
    def _matches_rule(self, path):
        """Check if a given path satisfies accepted_values rule (dict format)."""
        for rule, expected in self.accepted_values.items():
            if rule == "ends_with":
                if len(path) >= len(expected) and path[-len(expected):] == expected:
                    return True
            elif rule == "starts_with":
                if len(path) >= len(expected) and path[:len(expected)] == expected:
                    return True
            elif rule == "alternating":
                if all(path[i] == expected[i % len(expected)] for i in range(len(path))):
                    return True
            elif rule == "repeat":
                val, count = expected
                if path.count(val) >= count:
                    return True
            elif rule == "start_from_each":
                if any(path[:len(pat)] == pat for pat in expected if len(path) >= len(pat)):
                    return True
        return False