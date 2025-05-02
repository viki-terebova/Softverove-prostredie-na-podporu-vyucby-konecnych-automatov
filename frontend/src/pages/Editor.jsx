import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "./../components/Button"; 
import "./../style.css";
import Menu from "../components/Menu";
import { Stage, Layer } from "react-konva";
import StateNode from "../components/StateNode";
import TransitionArrow from "../components/TransitionArrow";

const EditorPage = () => {
  const { levelId: paramLevelId } = useParams();
  const [levelId, setLevelId] = useState(() => {
    const saved = localStorage.getItem('automat_level_id');
    return paramLevelId || saved || null;
  });
  const [level, setLevel] = useState(null);
  const [stateCounter, setStateCounter] = useState(() => {
    const savedStates = localStorage.getItem('automat_states');
    if (savedStates) {
      const parsed = JSON.parse(savedStates);
      const qNumbers = parsed
        .filter(state => /^q\d+$/.test(state.id))
        .map(state => parseInt(state.id.slice(1)));
      if (qNumbers.length > 0) {
        return Math.max(...qNumbers) + 1;
      }
    }
    return 2;
  });
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 400, height: 400 });
  const [transitions, setTransitions] = useState(() => {
    const savedTransitions = localStorage.getItem('automat_transitions');
    return savedTransitions ? JSON.parse(savedTransitions) : [];
  });
  const [selectedState, setSelectedState] = useState(null);
  const [addingTransitionMode, setAddingTransitionMode] = useState(false);
  const [deleteTransitionMode, setdeleteTransitionMode] = useState(false);
  const [deleteStateMode, setDeleteStateMode] = useState(false);
  const [pendingTransition, setPendingTransition] = useState(null);
  
  const [states, setStates] = useState(() => {
    const savedStates = localStorage.getItem('automat_states');
    return savedStates ? JSON.parse(savedStates) : [
      {
        id: "Start",
        x: 200,
        y: stageSize.height / 2,
        isInitial: true,
        isAccepting: false
      },
      {
        id: "Accept",
        x: stageSize.width - 200,
        y: stageSize.height / 2,
        isInitial: false,
        isAccepting: true
      }
    ];
  });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    }
    
    const savedStates = localStorage.getItem('automat_states');
    if (savedStates) {
      setStates(JSON.parse(savedStates));
    }
  
    const savedTransitions = localStorage.getItem('automat_transitions');
    if (savedTransitions) {
      setTransitions(JSON.parse(savedTransitions));
    }
  }, []);

  useEffect(() => {
    if (levelId) {
      localStorage.setItem('automat_level_id', levelId);
      fetch(`/api/v1/level?level_id=${levelId}`)
      .then(res => res.json())
      .then(data => setLevel(data))
      .catch(err => console.error("Failed to load level", err));
    }
  }, [levelId]);

  useEffect(() => {
    localStorage.setItem('automat_states', JSON.stringify(states));
  }, [states]);
  
  useEffect(() => {
    localStorage.setItem('automat_transitions', JSON.stringify(transitions));
  }, [transitions]);

  const addState = () => {
    const newState = {
      id: `q${stateCounter}`,
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      isInitial: stateCounter === 0,
      isAccepting: false
    };
    setStates(prev => [...prev, newState]);
    setStateCounter(prev => prev + 1);
  };

  const handleStateClick = (stateId) => {
    if (deleteStateMode) {
      if (stateId === "Start" || stateId === "Accept") {
        alert("⚠️ You cannot delete the Start or Accept states.");
        return;
      }
      const confirmDelete = window.confirm(`Delete state ${stateId}?`);
      if (confirmDelete) {
        setStates(prev => prev.filter(s => s.id !== stateId)); 
        setTransitions(prev => prev.filter(t => t.from !== stateId && t.to !== stateId));
        setSelectedState(null);
      }
      return;
    }
  
    if (!addingTransitionMode) return;
  
    if (!selectedState) {
      setSelectedState(stateId);
    } else if (selectedState === stateId) {
      setSelectedState(null);
    } else {
      setPendingTransition({ from: selectedState, to: stateId });
      setSelectedState(null);
    }
  };

  const handleTransitionClick = (index) => {
    const confirmDelete = window.confirm("Delete this transition?");
    if (confirmDelete) {
      setTransitions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const resetAutomat = () => {
    const confirmReset = window.confirm("Are you sure you want to reset the automat?");
    if (confirmReset) {
      const defaultStates = [
        {
          id: "Start",
          x: 200,
          y: stageSize.height / 2,
          isInitial: true,
          isAccepting: false
        },
        {
          id: "Accept",
          x: stageSize.width - 200,
          y: stageSize.height / 2,
          isInitial: false,
          isAccepting: true
        }
      ];
      const defaultTransitions = [];
  
      setStates(defaultStates);
      setTransitions(defaultTransitions);
      setStateCounter(2);
  
      localStorage.setItem('automat_states', JSON.stringify(defaultStates));
      localStorage.setItem('automat_transitions', JSON.stringify(defaultTransitions));
    }
  };

  const handleSelectValue = (value) => {
    if (!value || !pendingTransition) return;
  
    const newTransition = {
      from: pendingTransition.from,
      to: pendingTransition.to,
      value: parseFloat(value).toFixed(2)
    };
  
    setTransitions(prev => [...prev, newTransition]);
    setPendingTransition(null); 
  };

  const handleTest = async () => {
    const automatData = {
      states: states.map(state => state.id),
      start_state: "Start",
      accept_states: ["Accept"],
      transitions: transitions.map(t => ({
        from: t.from,
        to: t.to,
        value: t.value.toString()
      })),
      level_id: levelId.toString()
    };
  
    try {
      const response = await fetch("/api/v1/test_automat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(automatData)
      });
  
      const result = await response.json();
      console.log(result);
  
      // Now animate result.path etc
    } catch (error) {
      console.error("Error testing automat:", error);
    }
  };

  return (
    <div className="start-page level-page">
      <Menu />
      <h1 className="title2">🛠 Automat Editor</h1>
      <div className="editor-window">

        <div className="editor-stage-wrapper" ref={containerRef}>
        {stageSize.width && stageSize.height && (
          <Stage
            className="editor-stage"
            width={stageSize.width}
            height={stageSize.height}
          >
            <Layer>
              {transitions.map((t, index) => {
                const from = states.find(s => s.id === t.from);
                const to = states.find(s => s.id === t.to);
                if (!from || !to) return null;

                return (
                  <TransitionArrow
                    key={index}
                    fromX={from.x}
                    fromY={from.y}
                    toX={to.x}
                    toY={to.y}
                    value={t.value}
                    deleteMode={deleteTransitionMode}
                    onClick={() => handleTransitionClick(index)}
                  />
                );
              })}
              {states.map((state) => (
                <StateNode
                  key={state.id}
                  id={state.id}
                  x={state.x}
                  y={state.y}
                  isInitial={state.isInitial}
                  isAccepting={state.isAccepting}
                  onClick={() => handleStateClick(state.id)}
                  onDragMove={({ x, y }) => {
                    setStates(prev =>
                      prev.map(s => (s.id === state.id ? { ...s, x, y } : s))
                    );
                  }}
                  selected={
                    selectedState === state.id ||
                    (pendingTransition && (pendingTransition.from === state.id || pendingTransition.to === state.id))
                  }
                  deleteMode={deleteStateMode}
                />
              ))}
            </Layer>
          </Stage>
          )}
          {pendingTransition && level && (
            <div className="value-selection-banner">
              <span>Transition value:</span>
              <select onChange={(e) => handleSelectValue(e.target.value)}>
                <option value="">*Select Value*</option>
                {level.setup.alphabet.map((value, idx) => (
                  <option key={idx} value={value.toString()}>
                    {value} €
                  </option>
                ))}
              </select>
              <button className="auth-banner-close" onClick={() => setPendingTransition(null)}>
                x
              </button>
            </div>
          )}


          <div className="editor-footer">
          <div className="footer-center">
          <div className=" editor-button add-state-button" onClick={addState} title="Add state">+○</div>
          <div
            className={`editor-button remove-button ${deleteStateMode ? "active" : ""}`}
            onClick={() => {
              setDeleteStateMode(prev => {
                if (!prev) setAddingTransitionMode(false); 
                return !prev;
              });
            }}
            title="Delete state"
          >
            +○
          </div>
          <div
            className={`editor-button add-arrow-button ${addingTransitionMode ? "active" : ""}`}
            onClick={() => setAddingTransitionMode(prev => !prev)}
            title="Create transition"
          >
            +↗
          </div>
          <div
            className={`editor-button remove-button ${deleteTransitionMode ? "active" : ""}`}
            onClick={() => setdeleteTransitionMode(prev => !prev)}
            title="Delete transition"
          >
            x↗
          </div>
          <div
            className={`reset-button ${deleteTransitionMode ? "active" : ""}`}
            onClick={resetAutomat}
            title="Reset"
          >
            Reset
          </div>
          </div>
          <div className="footer-right">
            <Button text="Test" onClick={handleTest} />
          </div>
        </div>
        
        </div>
        </div>
    </div>
  );
};

export default EditorPage;
