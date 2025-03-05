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

    const exeFIFO = () => {
       if (queue.length === 0 || exe) return;
       const process = queue[0];
       setExe(process);
       setProgress(0);

       let count = 0;
       const interval = setInterval(() => {
        count += 100;
        setProgress((count / (process.burstTime * 1000)) * 100);

        if (count >= process.burstTime * 1000) {
            clearInterval(interval); 
            setExe(null); 
            setProgress(0); 
            setQueue((prevQueue) => prevQueue.slice(1)); 

            setCompletedQueue((prevCompleted) => [...prevCompleted, process]);
        }
    }, 100);
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
        labels: [exe ? `P${exe.id}` : "Waiting"],
        datasets: [
            {
                label: "Execution Progress",
                data: [progress],
                backgroundColor: "#82ca9d",
                borderColor: "#4caf50",
                borderWidth: 1,
            },
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
                        return value/100;
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
                <h4>First In First Out (FIFO) Algorithm</h4>
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
                            <tr key={p.id} className = {getRowClass(p)}>
                                <td>P{p.id}</td>
                                <td>{p.burstTime}</td>
                                <td>{renderStatus(p)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

                {/* <div style={{ margin: "20px" }}>
                    <h5>{exe ? `Executing: P${exe.id} (Burst Time: ${exe.burstTime}s)` : "Waiting..."}</h5>
                    <Bar data={chartData} options = {chartOptions} />
                </div> */}
        </>
    )
}

