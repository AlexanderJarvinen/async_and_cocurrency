export function logMetrics(logPanel, memoryUsed, timeElapsed) {
    const logDiv = document.getElementById(logPanel);

    // Получаем или создаём первую строку для памяти
    let memoryRow = logDiv.querySelector(".memory-row");
    if (!memoryRow) {
        memoryRow = document.createElement("tr");
        memoryRow.classList.add("memory-row");
        logDiv.appendChild(memoryRow);
    }

    // Получаем или создаём вторую строку для времени
    let timeRow = logDiv.querySelector(".time-row");
    if (!timeRow) {
        timeRow = document.createElement("tr");
        timeRow.classList.add("time-row");
        logDiv.appendChild(timeRow);
    }

    // Добавляем ячейку с памятью в первую строку
    const memoryCell = document.createElement("td");
    memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB`; // Convert bytes to MB
    memoryRow.appendChild(memoryCell);

    // Добавляем ячейку с временем во вторую строку
    const timeCell = document.createElement("td");
    timeCell.textContent = `${timeElapsed.toFixed(2)} ms`; // Time in milliseconds
    timeRow.appendChild(timeCell);
}
