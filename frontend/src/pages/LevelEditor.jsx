import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../style.css";
import Menu from "../components/Menu";
import Loading from "../components/Loading";

export default function LevelEditorPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [levelName, setLevelName] = useState("");
    const [task, setTask] = useState("");
    const [transition_values, setTransitionValues] = useState([]);
    const [acceptedValues, setAcceptedValues] = useState([]);
    const [acceptAll, setAcceptAll] = useState(false);
    const [maxInputLength, setMaxInputLength] = useState("");
    const [sequences, setSequences] = useState([]);
    const [isPublic, setIsPublic] = useState(false);

    const [newTransitionValues, setNewTransitionValues] = useState("");
    const [newAcceptedValue, setNewAcceptedValue] = useState("");
    const [newSequence, setNewSequence] = useState("");
    const [alphabetCount, setAlphabetCount] = useState([]);
    const [newAlphabetValue, setNewAlphabetValue] = useState("");
    const [newAlphabetCount, setNewAlphabetCount] = useState("");
    const [forbiddenValues, setForbiddenValues] = useState([]);
    const [newForbiddenValue, setNewForbiddenValue] = useState("");
    const [acceptAllSequences, setAcceptAllSequences] = useState(false);
    const [type, setType] = useState("NFA");

    const [message, setMessage] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    const { levelId } = useParams();

    const showInfo = (message) => {
        setInfoMessage(message);
    };

    const addTransitionValues = () => {
        if (newTransitionValues) {
            setTransitionValues([...transition_values, parseFloat(newTransitionValues)]);
            setNewTransitionValues("");
        }
    };

    const removeTransitionValues = (index) => {
        setTransitionValues(transition_values.filter((_, i) => i !== index));
    };

    const addAcceptedValue = () => {
        if (newAcceptedValue) {
            setAcceptedValues([...acceptedValues, parseFloat(newAcceptedValue)]);
            setNewAcceptedValue("");
        }
    };

    const removeAcceptedValue = (index) => {
        setAcceptedValues(acceptedValues.filter((_, i) => i !== index));
    };

    const addSequence = () => {
        if (newSequence) {
            const sequenceList = newSequence.split(",").map(Number);
            setSequences([...sequences, sequenceList]);
            setNewSequence("");
        }
    };

    const removeSequence = (index) => {
        setSequences(sequences.filter((_, i) => i !== index));
    };

    useEffect(() => {
        setLoading(true);
        if (levelId) {
            fetch(`/api/v1/level?level_id=${levelId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched level data:", data);
                setLevelName(data.level_name || "");
                setTask(data.task || "");
        
                const setup = data.setup || {};
                setTransitionValues(setup.transition_values || []);
                setAcceptedValues(setup.accepted_values || []);
                setAcceptAll(setup.accept_all_values || false);
                setSequences(setup.sequences || []);
                setIsPublic(data.public || false);
                setMaxInputLength(setup.max_input_length || "");
            })
            .catch(err => {
                console.error("Failed to load level data:", err);
                setMessage("Failed to load existing level data.");
            })
            .finally(() => setLoading(false));
        }
    }, [levelId]);

    const handleSave = () => {
        setLoading(true);
        if (!levelName.trim()) {
            setMessage("Level name is required.");
            setLoading(false);
            return;
        }
        if (!task.trim()) {
            setMessage("Task description is required.");
            setLoading(false);
            return;
        }
        if (!transition_values || transition_values.length === 0) {
            setMessage("Transition values must contain at least one value.");
            setLoading(false);
            return;
        }
        
        if (!acceptedValues || acceptedValues.length === 0) {
            setMessage("Accepted values must contain at least one value.");
            setLoading(false);
            return;
        }

        const levelData = {
            level_name: levelName,
            task,
            public: isPublic,
            setup: {
                transition_values,
                accepted_values: acceptedValues,
                accept_all_values: acceptAll,
                sequences,
                max_input_length: maxInputLength,
                type: "NFA"
            }
        };
    
        const url = levelId
            ? `/api/v1/update_level?level_id=${levelId}`
            : "/api/v1/save_level";
    
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(levelData)
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            if (data.level_id) {
                setMessage("Level created! Redirecting...");
                setTimeout(() => {
                    navigate(`/level_editor/${data.level_id}`);
                }, 1000);
            } else {
                setMessage("Level saved successfully! Redirecting...");
                setTimeout(() => {
                    navigate("/user_levels");
                }, 2000);
            }
        })
        .catch(err => {
            setLoading(false);
            console.error("Failed to save level:", err);
            setMessage("Error saving level.");
        })
        .finally(() => setLoading(false));
    };

    return (
        <div className="start-page">
            <Menu />
            {message && (
                <div className="auth-banner">
                    {message}
                    <button className="auth-banner-close" onClick={() => setMessage("")}>✖</button>
                </div>
            )}
            {infoMessage && (
                <div className="info-banner">
                    {infoMessage}
                    <button className="auth-banner-close" onClick={() => setInfoMessage("")}>✖</button>
                </div>
            )}

            {loading && (
                <Loading message="Loading level editor..." />
            )}

            <h1 className="title2">Create/Edit Level</h1>

            <div className="form-container level-editor-form">
                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "200px" }}>
                        Level Name:
                        <button type="button" className="info-button" onClick={() => showInfo("Name of the level (will be displayed in lists)")}>ℹ️</button>
                    </label>
                    <input value={levelName} onChange={(e) => setLevelName(e.target.value)} className="form-input" />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "200px" }}>
                        Task:
                        <button type="button" className="info-button" onClick={() => showInfo("Task description shown to the player. If you want to make text bold, put it inside ** ** (e.g. **70 cents**).")}>ℹ️</button>
                    </label>
                    <input value={task} onChange={(e) => setTask(e.target.value)} className="form-input" />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "300px" }}>
                        Transition values (coin values):
                        <button type="button" className="info-button" onClick={() => showInfo("Monetary values available for transitions.")}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newTransitionValues} onChange={(e) => setNewTransitionValues(e.target.value)} className="form-input flex-grow-1" />
                        <button onClick={addTransitionValues} className="form-button small">Add</button>
                    </div>
                </div>
                <ul>
                    {transition_values.map((value, index) => (
                        <li key={index}>
                            {value}
                            <button onClick={() => removeTransitionValues(index)} className="remove-button2">✖</button>
                        </li>
                    ))}
                </ul>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "300px" }}>
                        Wallet (value → count):
                        <button type="button" className="info-button" onClick={() => showInfo("Set how many times each value can be used in transitions.")}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newAlphabetValue} onChange={(e) => setNewAlphabetValue(e.target.value)} placeholder="Value" className="form-input flex-grow-1" />
                        <input value={newAlphabetCount} onChange={(e) => setNewAlphabetCount(e.target.value)} placeholder="Count" className="form-input flex-grow-1" />
                        <button onClick={() => {
                            setAlphabetCount([...alphabetCount, { value: parseFloat(newAlphabetValue), count: parseInt(newAlphabetCount) }]);
                            setNewAlphabetValue("");
                            setNewAlphabetCount("");
                        }} className="form-button small">Add</button>
                    </div>
                </div>
                <ul>
                    {alphabetCount.map((item, index) => (
                        <li key={index}>
                            {item.value} → {item.count}
                            <button onClick={() => setAlphabetCount(alphabetCount.filter((_, i) => i !== index))} className="remove-button2">✖</button>
                        </li>
                    ))}
                </ul>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "300px" }}>
                        Accepted Values:
                        <button type="button" className="info-button" onClick={() => showInfo("The target values the player needs to reach to accept")}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newAcceptedValue} onChange={(e) => setNewAcceptedValue(e.target.value)} className="form-input flex-grow-1" />
                        <button onClick={addAcceptedValue} className="form-button small">Add</button>
                    </div>
                </div>
                <ul>
                    {acceptedValues.map((value, index) => (
                        <li key={index}>
                            {value}
                            <button onClick={() => removeAcceptedValue(index)} className="remove-button2">✖</button>
                        </li>
                    ))}
                </ul>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "320px" }}>
                        Accept All Combinations:
                        <button type="button" className="info-button" onClick={() => showInfo("Should the automat accept ALL valid combinations or just one?")}>ℹ️</button>
                    </label>
                    <input type="checkbox" checked={acceptAll} onChange={() => setAcceptAll(!acceptAll)} />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Forbidden Values:
                        <button type="button" className="info-button" onClick={() => showInfo("Values that cannot be used in transitions.")}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newForbiddenValue} onChange={(e) => setNewForbiddenValue(e.target.value)} className="form-input flex-grow-1" />
                        <button onClick={() => {
                            setForbiddenValues([...forbiddenValues, parseFloat(newForbiddenValue)]);
                            setNewForbiddenValue("");
                        }} className="form-button small">Add</button>
                    </div>
                </div>
                <ul>
                    {forbiddenValues.map((value, index) => (
                        <li key={index}>
                            {value}
                            <button onClick={() => setForbiddenValues(forbiddenValues.filter((_, i) => i !== index))} className="remove-button2">✖</button>
                        </li>
                    ))}
                </ul>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Sequences:
                        <button type="button" className="info-button" onClick={() => showInfo("Required sequences that must be accepted (format: 0.1,0.2)")}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newSequence} onChange={(e) => setNewSequence(e.target.value)} className="form-input flex-grow-1" />
                        <button onClick={addSequence} className="form-button small">Add</button>
                    </div>
                </div>
                <ul>
                    {sequences.map((seq, index) => (
                        <li key={index}>
                            [{seq.join(", ")}]
                            <button onClick={() => removeSequence(index)} className="remove-button2">✖</button>
                        </li>
                    ))}
                </ul>
                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "320px" }}>
                        Accept All Sequences:
                        <button type="button" className="info-button" onClick={() => showInfo("Should the automaton accept all defined sequences?")}>ℹ️</button>
                    </label>
                    <input type="checkbox" checked={acceptAllSequences} onChange={() => setAcceptAllSequences(!acceptAllSequences)} />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Max input length:
                        <button type="button" className="info-button" onClick={() => showInfo("Limit on how long can one path be.")}>ℹ️</button>
                    </label>
                    <input type="number" value={maxInputLength} onChange={(e) => setMaxInputLength(parseInt(e.target.value))} className="form-input" />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Automaton Type:
                        <button type="button" className="info-button" onClick={() => showInfo("Choose between NFA or DFA.")}>ℹ️</button>
                    </label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="form-input">
                        <option value="NFA">NFA</option>
                        <option value="DFA">DFA</option>
                    </select>
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Public Level:
                        <button type="button" className="info-button" onClick={() => showInfo("Would you like the level to be seen by others?")}>ℹ️</button>
                    </label>
                    <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                </div>

                <button onClick={handleSave} className="form-button">Save Level</button>
            </div>
        </div>
    );
}
