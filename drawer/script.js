let dragging = false;

// Initializing the grid
const grid = document.getElementById('gridContainer');
for (let i = 0; i < 23 * 74; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.addEventListener('mousedown', startToggle);
    cell.addEventListener('mouseover', dragToggle);
    cell.addEventListener('mouseup', stopToggle);
    grid.appendChild(cell);
}

const imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

function handleImage(e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image(); // Create a new Image object
        img.src = event.target.result;

        // Once the image is loaded, get its dimensions
        img.onload = function() {
            const wrapper = document.getElementById('wrapper');
            const cellWidth = (img.naturalWidth / 23) - 2;
            const cellHeight = (img.naturalHeight / 74) - 2;


            // Adjust the wrapper's dimensions
            wrapper.style.width = img.naturalWidth + 'px';
            wrapper.style.height = img.naturalHeight + 'px';
            wrapper.style.background = `url(${event.target.result}) no-repeat center/cover`;

            // Adjust the grid's cell dimensions and grid definitions
            grid.style.gridTemplateColumns = `repeat(23, ${cellWidth}px)`;
            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.style.width = cellWidth + 'px';
                cell.style.height = cellHeight + 'px';
            });
        }
        // Call SetGridDimensions() after 200ms to ensure the grid is properly sized
        setTimeout(setGridDimensions, 200);
    };
    reader.readAsDataURL(e.target.files[0]);
}

function startToggle(event) {
    dragging = true;
    toggleCell(event.target);
}

function dragToggle(event) {
    if (dragging) {
        toggleCell(event.target);
    }
}

function stopToggle() {
    dragging = false;
}

function toggleCell(cell) {
    if (cell.classList.contains('black')) {
        cell.classList.remove('black');
    } else {
        cell.classList.add('black');
    }
    updateBinaryString();
}

function updateBinaryString() {
    let binaryString = '';
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        binaryString += cell.classList.contains('black') ? '1' : '0';
    });
    document.getElementById('binaryOutput').textContent = binaryString;
}

function changeBinaryString() {
    const binaryString = document.getElementById('binaryOutput').value;
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        if (binaryString[index] === '1') {
            cell.classList.add('black');
        } else {
            cell.classList.remove('black');
        }
    });
}

function setGridDimensions() {
    const numRows = document.getElementById('rowsInput').value;
    const numCols = document.getElementById('colsInput').value;

    const wrapper = document.getElementById('wrapper');
    const img = wrapper.querySelector('img');

    // Clear old grid cells
    grid.innerHTML = '';

    // Set new grid dimensions
    for (let i = 0; i < numRows * numCols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('mousedown', startToggle);
        cell.addEventListener('mouseover', dragToggle);
        cell.addEventListener('mouseup', stopToggle);
        grid.appendChild(cell);
    }

    if (img) {  // if there's an image, adjust the cells to its dimensions
        const cellWidth = (img.naturalWidth / numRows) - 2;
        const cellHeight = (img.naturalHeight / numCols) - 2;

        // Adjust the grid's cell dimensions and grid definitions
        grid.style.gridTemplateColumns = `repeat(${numRows}, ${cellWidth}px)`;
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.width = cellWidth + 'px';
            cell.style.height = cellHeight + 'px';
        });
    } else {  // otherwise, set to default 20x20 cells
        grid.style.gridTemplateColumns = `repeat(${numRows}, 20px)`;
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.width = '20px';
            cell.style.height = '20px';
        });
    }
}

// Ensure dragging stops if the mouse is lifted outside the grid
document.addEventListener('mouseup', stopToggle);
