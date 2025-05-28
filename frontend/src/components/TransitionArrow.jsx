import React from "react";
import { Arrow, Text, Line } from "react-konva";

const nodeRadius = 34;

const TransitionArrow = ({ fromX, fromY, toX, toY, value, onClick, deleteMode, directionOffset = 0 }) => {
  const isSelfLoop = fromX === toX && fromY === toY;

  if (isSelfLoop) {
    const loopOffsetX = 40;
    const loopOffsetY = 60;

    return (
      <>
        <Line
          points={[
            fromX, fromY,
            fromX + 20, fromY - 50,
            fromX - 20, fromY - 50,
            fromX, fromY
          ]}
          tension={0.5}
          bezier
          stroke="black"
          strokeWidth={2}
          onClick={onClick}
        />

        <Arrow
          points={[
            fromX - 5, fromY - 60,
            fromX, fromY - 50
          ]}
          pointerLength={10}
          pointerWidth={10}
          stroke="black"
          fill="black"
          strokeWidth={2}
        />

        <Text
          text={`${value}`}
          fontSize={16}
          fill="red"
          x={fromX - 25}
          y={fromY - loopOffsetY - 25}
        />

        {deleteMode && (
          <Line
            points={[
              fromX, fromY,
              fromX + 20, fromY - 50,
              fromX - 20, fromY - 50,
              fromX, fromY
            ]}
            tension={0.5}
            bezier
            stroke="#fbff003d"
            strokeWidth={20}
            onClick={onClick}
            listening={true}
          />
        )}
      </>
    );
  }

  // Regular transition (non-self-loop)
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (dx / dist) * nodeRadius;
  const offsetY = (dy / dist) * nodeRadius;

  // Calculate perpendicular offset
  const bendX = -(dy / dist) * 12 * directionOffset;
  const bendY = dx / dist * 12 * directionOffset;

  return (
    <>
      <Arrow
        points={[
          fromX + offsetX + bendX,
          fromY + offsetY + bendY,
          toX - offsetX + bendX,
          toY - offsetY + bendY,
        ]}
        pointerLength={10}
        pointerWidth={10}
        stroke="black"
        fill="black"
        strokeWidth={2}
        onClick={onClick}
      />
      
      <Text
        text={`${value}`}
        fontSize={16}
        fill="red"
        x={(fromX + toX) / 2 + bendX}
        y={(fromY + toY) / 2 + bendY - 20}
      />

      {deleteMode && (
        <Arrow
          points={[
            fromX + offsetX + bendX,
            fromY + offsetY + bendY,
            toX - offsetX + bendX,
            toY - offsetY + bendY,
          ]}
          stroke="#fbff003d"
          fill="transparent"
          strokeWidth={20}
          onClick={onClick}
          listening={true}
        />
      )}
    </>
  );
};

export default TransitionArrow;
