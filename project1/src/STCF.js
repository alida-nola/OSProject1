import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import catGif from './catType.gif';

export default function STCF() {
    const [queue, setQueue] = useState([]);
    const [completedQueue, setCompletedQueue] = useState([]);
    const [exe, setExe] = useState(null);
    const [progress, setProgress] = useState(0);
    const [run, setRun] = useState(false);

    const addProcess = () => {
        const newProcess = {
            id: queue.length + 1,
            burstTime: Math.floor(Math.random() * 10) + 1,
            remainingTime: Math.floor(Math.random() * 10) + 1,
        };
        setQueue((prevQueue) => [...prevQueue, newProcess]);
    };

    useEffect(() => {
        if (run && exe === null && queue.length > 0) {
            executeSTCF();
        }
    }, [run, queue, exe]);

    const executeSTCF = () => {
        if (queue.length === 0) {
            setRun(false);
            setExe(null);
            return;
        }

        // Sort queue by shortest remaining time
        const sortedQueue = [...queue].sort((a, b) => a.remainingTime - b.remainingTime);
        const currentProcess = { ...sortedQueue[0] }; // Create a new object to prevent state mutation

        setExe(currentProcess);
        setProgress(0);

        let remaining = currentProcess.remainingTime;
        const interval = setInterval(() => {
            setProgress((prev) => prev + (100 / currentProcess.burstTime));
            remaining -= 1;

            if (remaining <= 0) {
                clearInterval(interval);

                setCompletedQueue((prev) => [...prev, { ...currentProcess }]);

                setQueue((prev) => prev.filter((p) => p.id !== currentProcess.id));

                setExe(null);
                setProgress(0);
            }
        }, 1000);
    };

    return (
        <>
            <div>
                <h4>Shortest Time-to-Completion First (STCF) Algorithm</h4>
            </div>

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

            <Button onClick={addProcess} style={{ marginRight: "5px" }}>
                Add Process
            </Button>

            <Button onClick={() => setRun(true)} disabled={run || queue.length === 0}>
                {exe ? `Executing Process...` : "STCF Start"}
            </Button>

            <h5>Process Queue</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Burst Time</th>
                        <th>Remaining Time</th>
                    </tr>
                </thead>
                <tbody>
                    {queue.map((process) => (
                        <tr key={process.id}>
                            <td>{process.id}</td>
                            <td>{process.burstTime}</td>
                            <td>{process.remainingTime}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h5>Completed Processes</h5>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Burst Time</th>
                    </tr>
                </thead>
                <tbody>
                    {completedQueue.map((process) => (
                        <tr key={process.id}>
                            <td>{process.id}</td>
                            <td>{process.burstTime}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}
