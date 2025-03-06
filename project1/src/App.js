import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FIFO from './FIFO';
import SJF from './SJF';
import STCF from './STCF';
import RR from './RR';
import MLFQ from './MLFQ';

function App() {
    const [selectedAlgo, setSelectedAlgo] = useState("All");
    const [process, setProcess] = useState([]);
    const [results, setResults] = useState([]);
    const algo = ["All", "FIFO", "SJF", "STCF", "RR", "MLFQ"];
    const [run, setRun] = useState(false);

    const generateProcess = () => {
        const numProcess = Math.floor(Math.random() * 5) + 3; // Generates random number of processes
        const newProcess = Array.from({ length: numProcess }, (_, i) => ({ // Generates random burstTime
            id: i + 1,
            arrivalTime: Math.floor(Math.random() * 10), 
            burstTime: Math.floor(Math.random() * 10) + 1, 
        }));
        setProcess(newProcess);
        setRun(false);
    };

    const runAllAlgos = () => {
        setRun(true);
    };

    return (
        <>
            <div className = "container mt-5">
                <div style = {{paddingBottom: "10px"}}>
                    <h1><b>CPU Scheduling Algorithms</b></h1>
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

                {process.length > 0 && (
                    <div className = "d-flex align-items-center">
                    <p className = "me-3 mb-0">Generated Processes:</p>
                    <input 
                        type = "text" 
                        className = "form-control w-auto" 
                        value = {process.length} 
                        readOnly 
                    />
                    </div>
                )}

                <div style = {{paddingTop: "10px"}}>
                    <button className = "btn btn-primary mb-3" onClick = {generateProcess}>
                        Generate Random Processes
                    </button>

                    <button className = "btn btn-primary ms-2 mb-3" onClick = {runAllAlgos}>
                        Run All Algorithms
                    </button>
                </div>

                {/* Passing generated processes to selected algo */}
                <div>
                    {selectedAlgo === "All" ? (
                        <>
                            <div
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    marginBottom: "20px"
                                }}
                            >
                                <FIFO processes={process} run = {run} />
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    marginBottom: "20px"
                                }}
                            >
                                <SJF processes={process} run = {run} />
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    marginBottom: "20px"
                                }}
                            >
                                <STCF processes={process} run = {run} />
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    marginBottom: "20px"
                                }}
                            >
                                <RR processes={process} run = {run} />
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    marginBottom: "20px"
                                }}
                            >
                                <MLFQ processes={process} run = {run} />
                            </div>
                        </>
                    ) : (
                        <>
                            {selectedAlgo === "FIFO" && <FIFO processes = {process} run = {run} />}
                            {selectedAlgo === "SJF" && <SJF processes = {process} run = {run} />}
                            {selectedAlgo === "STCF" && <STCF processes = {process} run = {run} />}
                            {selectedAlgo === "RR" && <RR processes = {process} run = {run} />}
                            {selectedAlgo === "MLFQ" && <MLFQ processes = {process} run = {run} />}
                        </>
                    )}
                </div>
            </div>
        </>     
    ) 
}

export default App;