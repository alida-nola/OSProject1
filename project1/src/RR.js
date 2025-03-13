import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import catGif from "./catType.gif";

export default function RR({ processes }) {
    const [timeQuantum, setTimeQuantum] = useState(2);
    const [queue, setQueue] = useState([]);
    const [completedQueue, setCompletedQueue] = useState([]);
    const [exe, setExe] = useState(null);
    const [progress, setProgress] = useState(0);
    const [run, setRun] = useState(false);

    useEffect(() => {
        if (Array.isArray(processes) && processes.length > 0) {
            setQueue(processes.map((p) => ({ ...p, remainingTime: p.burstTime })));
            setCompletedQueue([]);
        }
    }, [processes]);

    const exeProcess = async (process, remainingTime) => {
        return new Promise((resolve) => {
            setExe(process);
            setProgress(0);
            let progressValue = 0;
            const executionTime = Math.min(remainingTime, timeQuantum);

            const interval = setInterval(() => {
                progressValue += 10;
                setProgress(progressValue);

                if (progressValue >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, executionTime * 100);
        });
    };

    const exeRR = async () => {
        if (queue.length === 0) return;
        setRun(true);
        let time = 0;
        let rrQueue = [...queue];

        while (rrQueue.length > 0) {
            const process = rrQueue.shift();
            const executionTime = Math.min(process.remainingTime, timeQuantum);
            await exeProcess(process, executionTime);

            time += executionTime;
            process.remainingTime -= executionTime;

            if (process.remainingTime > 0) {
                rrQueue.push(process);
            } else {
                setCompletedQueue((prev) => [...prev, { ...process, completionTime: time }]);
            }

            setQueue([...rrQueue]);
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setExe(null);
        setRun(false);
        setProgress(0);
    };

    return (
        <div>
            <h4><b>Round Robin (RR) Algorithm</b></h4>

            <Form>
                <Form.Group>
                    <Form.Label>Time Quantum (s):</Form.Label>
                    <Form.Control
                        type = "number"
                        value = {timeQuantum}
                        onChange = {(e) => setTimeQuantum(Math.max(1, Number(e.target.value)))}
                    />
                </Form.Group>
            </Form>

            {/* Execution Display */}
            <div style={{ margin: "20px" }}>
                {exe && (
                    <div style={{ marginBottom: "20px" }}>
                        <img src={catGif} style={{ width: "200px", height: "auto", display: "block", margin: "0 auto" }} />
                    </div>
                )}

                <h5>{exe ? `Executing: P${exe.id} (Remaining Time: ${exe.remainingTime}s)` : "Waiting..."}</h5>
                <ProgressBar
                    now={progress}
                    label={`${Math.round(progress)}%`}
                    animated
                    variant = "success"
                    style={{
                        height: "30px",
                        borderRadius: "5px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                />
            </div>

            <Button onClick = {exeRR} disabled = {exe || queue.length === 0}>
                {"Start RR"}
            </Button>

            <div style = {{ marginTop: "20px" }}>
                <h5>Process Queue: </h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Process ID</th>
                            <th>Burst Time (s)</th>
                            <th>Completion Time (s)</th>
                            <th>Remaining Time (s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...queue, ...completedQueue].map((process, index) => {
                            const isCompleted = completedQueue.some((p) => p.id === process.id);
                            return (
                                <tr key={process.id} className={isCompleted ? "table-success" : ""}>
                                    <td>P{process.id}</td>
                                    <td>{process.burstTime}</td>
                                    <td>{isCompleted ? process.completionTime : '-'}</td>
                                    <td>{isCompleted ? 0 : process.remainingTime}</td>
                                    
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}
