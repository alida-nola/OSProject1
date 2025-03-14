import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import html2canvas from "html2canvas";

export const exportToPDF = async (completedProcesses, allProcesses, chartRefs, selectedAlgo) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("CPU Scheduling Algorithm Results", 14, 20);
    doc.line(10, 25, 200, 25);

    let yOffset = 40; 

    const algorithms = selectedAlgo === "All" ? Object.keys(chartRefs) : [selectedAlgo];
    for (const key in chartRefs) {
        if (chartRefs[key].current) {
            if (yOffset + 120 > doc.internal.pageSize.height) {
                doc.addPage();
                yOffset = 20; 
            }

            doc.setFontSize(16);
            doc.text(`${key}`, 14, yOffset); 
            yOffset += 5; 

            let tableColumn;
            if (key === "FIFO" || key === "RR") {
                tableColumn = ["Process ID", "Burst Time (s)", "Completion Time (s)"];
            }
            else if (key === "SJF" || key === "STCF") {
                tableColumn = ["Process ID", "Burst Time (s)", "Completion Time (s)", "Execution Step"];
            } 
            else {
                tableColumn = ["Process ID", "Burst Time (s)", "Completion Time (s)", "Priority Level", "Execution History" ];
            }

            const tableRows = allProcesses
                .filter(p => completedProcesses.has(p.id))
                .map(p => [p.id, p.arrivalTime, p.burstTime]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: yOffset, 
            });

            yOffset = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : yOffset + 20;

            const canvas = await html2canvas(chartRefs[key].current);
            const imgData = canvas.toDataURL("image/png");

            if (yOffset + 100 > doc.internal.pageSize.height) {
                doc.addPage();
                yOffset = 20;
            }

            doc.addImage(imgData, "PNG", 15, yOffset, 180, 100);
            yOffset += 110; 
        }
    }

    doc.save("cpu_scheduling_results.pdf");
};
