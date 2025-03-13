import { saveAs } from "file-saver"; 

export const exportProcessData = (queue, completedQueue, renderStatus) => {
    const headers = "Process ID,Burst Time (s),Status\n";
    const data = [...queue, ...completedQueue]
        .map((p) => `P${p.id},${p.burstTime},${renderStatus(p)}`)
        .join("\n");

    const blob = new Blob([headers + data], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "scheduling_algorithm_data.csv");
};

