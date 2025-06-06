import React from "react";
import MenuStart from "../components/MenuStart";
import "../style.css";

export default function AboutPage() {
    return (
        <div className="start-page">
            <MenuStart />
            <h1 className="title2">ℹ️ About FiniAutoma</h1>
            <div className="form-container level-editor-form">
                <p style={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
                    <strong>FiniAutoma</strong> is an educational game designed to help students learn and understand 
                    <strong> finite automata</strong> through interactive tasks and visual tools.
                    <br /><br />
                    The app allows players to solve vending machine-like challenges by constructing correct automata. 
                    Each level teaches the concepts of state transitions, input symbols, and acceptance conditions.
                    <br /><br />
                    Teachers and students can also create and share their own automat challenges, 
                    encouraging experimentation and hands-on learning.
                </p>

                <h3 style={{ marginTop: "2rem" }}>Goals</h3>
                <ul>
                    <li>Make learning finite automata fun and interactive</li>
                    <li>Support progressive difficulty for various skill levels</li>
                    <li>Enable creative level design and public sharing</li>
                </ul>

                <h3 style={{ marginTop: "2rem" }}>Contact</h3>
                <p>Have feedback or ideas?</p>
                <ul>
                    <li><a href="https://github.com/viki-terebova/Softverove-prostredie-na-podporu-vyucby-konecnych-automatov">GitHub</a></li>
                    <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSeKMe67sWBUf7-3Vb12CPBVkmXtTgxvnIR1mABrrDJmwqZmlg/viewform?usp=dialog">Google form</a></li>
                </ul>

                <h3 style={{ marginTop: "2rem" }}>Testing with students</h3>
                <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSdTRCHtnVtFIUC927DVD10c0WpIQpUG01k6RX-oUwgVF7OjtA/viewform?usp=dialog">Google form for testing</a></p>

            </div>
        </div>
    );
}
