const infoMessages = {
    levelName: "Type a short and descriptive name for the level. This will be shown in level lists. Example: 'Snack for 50 Cents'.",
    task: "Explain what the player should do. You can use **double asterisks** to bold important values. Example: 'Help the character get exactly **0.7 €**.'",
    transitionValues: "Add coin values the player can use as transition labels. Example: 0.1, 0.2 .",
    wallet: "Specify how many times each coin value can be used in one path. These form the alphabet of the automat. For example, 0.2 → 2 means two 20-cent coins available.",
    acceptedValues: `
    You can define what sequences the automat should accept:

    1. **Total Values** (default):  
    Enter one or more target totals (e.g. \`0.7\`, \`1.0\`). The automat should accept a sequence whose coin values add up to any of these.  
    Example: path:\`0.1, 0.2, 0.4\` → Total 0.7 → Accepted`,

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


