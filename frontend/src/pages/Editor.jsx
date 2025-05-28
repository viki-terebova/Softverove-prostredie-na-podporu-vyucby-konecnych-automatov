import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Button from "./../components/Button"; 
import "./../style.css";
import Menu from "../components/Menu";
import { Stage, Layer } from "react-konva";
import StateNode from "../components/StateNode";
import TransitionArrow from "../components/TransitionArrow";
import { formatBold } from "../utils/formatText";
import Loading from "../components/Loading";

const EditorPage = () => {
  const { levelId: paramLevelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const page_from = localStorage.getItem("page_from") || `categories`;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.message || "");
  const [showRequirements, setShowRequirements] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stageReady, setStageReady] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);
  const [hasAchievedLevel, setHasAchievedLevel] = useState(false);
  const [selectedCoins, setSelectedCoins] = useState({});

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
        y: stageSize.height / 3,
        isInitial: false,
        isAccepting: true
      },
      {
        id: "Reject",
        x: stageSize.width - 200,
        y: stageSize.height / 3 * 2,
        isInitial: false,
        isAccepting: false
      }
    ];
  });

  
  const handleStateClick = (stateId) => {
    if (deleteStateMode) {
      if (stateId === "Start" || stateId === "Accept" || stateId === "Reject") {
        alert("⚠️ You cannot delete the Start or Accept or Reject states.");
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
  
    if (!addingTransitionMode) {
      setSelectedState(null);
      setPendingTransition(null);
      return;
    }
  
    if (!selectedState) {
      setSelectedState(stateId);
    } else if (selectedState === stateId) {
      setPendingTransition({ from: stateId, to: stateId });
      setSelectedState(null);
    } else {
      setPendingTransition({ from: selectedState, to: stateId });
      setSelectedState(null);
    }
  };

  const handleTransitionClick = (index) => {
    if (!deleteTransitionMode) return;
    const transition = transitions[index];
    const value = transition.values
      ? transition.values.map(v => `${v}€`).join(", ")
      : `${transition.value}€`;
    const confirmDelete = window.confirm(`Delete transition with value(s): ${value}?`);
    if (confirmDelete) {
      setTransitions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const performReset = () => {
    setLoading(true);
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
        y: stageSize.height / 3,
        isInitial: false,
        isAccepting: true
      },
      {
        id: "Reject",
        x: stageSize.width - 200,
        y: stageSize.height / 3 * 2,
        isInitial: false,
        isAccepting: false
      }
    ];
    const defaultTransitions = [];
  
    setStates(defaultStates);
    setTransitions(defaultTransitions);
    setStateCounter(2);
  
    localStorage.setItem("automat_states", JSON.stringify(defaultStates));
    localStorage.setItem("automat_transitions", JSON.stringify(defaultTransitions));
    setLoading(false);
  };

  const resetAutomat = () => {
    const confirmReset = window.confirm("Are you sure you want to reset the automat?");
    if (confirmReset) {
      performReset();
    }
  };

  const toggleCoin = (value) => {
    setSelectedCoins(prev => ({ ...prev, [value]: !prev[value] }));
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
      states: states,
      start_state: "Start",
      accept_states: ["Accept"],
      transitions: transitions.flatMap(t =>
        (t.values || [t.value]).map(value => ({
          from: t.from,
          to: t.to,
          value: value.toString()
        }))
      ),
      level_id: levelId.toString()
    };
  
    setLoading(true);
    try {
      const response = await fetch("/api/v1/test_automat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(automatData)
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setMessage(result.error || "Unknown error occurred.");
      } else if (result.accepted === false) {
        setMessage(result.reason || "Automat was rejected.");
      } else {

        setMessage("");
        setSuccessMessage("✅ Automat successfully completed!");
        if (!hasAchievedLevel) {
          setShowStars(true);
        }
      
        fetch("/api/v1/get_user_score")
          .then(res => res.json())
          .then(data => {
            localStorage.setItem("user_score", data.score);
          });
      
        setTimeout(() => {
          performReset();
          navigate(page_from);
          localStorage.removeItem("page_from");
        }, 3000);
      }

    } catch (error) {
      console.error("Error testing automat:", error);
      setMessage("Could not connect to the server.");
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
      setStageReady(true);
    }
    setLoading(false);
  }, []);
  
  useEffect(() => {
    if (!levelId) return;
  
    setLoading(true);
    localStorage.removeItem("automat_states");
    localStorage.removeItem("automat_transitions");
    setStates([]);
    setTransitions([]);
    setSelectedState(null);
  
    fetch(`/api/v1/level?level_id=${levelId}`)
      .then(res => res.json())
      .then(levelData => {
        setLevel(levelData);
  
        fetch(`/api/v1/achieved_level?level_id=${levelId}`)
          .then(res => res.json())
          .then(data => {
            if (data.exists) {
              setHasAchievedLevel(true);
  
              const stateData = data.states;
              const transitionData = data.transitions;
  
              setStates(stateData);
              setTransitions(transitionData);
              console.log("Loaded states:", stateData);
              console.log("Loaded transitions:", transitionData);
  
              localStorage.setItem("automat_states", JSON.stringify(stateData));
              localStorage.setItem("automat_transitions", JSON.stringify(transitionData));
  
              const qNumbers = stateData
                .filter(s => /^q\d+$/.test(s.id))
                .map(s => parseInt(s.id.slice(1)));
              if (qNumbers.length > 0) {
                setStateCounter(Math.max(...qNumbers) + 1);
              }
            } else {
              setShouldReset(true);
            }
          })
          .finally(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, [levelId]);
  
  useEffect(() => {
    if (stageReady && shouldReset) {
      performReset();
      setShouldReset(false);
    }
  }, [stageReady, shouldReset]);

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

  return (
    <div className="start-page level-page">
      <Menu />
      {message && (
        <div className="info-banner">
          {message}
          <button className="auth-banner-close" onClick={() => setMessage("")}>✖</button>
        </div>
      )}

      {successMessage && (
        <div className="info-banner" style={{ backgroundColor: "#e0ffe0", color: "#006600" }}>
          {successMessage}
          <button className="auth-banner-close" onClick={() => setSuccessMessage("")}>✖</button>
        </div>
      )}

      {showStars && (
        <div className="stars-earned-animation">
          ⭐️ +5 Stars!
        </div>
      )}

      {showRequirements && level && (
        <div className="speech-bubble">
          <div className="speech-text">
            <strong>Task:</strong><br />
            {formatBold(level.task)}
            <br /><br />
            {level.setup.alphabet_count && Object.keys(level.setup.alphabet_count).length > 0 && (
              <div>
                <strong>
                  <img 
                    src="/images/icons/wallet.png" 
                    alt="Wallet" 
                    style={{ width: "25px", verticalAlign: "middle", marginRight: "6px" }} 
                  />
                  Wallet:
                </strong><br />
                {Object.entries(level.setup.alphabet_count).map(([coin, count]) => (
                  <div key={coin}>
                    {coin} € × {count}
                  </div>
                ))}
              </div>
            )}
            <br />
            <button onClick={() => setShowRequirements(false)}>✖ Close</button>
          </div>
        </div>
      )}

      {showHint && level && (
        <div className="speech-bubble hint-bubble">
          <div className="speech-text hint-bubble">
            <strong>💡 Level Requirements</strong>
            <br /><br />

            <strong>✅ Accepted values:</strong><br />
            {level.setup.accepted_values?.length
              ? level.setup.accepted_values.join(", ") + " €"
              : "None"}
            <br /><br />

            <strong>🚫 Forbidden values:</strong><br />
            {level.setup.forbidden_values?.length
              ? level.setup.forbidden_values.join(", ") + " €"
              : "None"}
            <br /><br />

            <strong>📏 Max input length:</strong><br />
            {level.setup.max_input_length !== null && level.setup.max_input_length !== undefined
              ? level.setup.max_input_length
              : "None"}
            <br /><br />

            <strong>🫧 Automat type:</strong><br />
            {level.setup.type || "-"}
            <br /><br />

            <button onClick={() => setShowHint(false)}>✖ Close</button>
          </div>
        </div>
      )}

      {loading && (
          <Loading message="Loading level editor..." />
      )}

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
              {(() => {
                const transitionPairs = new Set(transitions.map(t => `${t.from}->${t.to}`));

                return transitions.map((t, index) => {
                  const from = states.find(s => s.id === t.from);
                  const to = states.find(s => s.id === t.to);
                  if (!from || !to) return null;

                  const fromId = t.from;
                  const toId = t.to;
                  const hasOpposite = transitionPairs.has(`${toId}->${fromId}`);
                  const directionOffset = hasOpposite ? -1 : 0;

                  console.log("Transition:", t, "From:", from, "To:", to, "Direction Offset:", directionOffset);

                  return (
                    <TransitionArrow
                      key={index}
                      fromX={from.x}
                      fromY={from.y}
                      toX={to.x}
                      toY={to.y}
                      value={Array.isArray(t.values)
                        ? t.values.map(v => `${v}€`).join(", ")
                        : `${t.value}€`}
                      deleteMode={deleteTransitionMode}
                      onClick={() => handleTransitionClick(index)}
                      directionOffset={directionOffset}
                    />
                  );
                });
              })()}
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
              <span>Select values for transition:</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {level.setup.transition_values.map((value, idx) => (
                  <label key={idx}>
                    <input
                      type="checkbox"
                      checked={selectedCoins[value] || false}
                      onChange={() => toggleCoin(value)}
                    />
                    {value} €
                  </label>
                ))}
              </div>
              <div style={{ marginTop: "8px" }}>
                <button className="form-button" style={{ width: "8vw" }} onClick={() => {
                  const values = Object.entries(selectedCoins)
                    .filter(([_, checked]) => checked)
                    .map(([val]) => val);

                  if (values.length > 0) {
                    setTransitions(prev => [...prev, {
                      from: pendingTransition.from,
                      to: pendingTransition.to,
                      values
                    }]);
                  }

                  setSelectedCoins({});
                  setPendingTransition(null);
                }}>
                  Confirm
                </button>
                <button className="auth-banner-close" onClick={() => setPendingTransition(null)}>
                  x Close
                </button>
              </div>
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
                setSelectedState(null);
                return !prev;
              });
            }}
            title="Delete state"
          >
            x○
          </div>
          <div
            className={`editor-button add-arrow-button ${addingTransitionMode ? "active" : ""}`}
            onClick={() => {
              setAddingTransitionMode(prev => {
                const newState = !prev;
                if (!newState) {
                  setSelectedState(null);
                  setPendingTransition(null);
                }
                return newState;
              });
            }}
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
            className={`reset-button`}
            onClick={resetAutomat}
            title="Reset"
          >
            Reset
          </div>
          </div>
          <div className="footer-right">
            {level?.person_image && (
              <div className="character-with-hint">
                <img
                  src="/images/icons/bulb.png"
                  alt="Hint"
                  title="View requirements"
                  className="hint-icon"
                  onClick={() => setShowHint(prev => !prev)}
                />

                <img
                  src={`/images/persons/${level.person_image}`}
                  alt="Character"
                  title="View task"
                  onClick={() => setShowRequirements(true)}
                  className="character-icon"
                />
              </div>
              )}
            <Button text="Test" onClick={handleTest} />
          </div>
        </div>
        
        </div>
        </div>
    </div>
  );
};

export default EditorPage;
