import { useState } from "react";
import Button from "react-bootstrap/Button"
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
 
export default function FIFO() {
    const[queue, setQueue] = useState([]);
    const [completedQueue, setCompletedQueue] = useState([]);
    const[exe, setExe] = useState(null);
    const[progress, setProgress] = useState(0)

    const addProcess = () => {
        const newProcess = {
            id: queue.length + 1,
            burstTime: Math.floor(Math.random() * 10) + 1,
        };
        setQueue([...queue, newProcess]);
    };

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

    return (
        <>
        <div>
            <h4>FIFO Algorithm</h4>
        </div>
    
        {exe && (
                <div style={{ margin: "20px" }}>
                    <h5>Executing: P{exe.id} (Burst Time: {exe.burstTime}s)</h5>
                    <ProgressBar now={progress} label={`${Math.round(progress)}%`} animated />
                </div>
            )}

        <Button onClick={addProcess} style = {{marginRight: "5px"}}>
            Add Process
        </Button>

        <Button onClick={exeFIFO}>
            {exe ? `Executing Process ${exe.id}` : "FIFO Start"}
        </Button>
        
        <div style = {{marginTop: "20px"}}>
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

            <h5>Completed Queue:</h5>
                {completedQueue.length === 0 ? (
                    <p>What queue?!?</p>
                ) : (
                    <ul>
                        {completedQueue.map((p) => (
                            <li key={p.id}>
                                <i className="bi bi-check2-square" style = {{paddingRight: "5px"}}></i> 
                                P{p.id} (Burst Time: {p.burstTime}s)
                            </li>
                        ))}
                    </ul>
                )}
        </div>
        </>
    )
}