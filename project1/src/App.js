import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FIFO from './Algo';

function App() {
    return (
        <div className = "container mt-5">
            <div style = {{paddingBottom: "10px"}}>
                <h1>CPU Scheduling Algorithms</h1>
                <h2><i>OS: Project 1, Alida Nola</i></h2>
            </div>
            
            <div>
                <FIFO/>
            </div>
        </div>
    ) 
}

export default App;