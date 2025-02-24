export function addMemoryLog(isReset) {
    const logDiv = document.getElementById("log");
    const table = document.getElementById("memoryLogTable");

    const rows = table.getElementsByTagName('tr');

    const rowsArray = Array.from(rows);

    rowsArray.forEach(row => {
        const hasTh = row.querySelector('th') !== null;

        if (!hasTh) {
            row.parentNode.removeChild(row);
        }
    });

    if (performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const timestamp = new Date().toLocaleTimeString();

        const newRow = document.createElement("tr");
        if(!isReset) {
            newRow.innerHTML = `
            <td>${timestamp}</td>
            <td>${formatMemoryUsage(usedJSHeapSize)}</td>
            <td>${formatMemoryUsage(totalJSHeapSize)}</td>
            <td>${formatMemoryUsage(jsHeapSizeLimit)}</td>
          `;
        } else {
            newRow.innerHTML = `
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          `;
        }
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
    const logDiv = document.getElementById("totalLog");
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

    if(callback) {
        setTimeout(() => {
            callback(newData, currentIndex);
        }, delay);
    } else {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(newData);
            }, delay);
        });
    }
}

export function logMetrics(memoryUsed, timeElapsed) {
    const logDiv = document.getElementById("log");
    let table = logDiv.querySelector('table');

    // Если таблицы нет, создаем новую
    if (!table) {
        table = document.createElement('table');
        logDiv.appendChild(table);
    }

    // Проверяем, содержит ли таблица строки <tr>
    const hasRows = table.getElementsByTagName('tr').length > 0;

    if (!hasRows) {
        // Создаем строки <tr>
        const row1 = document.createElement("tr");
        row1.setAttribute('id', 'memoryUsed');
        const row2 = document.createElement("tr");
        row2.setAttribute('id', 'timeElapsed');

        // Создаем ячейки для первой строки
        const cell1 = document.createElement('td');
        cell1.textContent = 'Memory Used'; // Текст для первой ячейки

        const cell2 = document.createElement('td');
        cell2.textContent = 'Time Elapsed'; // Текст для второй ячейки

        // Добавляем ячейки в строки
        row1.appendChild(cell1);
        row2.appendChild(cell2);

        // Добавляем строки в таблицу
        table.appendChild(row1);
        table.appendChild(row2);

    } else {
        const memoryUsedRow = table.querySelector("#memoryUsed");
        const timeElapsedRow = table.querySelector("#timeElapsed");

        const memoryCell = document.createElement("td");
        const timeCell = document.createElement("td");
        memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB`;
        timeCell.textContent = `${timeElapsed.toFixed(2)} ms`;
        memoryUsedRow.appendChild(memoryCell);
        timeElapsedRow.appendChild(timeCell);
    }




    // // Create a new table row
    // const row1 = document.createElement("tr").setAttribute('id', 'memoryUsed');
    // const row2 = document.createElement("tr").setAttribute('id', 'timeElapsed');
    //
    // logDiv.appendChild(row1);
    //
    // // Create cells for memory and time
    // const memoryCell = document.createElement("td");
    // memoryCell.textContent = `${(memoryUsed / 1024 / 1024).toFixed(2)} MB`; // Convert bytes to MB
    //
    // const timeCell = document.createElement("td");
    // timeCell.textContent = `${timeElapsed.toFixed(2)} ms`; // Time in milliseconds
    //
    // // Adding cells to a row
    // row.appendChild(memoryCell);
    // row.appendChild(timeCell);
    //
    // // Add a row to the table (log container)

}
