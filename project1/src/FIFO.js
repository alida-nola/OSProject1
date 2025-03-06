import { useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button"
import ProgressBar from "react-bootstrap/ProgressBar";
import catGif from './catType.gif';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FIFO({ processes }) {
    const [queue, setQueue] = useState(Array.isArray(processes) ? processes : []);
    const [completedQueue, setCompletedQueue] = useState([]);
    const[exe, setExe] = useState(null);
    const[progress, setProgress] = useState(0);

    useEffect(() => {
        setQueue(Array.isArray(processes) ? [...processes] : []);
        setCompletedQueue([]); 
    }, [processes]);

    const exeProcess = async (process) => {
        return new Promise(resolve => {
            setExe(process);
            setProgress(0);
            let progressValue = 0;
 
            const interval = setInterval(() => {
                progressValue += 10;
                setProgress(progressValue);
                
                if (progressValue >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, process.burstTime * 100);
        });
    };

    const exeFIFO = async () => {
        if (queue.length === 0 || exe) return;
    
        for (let i = 0; i < queue.length; i++) {
            const process = queue[i];
            setExe(process);
            setProgress(0);
    
            await exeProcess(process); 
    
            setCompletedQueue(prevCompleted => [...prevCompleted, process]);
            setQueue(prevQueue => prevQueue.slice(1)); 
    
            setExe(null);
            setProgress(0);
        }
    };

    const renderStatus = (process) => {
        if (completedQueue.some(p => p.id === process.id)) {
            return <span className="text-success">Completed</span>;
        }
        return <span>In Queue</span>;
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
                    text: 'Time (seconds)',
                }
            },
        },
    };

    return (
        <>
            <div>
                <h4><b>First In First Out (FIFO) Algorithm</b></h4>
            </div>

            <div style = {{ margin: "20px" }}>
                    {exe && (
                        <div style={{ marginBottom: "20px" }}>
                            <img 
                                src={catGif}
                                style={{ width: "200px", height: "auto", display: "block", margin: "0 auto" }} 
                            />
                        </div>
                    )}

                    <h5>{exe ? `Executing: P${exe.id} (Burst Time: ${exe.burstTime}s)` : "Waiting..."}</h5>
                    <ProgressBar
                        now = {progress}
                        label = {`${Math.round(progress)}%`}
                        animated
                        variant = "success" 
                        style = {{
                            height: "30px",
                            borderRadius: "5px", 
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
                        }}
                    />
            </div>

            <Button onClick = {exeFIFO} disabled = {queue.length === 0}>
                {exe ? `Executing Process...` : "FIFO Start"}
            </Button>
            
            <div style = {{ marginTop: "20px" }}>
                <h5>Process Queue:</h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Process ID</th>
                            <th>Burst Time (s)</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...queue, ...completedQueue].map((p) => (
                            <tr key = {p.id} className = {getRowClass(p)}>
                                <td>P{p.id}</td>
                                <td>{p.burstTime}</td>
                                <td>{renderStatus(p)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {completedQueue.length > 0 && (
                <div style={{ margin: "20px" }}>
                    <h5>Process Execution Chart</h5>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}
        </>
    )
}

