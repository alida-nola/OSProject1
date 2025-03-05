import { useState } from "react";
import Button from "react-bootstrap/Button"
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Table from "react-bootstrap/Table";
import catGif from './catType.gif';

export default function SJF() {
    const[queue, setQueue] = useState([]);
    const [completedQueue, setCompletedQueue] = useState([]);
    const[exe, setExe] = useState(null);
    const[progress, setProgress] = useState(0);
    const[run, setRun] = useState(false);

    const addProcess = () => {
        setCompletedQueue([]);
        const newProcess = Array.from({ length: 4}, (_, index) => ({
            id: queue.length + index + 1,
            burstTime: Math.floor(Math.random() * 10) + 1,
        }));
        setQueue(prevQueue => [...queue, ...newProcess]);
    };

    const executeProcess = async (process) => {
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

    const exeSJF = async () => {
        if (queue.length === 0) return;
        setRun(true);
        let sortedQueue = [...queue].sort((a, b) => a.burstTime - b.burstTime);
        let completionTime = 0;
        let executionOrder = [];

        for (let process of sortedQueue) {
            await executeProcess(process);
            completionTime += process.burstTime;
            executionOrder.push({ ...process, completionTime });
        }
        setCompletedQueue(executionOrder);
        setExe(null);
        setRun(false);
        setQueue([]);
        setProgress(0);
    };
    
    return (
        <div>
            <h4>Shortest Job First (SJF) Algorithm</h4>
            
            <div style={{ margin: "20px" }}>
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

            <Button onClick = {addProcess} style = {{ marginRight: "5px" }}>
                Add Process
            </Button>
            
            <Button onClick = {exeSJF} disabled = {exe || queue.length === 0}>
                {exe ? `Executing Process...` : "SJF Start"}
            </Button>

            <div style = {{marginTop:"20px"}}> 
                <h5>Process Queue: </h5>
                {queue.length === 0 ? (
                    <p>Empty queue!</p>
                ) : (
                <ul>
                    {queue.map((p) => (
                        <li key = {p.id}>
                            P{p.id} (Burst Time: {p.burstTime}s)
                        </li>
                    ))}
                </ul>
            )}
            </div>

            <div style= {{ marginTop: "20px" }}>
                <h5>Process Execution: </h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Process ID</th>
                            <th>Burst Time (s)</th>
                            <th>Execution Step</th>
                            <th>Completion Time (s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completedQueue.map((process, index) => (
                            <tr key={process.id}>
                                <td>{process.id}</td>
                                <td>{process.burstTime}</td>
                                <td>Step {index + 1}</td>
                                <td>{process.completionTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}