import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FIFO from './FIFO';
import SJF from './SJF';
import STCF from './STCF';

function App() {
    return (
        <div className = "container mt-5">
            <div style = {{paddingBottom: "10px"}}>
                <h1>CPU Scheduling Algorithms</h1>
                <h2><i>OS: Project 1, Alida Nola</i></h2>
                <hr></hr>
            </div>
            
            <div>
                <FIFO/>
                <SJF/>
                <STCF/>
            </div>
        </div>
    ) 
}

export default App;