from automata.fa.nfa import NFA

class AutomatNFA:
    def __init__(self, states, transitions_data, start_state, accept_states, setup):
        self.states = set(states)
        self.transitions_data = transitions_data
        self.start_state = start_state
        self.accept_states = set(accept_states)
        self.setup = setup

        self.money_to_letter = self._create_money_mapping()
        self.letter_to_money = {value: key for key, value in self.money_to_letter.items()}

        self.nfa = self._build_nfa()

    def _create_money_mapping(self):
        alphabet = self.setup["alphabet"]
        mapping = {}
        for i, value in enumerate(alphabet):
            mapping[value] = chr(ord('a') + i)
        return mapping

    def _build_nfa(self):
        transition_function = {}

        has_transition_from_start = False

        for t in self.transitions_data:
            from_state = t["from"]
            to_state = t["to"]
            value = float(t["value"])

            letter = self.money_to_letter.get(value)
            if not letter:
                raise Exception(f"Value {value} not found in level alphabet.")

            if from_state not in transition_function:
                transition_function[from_state] = {}

            if letter not in transition_function[from_state]:
                transition_function[from_state][letter] = set()

            transition_function[from_state][letter].add(to_state)

            if from_state == self.start_state:
                has_transition_from_start = True
        
        if not has_transition_from_start:
            raise Exception(
                f"The initial state '{self.start_state}' has no transitions defined. "
                "Please create at least one transition from the start state."
            )


        return NFA(
            states=self.states,
            input_symbols=set(self.money_to_letter.values()),
            transitions=transition_function,
            initial_state=self.start_state,
            final_states=self.accept_states
        )

    def get_nfa(self):
        return self.nfa

    def get_money_to_letter(self):
        return self.money_to_letter

    def get_letter_to_money(self):
        return self.letter_to_money
