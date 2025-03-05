import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FIFO from './FIFO';
import SJF from './SJF';
import STCF from './STCF';

function App() {
    const [selectedAlgo, setSelectedAlgo] = useState("All");
    const [process, setProcess] = useState([]);
    const algo = ["All", "FIFO", "SJF", "STCF"];

    const generateProcess = () => {
        const numProcess = Math.floor(Math.random() * 5) + 3; 
        const newProcess = Array.from({ length: numProcess }, (_, i) => ({
            id: i + 1,
            arrivalTime: Math.floor(Math.random() * 10), 
            burstTime: Math.floor(Math.random() * 10) + 1, 
        }));
        setProcess(newProcess);
    };

    return (
        <>
            <div className = "container mt-5">
                <div style = {{paddingBottom: "10px"}}>
                    <h1>CPU Scheduling Algorithms</h1>
                    <h2><i>OS: Project 1, Alida Nola</i></h2>
                </div>

                <div className="mb-3">
                    <hr></hr>
                    <label htmlFor = "algoSelect" className = "form-label">
                        Select Scheduling Algorithm:
                    </label>

                    <select 
                        id = "algoSelect" 
                        className = "form-select" 
                        value = {selectedAlgo} 
                        onChange = {(e) => setSelectedAlgo(e.target.value)}
                    >
                        {algo.map((algo) => (
                            <option key = {algo} value = {algo}> 
                                {algo} 
                            </option>
                        ))}
                    </select>
                </div>

                <button className = "btn btn-primary mb-3" onClick = {generateProcess}>
                    Generate Random Processes
                </button>
                <hr></hr>

                <div>
                    {selectedAlgo === "All" && (
                        <>
                            <FIFO processes = {process} />
                            <SJF processes = {process} />
                            <STCF processes = {process} />
                        </>
                    )}
                    {selectedAlgo === "FIFO" && <FIFO processes = {process} />}
                    {selectedAlgo === "SJF" && <SJF processes = {process} />}
                    {selectedAlgo === "STCF" && <STCF processes = {process} />}
                </div>
            </div>
        </>     
    ) 
}

export default App;