import React, { useState } from "react";
import Button from "./../components/Button";
import "./../style.css";
import Menu from "../components/Menu";

export default function LevelEditorPage() {
    const [levelName, setLevelName] = useState("");
    const [alphabet, setAlphabet] = useState([]);
    const [acceptedValues, setAcceptedValues] = useState([]);
    const [acceptAll, setAcceptAll] = useState(true);
    const [maxInputLength, setMaxInputLength] = useState(10);
    const [sequences, setSequences] = useState([]);
    const [maxStates, setMaxStates] = useState(-1);

    const [newAlphabetValue, setNewAlphabetValue] = useState("");
    const [newAcceptedValue, setNewAcceptedValue] = useState("");
    const [newSequence, setNewSequence] = useState("");

    const [message, setMessage] = useState("");

    const addAlphabetValue = () => {
        if (newAlphabetValue) {
            setAlphabet([...alphabet, parseFloat(newAlphabetValue)]);
            setNewAlphabetValue("");
        }
    };

    const addAcceptedValue = () => {
        if (newAcceptedValue) {
            setAcceptedValues([...acceptedValues, parseFloat(newAcceptedValue)]);
            setNewAcceptedValue("");
        }
    };

    const addSequence = () => {
        if (newSequence) {
            const sequenceList = newSequence.split(",").map(Number);
            setSequences([...sequences, sequenceList]);
            setNewSequence("");
        }
    };

    const handleSave = () => {
        const setup = {
            level_name: levelName,
            alphabet,
            accepted_values: acceptedValues,
            accept_all: acceptAll,
            max_input_length: maxInputLength,
            sequences,
            max_states: maxStates
        };
        console.log("Saving setup:", setup);

        // Send to backend:
        fetch("/api/v1/save_level_setup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(setup)
        })
        .then(res => res.json())
        .then(data => {
            setMessage("Level saved successfully!");
        })
        .catch(err => {
            console.error("Failed to save level:", err);
            setMessage("Error saving level.");
        });
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
            
            <h1 className="title2">Create/Edit Level</h1>
    
            <div className="form-container level-editor-form">
    
                <div className="form-group d-flex align-items-center">
                    <label className="form-label me-3" style={{ minWidth: "130px" }}>Level Name:</label>
                    <input value={levelName} onChange={(e) => setLevelName(e.target.value)} className="form-input" />
                </div>
    
                <label><b>Alphabet (coin values):</b></label>
                <div className="d-flex gap-2">
                    <input value={newAlphabetValue} onChange={(e) => setNewAlphabetValue(e.target.value)} className="form-input" />
                    <button onClick={addAlphabetValue} className="form-button">Add</button>
                </div>
                <div>Current: {alphabet.join(", ")}</div>
    
                <label><b>Accepted Values:</b></label>
                <div className="d-flex gap-2">
                    <input value={newAcceptedValue} onChange={(e) => setNewAcceptedValue(e.target.value)} className="form-input" />
                    <button onClick={addAcceptedValue} className="form-button">Add</button>
                </div>
                <div>Current: {acceptedValues.join(", ")}</div>
    
                <div className="form-group">
                    <label>Accept All Combinations:</label>
                    <input type="checkbox" checked={acceptAll} onChange={() => setAcceptAll(!acceptAll)} style={{ marginLeft: "10px" }} />
                </div>
    
                <div className="form-group d-flex align-items-center">
                    <label className="form-label me-3" style={{ minWidth: "130px" }}>Max Input Length:</label>
                    <input type="number" value={maxInputLength} onChange={(e) => setMaxInputLength(parseInt(e.target.value))} className="form-input" />
                </div>
    
                <label><b>Sequences (comma separated, ex: 0.1,0.2):</b></label>
                <div className="d-flex gap-2">
                    <input value={newSequence} onChange={(e) => setNewSequence(e.target.value)} className="form-input" />
                    <button onClick={addSequence} className="form-button">Add</button>
                </div>
                <div>Current: {sequences.map(seq => `[${seq.join(", ")}]`).join(", ")}</div>
    
                <div className="form-group d-flex align-items-center">
                    <label className="form-label me-3" style={{ minWidth: "130px" }}>Max States:</label>
                    <input type="number" value={maxStates} onChange={(e) => setMaxStates(parseInt(e.target.value))} className="form-input" />
                </div>
    
                <button onClick={handleSave} className="form-button">Save Level</button>
            </div>
        </div>
    );    
}
