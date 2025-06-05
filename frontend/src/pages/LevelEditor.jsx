import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../style.css";
import Menu from "../components/Menu";
import Loading from "../components/Loading";
import infoMessages from "../utils/infoMessages";

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
        const raw = newTransitionValues.trim();
        const v = parseFloat(raw);

        if (!raw || !isFinite(v) || v <= 0) {
            setMessage("Transition value must be a positive number.");
            return;
        }

        const filtered = transition_values.filter(val => val !== v);
        setTransitionValues([...filtered, v]);

        setNewTransitionValues("");
        setMessage("");
        };

    const removeTransitionValues = (index) => {
        setTransitionValues(transition_values.filter((_, i) => i !== index));
    };

    const addAcceptedValue = () => {
    const raw = newAcceptedValue.trim();
    if (!raw) return;

    try {
        if (raw.startsWith("{")) {
            const obj = JSON.parse(raw);

            const validKeys = [
                "ends_with",
                "starts_with",
                "alternating",
                "repeat",
                "start_from_each"
            ];

            const keys = Object.keys(obj);

            if (keys.length !== 1 || !validKeys.includes(keys[0])) {
                throw new Error("Invalid rule type.");
            }

            const value = obj[keys[0]];

            switch (keys[0]) {
                case "ends_with":
                case "starts_with":
                    if (
                        !Array.isArray(value) ||
                        value.some(v => typeof v !== "number")
                    ) {
                        throw new Error(`${keys[0]} must be an array of numbers.`);
                    }
                    break;
                case "alternating":
                    if (!Array.isArray(value) || value.some(v => typeof v !== "number")) {
                        throw new Error("Alternating must be an array of numbers.");
                    }
                    break;
                case "repeat":
                    if (
                        !Array.isArray(value) ||
                        value.length !== 2 ||
                        typeof value[0] !== "number" ||
                        typeof value[1] !== "number"
                    ) {
                        throw new Error("Repeat must be [number, count].");
                    }
                    break;
                case "start_from_each":
                    if (
                        !Array.isArray(value) ||
                        value.some(seq => !Array.isArray(seq) || seq.some(v => typeof v !== "number"))
                    ) {
                        throw new Error("Each pattern must be an array of numbers.");
                    }
                    break;
            }
            setAcceptedValues([obj]);

        } else {
            const values = raw
                .split(",")
                .map(v => parseFloat(v.trim()))
                .filter(v => !isNaN(v));

            if (values.length === 0) {
                throw new Error("No valid numeric values provided.");
        }

        const prev = acceptedValues.filter(v => typeof v === "number");
        const merged = Array.from(new Set([...prev, ...values]));

        setAcceptedValues(merged);
        }

        setNewAcceptedValue("");
        setMessage("");
    } catch (err) {
        setMessage("" + err.message);
    }
    };

    const removeAcceptedValue = (index) => {
        setAcceptedValues(acceptedValues.filter((_, i) => i !== index));
    };

    const addWalletValue = () => {
        const coinValue = parseFloat(newAlphabetValue.trim());
        const coinCount = parseInt(newAlphabetCount.trim());

        if (!isFinite(coinValue) || coinValue <= 0) {
            setMessage("Coin value must be a positive number.");
            return;
        }
        if (!Number.isInteger(coinCount) || coinCount <= 0) {
            setMessage("Coin count must be a positive integer.");
            return;
        }

        const withoutOldValue = alphabetCount.filter(entry => entry.value !== coinValue);
        const updated = [...withoutOldValue, { value: coinValue, count: coinCount }];

        setAlphabetCount([...updated]);
        setNewAlphabetValue("");
        setNewAlphabetCount("");
        setMessage("");
    };

    const addSequence = () => {
        if (!newSequence.trim()) return;
        const rawParts = newSequence.split(",");
        const sequenceList = [];

        for (let part of rawParts) {
            const num = parseFloat(part.trim());
            if (!isFinite(num)) {
                setMessage("All sequence values must be valid numbers.");
                return;
            }
            sequenceList.push(num);
        }
        const isDuplicate = sequences.some(seq =>
            seq.length === sequenceList.length &&
            seq.every((val, idx) => val === sequenceList[idx])
        );

        if (isDuplicate) {
            setNewSequence("");
            return;
        }

        setSequences([...sequences, sequenceList]);
        setNewSequence("");
        setMessage("");
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
                console.log("Setup data:", data.setup);
                const setup = data.setup || {};
                setTransitionValues(setup.transition_values || []);
                setAcceptAll(setup.accept_all || false);
                setSequences(setup.sequences || []);
                setIsPublic(data.public || false);
                setMaxInputLength(setup.max_input_length || "");
                setType(setup.type || "NFA");
                setAlphabetCount(Object.entries(setup.alphabet_count || {}).map(([value, count]) => ({ value: parseFloat(value), count })));
                setForbiddenValues(setup.forbidden_values || []);
                setAcceptAllSequences(setup.accept_all_sequences || false);
                if (Array.isArray(setup.accepted_values)) {
                    setAcceptedValues(setup.accepted_values);
                    setNewAcceptedValue("");
                } else if (
                    typeof setup.accepted_values === "object" &&
                    setup.accepted_values !== null
                ) {
                    setAcceptedValues([]);
                    setNewAcceptedValue(JSON.stringify(setup.accepted_values, null, 2)); 
                } else {
                    setAcceptedValues([]);
                    setNewAcceptedValue("");
                }
            })
            .catch(err => {
                console.error("Failed to load level data:", err);
                setMessage("Failed to load existing level data.");
            })
            .finally(() => setLoading(false));
        }
    }, [levelId]);

    useEffect(() => {
        if (newAcceptedValue && !acceptedValues.length) {
            addAcceptedValue();
        }
    }, [newAcceptedValue]);

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

        const parsedAcceptedValues = acceptedValues.map(v => parseFloat(v)).filter(v => !isNaN(v));
        if (parsedAcceptedValues.length === 0) {
            setMessage("Accepted values must contain at least one number.");
            setLoading(false);
            return;
        }

        const alphabetCountObject = {};
        alphabetCount.forEach(item => {
            alphabetCountObject[item.value] = item.count;
        });

        const levelData = {
            level_name: levelName,
            task,
            public: isPublic,
            setup: {
                transition_values,
                accepted_values: parsedAcceptedValues,
                accept_all: acceptAll,
                sequences,
                max_input_length: maxInputLength,
                type,
                alphabet_count: alphabetCountObject,
                forbidden_values: forbiddenValues,
                accept_all_sequences: acceptAllSequences
            }
        };
        console.log("acceptedValues:", acceptedValues);
        console.log("newAcceptedValue:", newAcceptedValue);
        console.log("parsedAcceptedValues:", parsedAcceptedValues);

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
                    <pre style={{ whiteSpace: "pre-wrap", maxHeight: "400px", overflowY: "auto", textAlign: "left" }}>{infoMessage}</pre>
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
                        Level Name: <span style={{ color: "red" }}>*</span>
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.levelName)}>ℹ️</button>
                    </label>
                    <input value={levelName} onChange={(e) => setLevelName(e.target.value)} className="form-input" />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "200px" }}>
                        Task: <span style={{ color: "red" }}>*</span>
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.task)}>ℹ️</button>
                    </label>
                    <input value={task} onChange={(e) => setTask(e.target.value)} className="form-input" />
                </div>

                
                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "280px" }}>
                        Accepted Values: <span style={{ color: "red" }}>*</span>
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.acceptedValues)}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newAcceptedValue} placeholder="e.g. 0.2, 0.3" onChange={(e) => setNewAcceptedValue(e.target.value)} className="form-input flex-grow-1" />
                        <button onClick={addAcceptedValue} className="form-button form-button-table small">Add</button>
                    </div>
                </div>
                <ul>
                    {Array.isArray(acceptedValues) && acceptedValues.map((value, index) => (
                        <li key={index}>
                            {typeof value === "object" ? JSON.stringify(value) : value}
                            <button onClick={() => removeAcceptedValue(index)} className="remove-button2">✖</button>
                        </li>
                    ))}
                </ul>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "280px" }}>
                        Coin values for transitions (€): <span style={{ color: "red" }}>*</span>
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.transitionValues)}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newTransitionValues} placeholder="0.2" onChange={(e) => setNewTransitionValues(e.target.value)} className="form-input flex-grow-1" />
                        <button onClick={addTransitionValues} placeholder="e.q. 0.2" className="form-button form-button-table small">Add</button>
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
                    <label className="form-label" style={{ minWidth: "280px" }}>
                        Wallet (value → count): <span style={{ color: "red" }}>*</span>
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.wallet)}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newAlphabetValue} onChange={(e) => setNewAlphabetValue(e.target.value)} placeholder="Coin Value (e.g. 0.2)" className="form-input flex-grow-1" />
                        <input value={newAlphabetCount} onChange={(e) => setNewAlphabetCount(e.target.value)} placeholder="Count (e.g. 1)" className="form-input flex-grow-1" />
                        <button onClick={() => {
                            addWalletValue();
                            setNewAlphabetValue("");
                            setNewAlphabetCount("");
                        }} className="form-button form-button-table small">Add</button>
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
                    <label className="form-label" style={{ minWidth: "270px" }}>
                        Accept ALL values:
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.acceptAll)}>ℹ️</button>
                    </label>
                    <input type="checkbox" checked={acceptAll} onChange={() => setAcceptAll(!acceptAll)} />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Forbidden Values:
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.forbiddenValues)}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newForbiddenValue} placeholder="e.g. 0.2" onChange={(e) => setNewForbiddenValue(e.target.value)} className="form-input flex-grow-1" />
                        <button onClick={() => {
                            setForbiddenValues([...forbiddenValues, parseFloat(newForbiddenValue)]);
                            setNewForbiddenValue("");
                        }} className="form-button form-button-table small">Add</button>
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
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.sequences)}>ℹ️</button>
                    </label>
                    <div className="d-flex w-100">
                        <input value={newSequence} placeholder="e.g. 0.1, 0.2, 0.5, 1" onChange={(e) => setNewSequence(e.target.value)} className="form-input flex-grow-1" />
                        <button onClick={addSequence} className="form-button form-button-table small">Add</button>
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
                    <label className="form-label" style={{ minWidth: "300px" }}>
                        Accept All Sequences:
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.acceptAllSequences)}>ℹ️</button>
                    </label>
                    <input type="checkbox" checked={acceptAllSequences} onChange={() => setAcceptAllSequences(!acceptAllSequences)} />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Max input length:
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.maxInputLength)}>ℹ️</button>
                    </label>
                    <input type="number" placeholder="e.g. 1" value={maxInputLength} onChange={(e) => setMaxInputLength(parseInt(e.target.value))} className="form-input" />
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Automat Type:
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.type)}>ℹ️</button>
                    </label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="form-input">
                        <option value="NFA">NFA</option>
                        <option value="DFA">DFA</option>
                    </select>
                </div>

                <div className="form-group d-flex align-items-center">
                    <label className="form-label" style={{ minWidth: "240px" }}>
                        Public Level:
                        <button type="button" className="info-button" onClick={() => showInfo(infoMessages.public)}>ℹ️</button>
                    </label>
                    <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
                </div>

                <button onClick={handleSave} className="form-button form-button">Save Level</button>
            </div>
        </div>
    );
}
