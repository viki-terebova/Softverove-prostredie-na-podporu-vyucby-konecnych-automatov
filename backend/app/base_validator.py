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
        self.max_input_length = setup.get("max_input_length", 40)

    def run(self):
        if not self.automat or type(self.automat) not in (AutomatNFA, AutomatDFA):
            return {"accepted": False, "reason": "Automat is not defined."}
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

            for value, next in self.automat.graph.get(state, {}).items():
                if isinstance(next, list):
                    for ns in next:
                        queue.append((ns, path + [value], used + Counter([value])))
                else: 
                    queue.append((next, path + [value], used + Counter([value])))

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

    def generate_valid_combinations(self):
        wallet_list = []
        for value, count in self.wallet.items():
            wallet_list.extend([value] * count)

        valid_combos = set()
        max_length = self.max_input_length or len(wallet_list)

        for length in range(1, min(len(wallet_list), max_length) + 1):
            for combo in combinations(wallet_list, length):
                combo_sum = round(sum(combo), 2)
                if combo_sum in self.accepted_values and not any(val in self.forbidden_values for val in combo):
                    if Counter(combo) <= Counter(wallet_list):
                        valid_combos.add(tuple(sorted(combo)))

        return [list(seq) for seq in valid_combos]