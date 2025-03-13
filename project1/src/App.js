import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { exportToPDF } from "./export"; 
import FIFO from './FIFO';
import SJF from './SJF';
import STCF from './STCF';
import RR from './RR';
import MLFQ from './MLFQ';

function App() {
    const [selectedAlgo, setSelectedAlgo] = useState("All");
    const algo = ["All", "FIFO", "SJF", "STCF", "RR", "MLFQ"];
    const [process, setProcess] = useState([]); // Stores list of randomly generated processes
    const [run, setRun] = useState(false); // Trigger to run algorithm(s)

    const [completedProcesses, setCompletedProcesses] = useState(new Set()); 
    const [exportEnabled, setExportEnabled] = useState(false);
    const fifoChartRef = useRef(null);
    const sjfChartRef = useRef(null);
    const stcfChartRef = useRef(null);
    const rrChartRef = useRef(null);
    const mlfqChartRef = useRef(null);

    const generateProcess = () => {
        const numProcess = Math.floor(Math.random() * 5) + 3; // Generates random number of processes
        const newProcess = Array.from({ length: numProcess }, (_, i) => ({ // Generates random burstTime
            id: i + 1,
            arrivalTime: Math.floor(Math.random() * 10), 
            burstTime: Math.floor(Math.random() * 10) + 1, 
        }));
        
        setProcess(newProcess);
        setRun(false);
        setCompletedProcesses(new Set());
        setExportEnabled(false);
    };

    const runAllAlgos = () => {
        setRun(true);
    };

    const handleCompletion = (completedIds) => {
        setCompletedProcesses((prev) => {
            const updated = new Set([...prev, ...completedIds]);
            if (updated.size > 0) {
                setExportEnabled(false); 
            }
            return updated;
        });
    };
    
    const handleExportChange = (e) => {
        const isChecked = e.target.checked;
        setExportEnabled(isChecked);
    
        if (isChecked) {
            exportToPDF(completedProcesses, process, {
                FIFO: fifoChartRef,
                SJF: sjfChartRef,
                STCF: stcfChartRef,
                RR: rrChartRef,
                MLFQ: mlfqChartRef,
            });
        }
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

                    <button className = "btn btn-primary ms-2 mb-3" onClick = {runAllAlgos} disabled = {selectedAlgo !== "All"}>
                        Run All Algorithms
                    </button>

                    
                    <div className = "form-check form-check-inline ms-3">
                        <input
                            type = "checkbox"
                            className = "form-check-input"
                            id = "exportCheck"
                            checked = {exportEnabled}
                            onChange = {handleExportChange}
                            disabled = {completedProcesses.size === 0}
                        />
                        <label className="form-check-label" htmlFor="exportCheck">
                            Export Completed Processes
                        </label>
                    </div>
                    
                </div>
                <hr></hr>

                {/* Passing generated processes to selected algo */}
                <div>
                    {selectedAlgo === "All" ? (
                        <>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                            <FIFO processes={process} run={run} onComplete={handleCompletion} chartRef={fifoChartRef} />
                            </div>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                                <SJF processes={process} run={run} onComplete={handleCompletion} chartRef={sjfChartRef} />
                            </div>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                                <STCF processes={process} run={run} onComplete={handleCompletion} chartRef={stcfChartRef} />
                            </div>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                                <RR processes={process} run={run} onComplete={handleCompletion} chartRef={rrChartRef} />
                            </div>
                            <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                                <MLFQ processes={process} run={run} onComplete={handleCompletion} chartRef={mlfqChartRef} />
                            </div>
                        </>
                    ) : (
                        <>
                            {selectedAlgo === "FIFO" && <FIFO processes={process} run={run} onComplete={handleCompletion} chartRef={fifoChartRef} />}
                            {selectedAlgo === "SJF" && <SJF processes={process} run={run} onComplete={handleCompletion} chartRef={sjfChartRef} />}
                            {selectedAlgo === "STCF" && <STCF processes={process} run={run} onComplete={handleCompletion} chartRef={stcfChartRef} />}
                            {selectedAlgo === "RR" && <RR processes={process} run={run} onComplete={handleCompletion} chartRef={rrChartRef} />}
                            {selectedAlgo === "MLFQ" && <MLFQ processes={process} run={run} onComplete={handleCompletion} chartRef={mlfqChartRef} />}
                        </>
                    )}
                </div>
            </div>
        </>     
    ) 
}

export default App;