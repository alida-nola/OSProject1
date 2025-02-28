import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
 
export default function FIFO() {
    const[queue, setQueue] = useState([]);
    const[exe, setExe] = useState(null);

    const addProcess = () => {
        const newProcess = {
            id: queue.length + 1,
            burstTime: Math.floor(Math.random() * 10) + 1,
        };
        setQueue([...queue, newProcess]);
    };

    const exeFIFO = () => {
       if (queue.length === 0) return;
       const process = queue[0];
       setExe(process);

       setTimeout(() => {
        setExe(null);
        setQueue(queue.slice(1));
       }, process.burstTime * 1000)
    };

    return (
        <>
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>FIFO Algorithm</h2>
        </div>
    
        <button onClick={addProcess} style={{ marginBottom: "10px", padding: "10px", fontSize: "16px" }}>
            Add Process
        </button>
            
        <button onClick={exeFIFO} style={{ marginBottom: "10px", padding: "10px", fontSize: "16px" }}>
            {exe ? 'Executing Process {exe.id}' : "FIFO Start"}
        </button>
        
        <div style = {{marginTop: "20px"}}>
            <h3>Process Queue: </h3>
            {queue.length === 0 ? (
                <p>No processes in queue</p>
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
        </>
    )
}