export function addMemoryLog() {
    const logDiv = document.getElementById("log");
    const table = document.getElementById("memoryLogTable");

    if (performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const timestamp = new Date().toLocaleTimeString();

        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${timestamp}</td>
            <td>${formatMemoryUsage(usedJSHeapSize)}</td>
            <td>${formatMemoryUsage(totalJSHeapSize)}</td>
            <td>${formatMemoryUsage(jsHeapSizeLimit)}</td>
          `;
        table.appendChild(newRow);
    } else {
        const warningRow = document.createElement("tr");
        warningRow.innerHTML = `<td colspan="4">Memory API is not supported in this browser.</td>`;
        table.appendChild(warningRow);
    }
}

// Форматирование значения памяти в MB
export function formatMemoryUsage(bytes) {
    return (bytes / 1024 / 1024).toFixed(2);
}

// Show the loader
export function showLoader() {
    document.getElementById("loader").style.display = "block";
}

// Hide the loader
export function hideLoader() {
    document.getElementById("loader").style.display = "none";
}

// Table initialization
export function initializeMemoryLogTable() {
    const logDiv = document.getElementById("log");
    const table = document.createElement("table");
    table.id = "memoryLogTable";

    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
          <th>Timestamp</th>
          <th>Used JS Heap Size (MB)</th>
          <th>Total JS Heap Size (MB)</th>
          <th>JS Heap Size Limit (MB)</th>
        `;
    table.appendChild(headerRow);
    logDiv.appendChild(table);
}

// Function to simulate asynchronous data fetching with random delays
export function fetchDataChunk(chunkSize, currentIndex, largeData, callback) {
    const delay = Math.random() * 1000; // Random delay from 0 to 1000 ms

    const newData = largeData.slice(currentIndex, currentIndex + chunkSize);

    setTimeout(() => {
        callback(newData, currentIndex);
    }, delay);
}

// Function to simulate asynchronous data fetching with random delays
export function fetchDataChunk2(chunkSize, currentIndex, largeData) {
    return new Promise((resolve) => {
        const delay = Math.random() * 1000; // Random delay from 0 to 1000 ms
        const newData = largeData.slice(currentIndex, currentIndex + chunkSize);

        setTimeout(() => {
            resolve(newData);
        }, delay);
    });
}

export function logMetrics(memoryUsed, timeElapsed) {
    const logDiv = document.getElementById("log");

    // Создаем новую строку таблицы
    const row = document.createElement("tr");

    // Создаем ячейки для памяти и времени
    const memoryCell = document.createElement("td");
    memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB`; // Переводим байты в МБ

    const timeCell = document.createElement("td");
    timeCell.textContent = `${timeElapsed.toFixed(2)} ms`; // Время в миллисекундах

    // Добавляем ячейки в строку
    row.appendChild(memoryCell);
    row.appendChild(timeCell);

    // Добавляем строку в таблицу (контейнер логов)
    logDiv.appendChild(row);
}
