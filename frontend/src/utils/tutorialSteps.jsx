const tutorialSteps = {
    0: {
        1: [
            { text: "🟢 This is the Start state. The automat always begins here.", position: { top: "26vh", left: "6vw" } },
            { text: "🔵 This is the Accept state. Reach this state with valid coins to succeed.", position: { top: "9vh", left: "67vw" } },
            { text: "🔴 This is the Reject state. The paths that are connected to this state will be rejected by the automat.", position: { top: "30vh", left: "67vw" } },
            { text: "+↗: If you want to add transition, this button needs to be selected.", position: { top: "67vh", left: "8vw" } },
            { text: "💡 To create a transition, click one state, then another, and select the coin values. ", position: { top: "30vh", left: "35vw" } },
            { text: "💰 For example, use a 0.1€ coin to connect Start and Accept. That means when the automat gets 0.1€ coin in Start state it will move to Accept state.", position: { top: "20vh", left: "35vw" } },
            { text: "🧪 Press Test to check your automat!", position: { top: "67vh", left: "76vw" } }
        ],
        2: [
            { text: "x↗: If you want to delete transition select this button and click on transition you want to delete.", position: { top: "63vh", left: "12vw" } },
            { text: "Wallet: Check what the person has in wallet. You cannot use more coins for one path than he has available.", position: { top: "63vh", left: "60vw" } },
            { text: "🧑🏻: If you click on the person, you can see the task and requirements for the level. Some of them are hidden, so you need to carefully read the task.", position: { top: "55vh", left: "65vw" } }
        ],
        3: [
            { text: "+○: To add state click this button. The state will appear in the editor. The state will be your checkpoint to remember the values you will connect to it.", position: { top: "55vh", left: "0vw" } },
            { text: "x○: If you want to delete state click this button and select state you want to delete.", position: { top: "63vh", left: "1vw" } },
            { text: "💡 Use 0.1€ and 0.2€ coins to reach exactly 20 cents.", position: { top: "25vh", left: "36vw" } },
            { text: "Connect Start with q1 with 0.1€. Now if the automat will get 0.1€ in Start state it will move to q2.", position: { top: "18vh", left: "20vw" } },
            { text: "Now connect q2 with Accept with 0.2€ cents. The automat is in state q2 and if it gets 0.2€ cents it will move to accept.", position: { top: "10vh", left: "50vw" } }
        ],
        4: [
            { text: "You need to keep in mind, the automat does not remember how he got in each state, he just knows where he is and where he can move.", position: { top: "20vh", left: "35vw" } },
            { text: "When creating transition you can select more values. That means if the automat gets any of the values he will move to the other state. So 0.1€ OR 0.2€, not sum of them. BUT he does not know with which value he got to the other state, so you need to make precise paths.", position: { top: "20vh", left: "35vw" } }
        ]
    }
};

export default tutorialSteps;
