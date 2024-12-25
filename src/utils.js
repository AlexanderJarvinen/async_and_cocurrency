export function logMetrics(memoryUsed, timeElapsed) {
    const logDiv = document.getElementById("log");

    // Create a new table row
    const row = document.createElement("tr");

    // Create cells for memory and time
    const memoryCell = document.createElement("td");
    memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB`; // Convert bytes to MB

    const timeCell = document.createElement("td");
    timeCell.textContent = `${timeElapsed.toFixed(2)} ms`; // Time in milliseconds

    // Adding cells to a row
    row.appendChild(memoryCell);
    row.appendChild(timeCell);

    // Add a row to the table (log container)
    logDiv.appendChild(row);
}
