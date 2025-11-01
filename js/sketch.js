// Canvas variables
const sketchCanvas = document.getElementById('sketch-canvas');
const ctx = sketchCanvas.getContext('2d');
const brushColor = document.getElementById('brush-color');
const brushSize = document.getElementById('brush-size');
const clearCanvasBtn = document.getElementById('clear-canvas');

// Drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize canvas
function initCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, sketchCanvas.width, sketchCanvas.height);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize.value;
    ctx.strokeStyle = brushColor.value;
    
    // Load saved sketch if available
    const savedData = localStorage.getItem('dreamInkData');
    if (savedData) {
        const data = JSON.parse(savedData);
        if (data.sketch) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.src = data.sketch;
        }
    }
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    
    ctx.strokeStyle = brushColor.value;
    ctx.lineWidth = brushSize.value;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

// Clear canvas
function clearCanvas() {
    if (confirm('Are you sure you want to clear your sketch?')) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, sketchCanvas.width, sketchCanvas.height);
        saveToStorage(); // This function is in script.js
    }
}

// Get canvas data as data URL
function getCanvasData() {
    return sketchCanvas.toDataURL();
}

// Event listeners for canvas
sketchCanvas.addEventListener('mousedown', startDrawing);
sketchCanvas.addEventListener('mousemove', draw);
sketchCanvas.addEventListener('mouseup', stopDrawing);
sketchCanvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
sketchCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    sketchCanvas.dispatchEvent(mouseEvent);
});

sketchCanvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    sketchCanvas.dispatchEvent(mouseEvent);
});

sketchCanvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup', {});
    sketchCanvas.dispatchEvent(mouseEvent);
});

// Brush color and size change
brushColor.addEventListener('change', () => {
    ctx.strokeStyle = brushColor.value;
});

brushSize.addEventListener('change', () => {
    ctx.lineWidth = brushSize.value;
});

// Initialize canvas when page loads
document.addEventListener('DOMContentLoaded', initCanvas);

// Clear canvas button
clearCanvasBtn.addEventListener('click', clearCanvas);
