import React from "react";
import { Group, Circle, Text } from "react-konva";

const StateNode = ({ id, x, y, isInitial, isAccepting, onClick, onDragMove, selected, deleteMode }) => {
    const fillColor = isAccepting ? "#72d7ff" : (isInitial ? "#85ff85" : (id === "Reject" ? "#ff4444" : "white"));
    const strokeStyle = isInitial ? "#008f07" : "black";
    const isProtectedState = ["Start", "Accept", "Reject"].includes(id);

    return (
        <Group
            x={x}
            y={y}
            draggable
            onClick={onClick}
            onDragMove={(e) => {
                const { x: newX, y: newY } = e.target.position();
                onDragMove({ x: newX, y: newY });
            }}
        >
            <Circle
                radius={34}
                fill={fillColor}
                stroke={strokeStyle}
                strokeWidth={2}
            />
            {isAccepting && (
                <Circle
                    radius={40}
                    stroke={strokeStyle}
                    strokeWidth={2}
                />
            )}

            <Text
                text={id}
                fontSize={16}
                fill="black"
                width={68}
                height={34}
                align="center"
                verticalAlign="middle"
                offsetX={34}
                offsetY={17}
            />

            {((deleteMode && !isProtectedState) || selected) && (
                <Circle
                    radius={40}
                    stroke="#fbff003d"
                    strokeWidth={10}
                />
            )}
        </Group>
    );
};

export default StateNode;
