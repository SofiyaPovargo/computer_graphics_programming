const canvas = document.getElementById('rasterCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

let currentScale = parseInt(document.getElementById('scale').value);

// Функция для отрисовки отдельного пикселя на холсте
// Преобразует декартовы координаты (x, y) в координаты холста
function plotPixel(x, y, color = 'red') {
    ctx.fillStyle = color;
    // x * currentScale и y * currentScale для масштабирования пикселей
    // centerX + ... и centerY - ... для центрирования системы координат и инвертирования оси Y
    ctx.fillRect(centerX + x * currentScale, centerY - y * currentScale, currentScale, currentScale);
}

// Объяснение целочисленных координат и дискретной сетки:
// Система координат холста имеет начало (0,0) в верхнем левом углу.
// Мы преобразуем ее в декартову систему координат с началом (0,0) в центре холста.
// Таким образом, точка (x, y) в нашей логической декартовой системе отображается в (centerX + x, centerY - y) на холсте.
// Каждая целочисленная координата (например, (1,1)) соответствует одной квадратной области пикселей размером `scale` x `scale` на дискретной сетке.

// Функция для отрисовки сетки
function drawGrid() {
    ctx.strokeStyle = '#ccc'; // Цвет сетки
    ctx.lineWidth = 0.5; // Толщина линий сетки

    // Отрисовка вертикальных линий
    for (let x = -centerX; x <= centerX; x += currentScale) {
        ctx.beginPath();
        ctx.moveTo(centerX + x, 0);
        ctx.lineTo(centerX + x, canvas.height);
        ctx.stroke();
    }

    // Отрисовка горизонтальных линий
    for (let y = -centerY; y <= centerY; y += currentScale) {
        ctx.beginPath();
        ctx.moveTo(0, centerY - y);
        ctx.lineTo(canvas.width, centerY - y);
        ctx.stroke();
    }
}

// Функция для отрисовки осей координат
function drawAxes() {
    ctx.strokeStyle = 'black'; // Цвет осей
    ctx.lineWidth = 1; // Толщина осей

    // Ось X
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    // Стрелки для осей
    drawArrow(canvas.width, centerY, -1); // Стрелка вправо для оси X
    drawArrow(0, centerY, 1); // Стрелка влево для оси X
    drawArrow(centerX, 0, 1, true); // Стрелка вверх для оси Y
    drawArrow(centerX, canvas.height, -1, true); // Стрелка вниз для оси Y
}

// Функция для отрисовки стрелок на концах осей
function drawArrow(x, y, direction, isYAxis = false) {
    const arrowSize = 10; // Размер стрелки
    ctx.save();
    ctx.translate(x, y);
    if (isYAxis) {
        ctx.rotate(Math.PI / 2 * direction);
    } else {
        ctx.rotate(Math.PI * (direction === -1 ? 0 : 1));
    }
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowSize, -arrowSize / 2);
    ctx.lineTo(-arrowSize, arrowSize / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// Функция для отрисовки меток осей и начала координат
function drawLabels() {
    ctx.fillStyle = 'black'; // Цвет текста
    ctx.font = '12px Arial'; // Шрифт текста
    ctx.textAlign = 'center'; // Выравнивание текста по центру
    ctx.textBaseline = 'middle'; // Базовая линия текста по середине

    // Метки оси X
    for (let x = -centerX; x <= centerX; x += currentScale * 5) { // Метка каждые 5 единиц
        if (x !== 0) {
            ctx.fillText(x / currentScale, centerX + x, centerY + 15);
        }
    }

    // Метки оси Y
    for (let y = -centerY; y <= centerY; y += currentScale * 5) { // Метка каждые 5 единиц
        if (y !== 0) {
            ctx.fillText(y / currentScale, centerX + 15, centerY - y);
        }
    }

    ctx.fillText('X', canvas.width - 10, centerY + 15);
    ctx.fillText('Y', centerX + 15, 10);
    ctx.fillText('0', centerX - 10, centerY + 10);
}

// Функция для очистки холста
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Функция для отрисовки всей сцены (сетка, оси, метки)
function renderScene() {
    clearCanvas();
    drawGrid();
    drawAxes();
    drawLabels();

    // Здесь были примеры вызовов алгоритмов, теперь они обрабатываются пользовательским вводом
}

// Алгоритм цифрового дифференциального анализатора (ЦДА) для рисования отрезков
function ddaLine(x0, y0, x1, y1, color = 'blue') {
    let dx = x1 - x0;
    let dy = y1 - y0;

    let steps = Math.abs(dx) > Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);

    let xIncrement = dx / steps;
    let yIncrement = dy / steps;

    let x = x0;
    let y = y0;

    plotPixel(Math.round(x), Math.round(y), color);

    for (let i = 0; i < steps; i++) {
        x += xIncrement;
        y += yIncrement;
        plotPixel(Math.round(x), Math.round(y), color);
    }
}

// Алгоритм Брезенхема для рисования отрезков
function bresenhamLine(x0, y0, x1, y1, color = 'green') {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1; // Направление по X
    let sy = (y0 < y1) ? 1 : -1; // Направление по Y
    let err = dx - dy; // Начальная ошибка

    while (true) {
        plotPixel(x0, y0, color);

        if (x0 === x1 && y0 === y1) break; // Достигли конечной точки
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

// Алгоритм Брезенхема для рисования окружностей
function bresenhamCircle(xc, yc, r, color = 'purple') {
    let x = 0;
    let y = r;
    let p = 3 - 2 * r; // Параметр принятия решения
    
    // Вспомогательная функция для отрисовки симметричных точек окружности
    function drawCircle(xc, yc, x, y, color) {
        plotPixel(xc + x, yc + y, color);
        plotPixel(xc - x, yc + y, color);
        plotPixel(xc + x, yc - y, color);
        plotPixel(xc - x, yc - y, color);
        plotPixel(xc + y, yc + x, color);
        plotPixel(xc - y, yc + x, color);
        plotPixel(xc + y, yc - x, color);
        plotPixel(xc - y, yc - x, color);
    }

    drawCircle(xc, yc, x, y, color);
    while (x < y) {
        if (p < 0) {
            p = p + 4 * x + 6;
        } else {
            p = p + 4 * (x - y) + 10;
            y--;
        }
        x++;
        drawCircle(xc, yc, x, y, color);
    }
}

// Пошаговый (наивный) алгоритм рисования отрезков
function stepByStepLine(x0, y0, x1, y1, color = 'orange') {
    let dx = x1 - x0;
    let dy = y1 - y0;

    if (Math.abs(dx) >= Math.abs(dy)) {
        // Итерация вдоль оси X
        let m = dy / dx; // Вычисляем наклон
        let b = y0 - m * x0; // Вычисляем точку пересечения с осью Y
        let startX = dx > 0 ? x0 : x1;
        let endX = dx > 0 ? x1 : x0;

        for (let x = startX; x <= endX; x++) {
            let y = m * x + b;
            plotPixel(x, Math.round(y), color);
        }
    } else {
        // Итерация вдоль оси Y
        let m_inv = dx / dy; // Вычисляем обратный наклон
        let b_inv = x0 - m_inv * y0;
        let startY = dy > 0 ? y0 : y1;
        let endY = dy > 0 ? y1 : y0;

        for (let y = startY; y <= endY; y++) {
            let x = m_inv * y + b_inv;
            plotPixel(Math.round(x), y, color);
        }
    }
}

renderScene();

const algorithmSelect = document.getElementById('algorithmSelect');
const lineInputs = document.getElementById('lineInputs');
const circleInputs = document.getElementById('circleInputs');
const drawButton = document.getElementById('drawButton');
const clearButton = document.getElementById('clearButton');
const performanceResults = document.getElementById('performanceResults');

// Обработчик изменения выбранного алгоритма
algorithmSelect.addEventListener('change', () => {
    if (algorithmSelect.value === 'bresenhamCircle') {
        lineInputs.style.display = 'none'; // Скрываем поля ввода для линий
        circleInputs.style.display = 'flex'; // Показываем поля ввода для окружностей
    } else {
        lineInputs.style.display = 'flex'; // Показываем поля ввода для линий
        circleInputs.style.display = 'none'; // Скрываем поля ввода для окружностей
    }
});

// Обработчик нажатия кнопки "Draw"
drawButton.addEventListener('click', () => {
    currentScale = parseInt(document.getElementById('scale').value); // Обновляем текущий масштаб
    renderScene(); // Очищаем и перерисовываем сетку/оси
    const selectedAlgorithm = algorithmSelect.value;
    let startTime, endTime, executionTime;

    // Выполняем выбранный алгоритм и измеряем время
    if (selectedAlgorithm === 'dda') {
        const x0 = parseInt(document.getElementById('x0').value);
        const y0 = parseInt(document.getElementById('y0').value);
        const x1 = parseInt(document.getElementById('x1').value);
        const y1 = parseInt(document.getElementById('y1').value);
        startTime = performance.now();
        ddaLine(x0, y0, x1, y1);
        endTime = performance.now();
    } else if (selectedAlgorithm === 'bresenhamLine') {
        const x0 = parseInt(document.getElementById('x0').value);
        const y0 = parseInt(document.getElementById('y0').value);
        const x1 = parseInt(document.getElementById('x1').value);
        const y1 = parseInt(document.getElementById('y1').value);
        startTime = performance.now();
        bresenhamLine(x0, y0, x1, y1);
        endTime = performance.now();
    } else if (selectedAlgorithm === 'stepByStepLine') {
        const x0 = parseInt(document.getElementById('x0').value);
        const y0 = parseInt(document.getElementById('y0').value);
        const x1 = parseInt(document.getElementById('x1').value);
        const y1 = parseInt(document.getElementById('y1').value);
        startTime = performance.now();
        stepByStepLine(x0, y0, x1, y1);
        endTime = performance.now();
    } else if (selectedAlgorithm === 'bresenhamCircle') {
        const xc = parseInt(document.getElementById('xc').value);
        const yc = parseInt(document.getElementById('yc').value);
        const r = parseInt(document.getElementById('r').value);
        startTime = performance.now();
        bresenhamCircle(xc, yc, r);
        endTime = performance.now();
    }

    // Отображаем время выполнения
    if (startTime && endTime) {
        executionTime = (endTime - startTime).toFixed(3);
        performanceResults.textContent = `Время выполнения: ${executionTime} мс`;
    } else {
        performanceResults.textContent = '';
    }
});

// Обработчик нажатия кнопки "Clear"
clearButton.addEventListener('click', () => {
    renderScene(); // Очищает холст и перерисовывает сетку/оси
    performanceResults.textContent = ''; // Очищаем результаты производительности
});

// Начальная отрисовка сцены при загрузке страницы
renderScene();
