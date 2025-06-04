import "./TutorialBubble.css";

export default function TutorialBubble({ text, position, onPrev, onNext }) {
  return (
    <div
      className="tutorial-bubble"
      style={{ top: position.top, left: position.left, position: "absolute" }}
    >
      <div className="tutorial-bubble-text">
        {text}
      </div>
      <div className={`tutorial-bubble-buttons ${onPrev ? "has-prev" : ""}`}>
        {onPrev && (
          <button className="tutorial-bubble-button" onClick={onPrev}>Previous</button>
        )}
        <button className="tutorial-bubble-button" onClick={onNext}>Next</button>
      </div>
    </div>
  );
}
