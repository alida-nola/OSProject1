import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Table from "react-bootstrap/Table";
import catGif from './catType.gif';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function STCF({ processes, run, onComplete, chartRef }) {
    const [queue, setQueue] = useState(Array.isArray(processes) ? processes : []);
    const [completedQueue, setCompletedQueue] = useState([]);
    const [allCompleted, setAllCompleted] = useState(false);
    const [exe, setExe] = useState(null);
    const [executionOrder, setExecutionOrder] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (run) {
            exeSTCF(); 
        }
    }, [run]); 

    useEffect(() => {
        setQueue(Array.isArray(processes) ? [...processes] : []);
        setCompletedQueue([]);
        setExecutionOrder([]);
        setAllCompleted(false);
    }, [processes]);

    const exeProcess = async (process, delay = 500) => {  // Added delay parameter (in ms)
        return new Promise(resolve => {
            setExe(process); 
            setProgress(0);
            let progressValue = 0;
    
            const interval = setInterval(() => {
                progressValue += 10;
                setProgress(progressValue);
    
                // Check for preemption while executing
                if (queue.length > 0) {
                    const shortestJob = queue.reduce((prev, current) => 
                        (prev.remainingBurstTime < current.remainingBurstTime ? prev : current)
                    );
    
                    if (shortestJob.remainingBurstTime < process.remainingBurstTime) {
                        clearInterval(interval);
                        resolve();
                        return;
                    }
                }
    
                if (progressValue >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, delay);  
        });
    };
    
    const exeSTCF = async () => {
        if (queue.length === 0) return;
    
        let remainingQueue = [...queue];
        let completionTime = 0;
        const order = [];
    
        while (remainingQueue.length > 0) {
            remainingQueue.sort((a, b) => a.remainingBurstTime - b.remainingBurstTime); // Sorts queue by shortest remaining time
            const nextProcess = remainingQueue[0];
    
            await exeProcess(nextProcess, 1000); // Added delay of 1000ms (1 second) per process execution
            completionTime += nextProcess.burstTime;
            order.push(`Step ${order.length + 1}`);
    
            setCompletedQueue(prev => [...prev, { ...nextProcess, completionTime }]);
            remainingQueue = remainingQueue.filter(p => p.id !== nextProcess.id);
    
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between each process execution
        }
    
        if (onComplete) {
            onComplete(queue.map(p => p.id));
        }
    
        setExecutionOrder(order);
        setExe(null);
        setQueue([]);
        setProgress(0);
        setAllCompleted(true);
    };    

    const getRowClass = (process) => {
        return completedQueue.some(p => p.id === process.id) ? "table-success" : "";
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
            <h4><b>Shortest Time to Completion First (STCF) Algorithm</b></h4>

            <div style={{ margin: "20px" }}>
                {exe && (
                    <div style={{ marginBottom: "20px" }}>
                        <img 
                            src={catGif}
                            style={{ width: "200px", height: "auto", display: "block", margin: "0 auto" }} 
                            alt = "Typing cat"
                        />
                    </div>
                )}

                <h5>{exe ? `Executing: P${exe.id} (Burst Time: ${exe.burstTime}s)` : "Waiting..."}</h5>
                <ProgressBar
                    now={progress}
                    label={`${Math.round(progress)}%`}
                    animated
                    variant="success" 
                    style={{
                        height: "30px",
                        borderRadius: "5px", 
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
                    }}
                />
            </div>

            <Button onClick={exeSTCF} disabled={exe || queue.length === 0 }>
                {"STCF Start"}
            </Button>

            <div style={{ marginTop: "20px" }}>
                <h5>Process Queue: </h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Process ID</th>
                            <th>Burst Time (s)</th>
                            <th>Completion Time (s)</th>
                            <th>Execution Step</th>
                        </tr>
                    </thead>
                    <tbody>
                    {queue.filter(process => !completedQueue.some(p => p.id === process.id)).map((process) => (
                        <tr key={process.id} className={getRowClass(process)}>
                            <td>P{process.id}</td>
                            <td>{process.burstTime}</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    ))}
                    {completedQueue.map((process) => (
                        <tr key={process.id} className={getRowClass(process)}>
                            <td>P{process.id}</td>
                            <td>{process.burstTime}</td>
                            <td>{process.completionTime}</td>
                            <td>{executionOrder[completedQueue.findIndex(p => p.id === process.id)] || "Waiting..."}</td> {/* Show "Waiting..." if no execution step is found */}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            {completedQueue.length > 0 && (
                <div ref={chartRef} style = {{ margin: "20px" }}>
                    <h5>Process Execution Chart</h5>
                    <Bar data = {chartData} options = {chartOptions} />
                </div>
            )}
        </div>
    );
}
