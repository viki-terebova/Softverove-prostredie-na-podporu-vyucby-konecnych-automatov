import React from "react";
import { Arrow, Text } from "react-konva";

const nodeRadius = 34;

const TransitionArrow = ({ fromX, fromY, toX, toY, value, onClick, deleteMode }) => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (dx / dist) * nodeRadius;
  const offsetY = (dy / dist) * nodeRadius;

  return (
    <>
      <Arrow
        points={[
          fromX + offsetX,
          fromY + offsetY,
          toX - offsetX,
          toY - offsetY,
        ]}
        pointerLength={10}
        pointerWidth={10}
        stroke="black"
        fill="black"
        strokeWidth={2}
        onClick={onClick}
      />
      
      <Text
        text={`${value} €`}
        fontSize={16}
        fill="red"
        x={(fromX + toX) / 2}
        y={(fromY + toY) / 2 - 20}
      />
      {deleteMode && (
        <Arrow
          points={[
            fromX + offsetX,
            fromY + offsetY,
            toX - offsetX,
            toY - offsetY,
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
