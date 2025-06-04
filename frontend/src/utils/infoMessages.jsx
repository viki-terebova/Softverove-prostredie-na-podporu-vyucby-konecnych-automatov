const infoMessages = {
    levelName: "Type a short and descriptive name for the level. This will be shown in level lists. Example: 'Snack for 50 Cents'.",
    task: "Explain what the player should do. You can use **double asterisks** to bold important values. Example: 'Help the character get exactly **0.7 €**.'",
    transitionValues: "Add coin values the player can use as transition labels. Example: 0.1, 0.2 .",
    wallet: "Specify how many times each coin value can be used in one path. These form the alphabet of the automat. For example, 0.2 → 2 means two 20-cent coins available.",
    acceptedValues: `
    You can define what sequences the automat should accept in two ways:

    1. **Total Values** (default):  
    Enter one or more target totals (e.g. \`0.7\`, \`1.0\`). The automat should accept a sequence whose coin values add up to any of these.  
    Example: \`0.1, 0.2, 0.4\` → Total 0.7 → Accepted

    2. **Rule-based Conditions** (use only one at a time):  
    Instead of totals, use one of the special rules below by entering a JSON object like:  
    \`{ "ends_with": 0.2 }\`

    - **ends_with**: The last value in the sequence must match.  
        Example: \`{ "ends_with": 0.5 }\` → Accepts \`[0.1, 0.5]\`

    - **starts_with**: The first value must match.  
        Example: \`{ "starts_with": 0.2 }\` → Accepts \`[0.2, 0.1]\`

    - **alternating**: Values must follow a repeating pattern.  
        Example: \`{ "alternating": [0.1, 0.2] }\` → Accepts \`[0.1, 0.2, 0.1]\`

    - **repeat**: A specific value must occur at least a certain number of times.  
        Example: \`{ "repeat": [0.5, 3] }\` → Accepts \`[0.5, 0.5, 0.1, 0.5]\`

    - **start_from_each**: Sequence must start with one of the specified patterns.  
        Example: \`{ "start_from_each": [[0.1, 0.2], [0.2, 0.5]] }\` → Accepts \`[0.1, 0.2, 1.0]\` or \`[0.2, 0.5, 0.1]\`

    📌 **Note**:  
    - You can enter either a list of values or a single rule — not both.  
    - Values must use dot notation (e.g. \`0.2\`), not comma.  
    - If using rules, use exact JSON syntax.`,

    acceptAll: "If checked, the automat must accept every value listed above at least once in the automat. If unchecked, it only needs to accept at least one of the values.",

    forbiddenValues: "Add coin values that must not appear in any transition. Any path using a forbidden coin will be invalid.",

    sequences: "Define specific coin sequences that the automat must accept as valid input paths. Each sequence represents a precise series of coin values, entered as a comma-separated list (e.g. \`0.1, 0.2, 0.5\`).",

    acceptAllSequences: "If checked, all added sequences must be accepted by the automat. If unchecked, it's enough to accept one. If left empty, the automat will not check for sequences.",

    maxInputLength: "Limit how many coins can be used in a single path. For example, '3' allows only paths with up to 3 transitions.",

    type: `Choose the type of automat to be used in this level:

    **NFA** (Nondeterministic Finite Automaton):  
    Allows multiple transitions for the same value from one state.  
    Example: From state \`q0\`, value \`0.1\` can go to \`q1\` and \`q2\`.

    **DFA** (Deterministic Finite Automaton):  
    Every state must have exactly **one transition** for **each available coin value** (alphabet symbol).  
    That means:
    - No missing transitions.
    - No duplicate transitions for the same value.

    ✅ Example: If the alphabet is \`[0.1, 0.2]\`, then **every state** must define:
    - one transition for \`0.1\`
    - one transition for \`0.2\`

    ❌ Missing or ambiguous transitions will cause validation to fail.
    `,

    public: "If checked, the level will be visible to all users. If left unchecked, it will remain private and only visible to you."
};

export default infoMessages;