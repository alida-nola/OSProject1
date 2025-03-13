import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import catGif from './catType.gif';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MLFQ({ processes, run, onComplete, chartRef }) {
    const [queues, setQueues] = useState([[], [], []]); 
    const [completedQueue, setCompletedQueue] = useState([]);
    const [exe, setExe] = useState(null);
    const [progress, setProgress] = useState(0);
    const timeSlices = [2, 4, 8]; // Sets time slices for each priority level

    useEffect(() => {
        if (run) {
            exeMLFQ(); 
        }
    }, [run]); 

    useEffect(() => {
        if (Array.isArray(processes)) {
            let newQueues = [[], [], []];
            processes.forEach(p => {
                const newProcess = { ...p, remaining: p.burstTime, executionHistory: [], priorityLevel: 0 }; // Set priorityLevel to 0 initially
                newQueues[0].push(newProcess); 
            });
            setQueues(newQueues);
        }
        setCompletedQueue([]);
    }, [processes]);

    const exeProcess = async (process, queueLevel) => {
        return new Promise(resolve => {
            setExe(process);
            setProgress(0);
            let progressValue = 0;
            let execTime = Math.min(process.remaining, timeSlices[queueLevel]);

            const interval = setInterval(() => {
                progressValue += 10;
                setProgress(progressValue);
                
                if (progressValue >= 100) {
                    clearInterval(interval);
                    resolve(execTime);
                }
            }, execTime * 100);
        });
    };

    const exeMLFQ = async () => {
        let currentTime = 0;
        let localQueues = [...queues];
    
        while (localQueues.some(q => q.length > 0)) {
            for (let level = 0; level < localQueues.length; level++) {
                while (localQueues[level].length > 0) {
                    let process = localQueues[level][0]; 

                    setExe(process);
                    let execTime = await exeProcess(process, level); // Executes process by time slice, derived from priority level
                    process.remaining -= execTime;
                    currentTime += execTime;
                    process.executionHistory.push({ start: currentTime - execTime, end: currentTime }); // Reflects execution of a cycle
    
                    if (process.remaining > 0) {
                        let nextLevel = Math.min(level + 1, 2); // Determines priority, does not go beyond level 2
                        process.priorityLevel = nextLevel;
                        localQueues[nextLevel].push(localQueues[level].shift()); // Move process to next queue
                    } else {
                        setCompletedQueue(prev => [...prev, { ...process, completionTime: currentTime }]);
                        localQueues[level].shift(); 
                    }
                }
            }
        }

        if (onComplete) {
            onComplete(queues.map(p => p.id)); 
        }
    
        setExe(null);
        setQueues([[], [], []]);
        setProgress(0);
    };
    
    const chartData = {
        labels: completedQueue.map(p => `P${p.id}`),
        datasets: [
            {
                label: "Burst Time (s)",
                data: completedQueue.map(p => p.burstTime),
                backgroundColor: "#82ca9d",
                borderColor: "#4caf50",
                borderWidth: 1,
            },
            {
                label: "Completion Time (s)",
                data: completedQueue.map((p, index) => 
                    completedQueue.slice(0, index + 1).reduce((acc, proc) => acc + proc.burstTime, 0)
                ),
                backgroundColor: "#ffa07a",
                borderColor: "#ff4500",
                borderWidth: 1,
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value;
                    }
                },
                title: {
                    display: true,
                    text: 'Time (s)',
                }
            },
        },
    };
    
    return (
        <div>
            <h4><b>Multilevel Feedback Queue (MLFQ) Algorithm</b></h4>
            <div style = {{ margin: "20px" }}>
                {exe && (
                    <div style = {{ marginBottom: "20px" }}>
                        <img src = {catGif} style = {{ width: "200px", height: "auto", display: "block", margin: "0 auto" }} />
                    </div>
                )}
                <h5>{exe ? `Executing: P${exe.id} (Remaining Time: ${exe.remaining}s)` : "Waiting..."}</h5>
                <ProgressBar now={progress} label = {`${Math.round(progress)}%`} animated variant="success" style={{ height: "30px", borderRadius: "5px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} />
            </div>

            <Button onClick = {exeMLFQ} disabled={exe || queues.every(q => q.length === 0)}>
                {"MLFQ Start"}
            </Button>

            <div style={{ marginTop: "20px" }}>
                <h5>Process Queue: </h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Process ID</th>
                            <th>Burst Time (s)</th>
                            <th>Completion Time (s)</th>
                            <th>Priority Level</th>
                            <th>Remaining Time (s)</th>
                            <th>Execution History</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {[...queues.flat(), ...completedQueue].map((process, index) => {
                            const isCompleted = completedQueue.some(p => p.id === process.id);

                            return (
                                <tr key = {process.id} className = {isCompleted ? "table-success" : ""}>
                                    <td>P{process.id}</td>
                                    <td>{process.burstTime}</td>
                                    <td>{isCompleted ? process.completionTime : '-'}</td>
                                    <td>{process.priorityLevel}</td>
                                    <td>{process.remaining}</td>
                                    <td>{process.executionHistory.length > 0 ? 
                                        process.executionHistory.map(e => `[${e.start}-${e.end}]`).join(", ") : '-'} </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            {completedQueue.length > 0 && (
                <div ref = {chartRef} style = {{ margin: "20px" }}>
                    <h5>Process Execution Chart</h5>
                    <Bar data = {chartData} options = {chartOptions} />
                </div>
            )}
        </div>
    );
}
