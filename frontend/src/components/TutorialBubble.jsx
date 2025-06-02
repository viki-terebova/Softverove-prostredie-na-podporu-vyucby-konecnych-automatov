import "./TutorialBubble.css";

export default function TutorialBubble({ text, position, onNext }) {
  return (
    <div
      className="tutorial-bubble"
      style={{ top: position.top, left: position.left, position: "absolute" }}
    >
      <div className="tutorial-bubble-text">
        {text}
      </div>
      <button className="tutorial-bubble-button" onClick={onNext}>Next</button>
    </div>
  );
}
