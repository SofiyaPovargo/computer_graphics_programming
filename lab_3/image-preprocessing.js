class ImageProcessor {
    constructor() {
        this.originalImage = null;
        this.initializeElements();
        this.bindEvents();
        this.setupCanvases();
    }

    initializeElements() {
        // Canvas elements
        this.originalCanvas = document.getElementById('originalCanvas');
        this.resultCanvas = document.getElementById('resultCanvas');
        
        // Contexts
        this.originalCtx = this.originalCanvas.getContext('2d');
        this.resultCtx = this.resultCanvas.getContext('2d');

        // UI elements
        this.imageUpload = document.getElementById('imageUpload');
        this.loadSample = document.getElementById('loadSample');
        this.methodSelect = document.getElementById('methodSelect');
        this.processBtn = document.getElementById('processBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.windowSize = document.getElementById('windowSize');
        this.thresholdC = document.getElementById('thresholdC');
        this.originalStats = document.getElementById('originalStats');
        this.resultStats = document.getElementById('resultStats');
        this.histogramCanvas = document.getElementById('histogramCanvas');
        this.histogramCtx = this.histogramCanvas ? this.histogramCanvas.getContext('2d') : null;
    }

    setupCanvases() {
        // Clear original canvas
        this.originalCtx.fillStyle = '#f8f9fa';
        this.originalCtx.fillRect(0, 0, this.originalCanvas.width, this.originalCanvas.height);
        this.originalCtx.fillStyle = '#6c757d';
        this.originalCtx.font = '16px Arial';
        this.originalCtx.textAlign = 'center';
        this.originalCtx.fillText('Загрузите изображение', 
            this.originalCanvas.width / 2, 
            this.originalCanvas.height / 2
        );

        // Clear result canvas
        this.resultCtx.fillStyle = '#f8f9fa';
        this.resultCtx.fillRect(0, 0, this.resultCanvas.width, this.resultCanvas.height);
        this.resultCtx.fillStyle = '#6c757d';
        this.resultCtx.font = '16px Arial';
        this.resultCtx.textAlign = 'center';
        this.resultCtx.fillText('Результат появится здесь', 
            this.resultCanvas.width / 2, 
            this.resultCanvas.height / 2
        );

        this.originalStats.textContent = '';
        this.resultStats.textContent = '';
    }

    bindEvents() {
        this.imageUpload.addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });
        
        this.loadSample.addEventListener('click', () => {
            this.createSampleImage();
        });

        // Add button for creating additional test images
        const additionalSamplesBtn = document.getElementById('additionalSamples');
        if (additionalSamplesBtn) {
            additionalSamplesBtn.addEventListener('click', () => {
                this.createAdditionalTestImages();
            });
        }
        
        this.processBtn.addEventListener('click', () => {
            this.processImage();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.reset();
        });
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите файл изображения (JPEG, PNG, GIF, etc.)');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.loadImageFromDataUrl(e.target.result);
        };
        
        reader.onerror = (error) => {
            alert('Ошибка при чтении файла');
        };

        reader.readAsDataURL(file);
    }

    loadImageFromDataUrl(dataUrl) {
        const img = new Image();
        
        img.onload = () => {
            this.originalImage = img;
            this.displayOriginalImage();
            this.updateStats();
        };
        
        img.onerror = (error) => {
            alert('Ошибка при загрузке изображения');
        };

        img.src = dataUrl;
    }

    displayOriginalImage() {
        if (!this.originalImage) {
            return;
        }
        
        const maxWidth = 400;
        const maxHeight = 300;
        const img = this.originalImage;

        // Calculate scale to fit canvas
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = Math.floor(img.width * scale);
        const height = Math.floor(img.height * scale);

        // Set canvas size
        this.originalCanvas.width = width;
        this.originalCanvas.height = height;

        // Clear and draw image
        this.originalCtx.clearRect(0, 0, width, height);
        this.originalCtx.drawImage(img, 0, 0, width, height);
        
        // Clear result canvas
        this.clearResultCanvas();
    }

    createSampleImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');

        // Create gradient background (simulating uneven lighting)
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#aaaaaa');
        gradient.addColorStop(0.3, '#e0e0e0');
        gradient.addColorStop(0.7, '#e0e0e0');
        gradient.addColorStop(1, '#aaaaaa');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Тест пороговой обработки', canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '14px Arial';
        ctx.fillText('Глобальные vs Адаптивные методы', canvas.width / 2, canvas.height / 2 + 5);
        
        // Add objects with different contrasts
        ctx.fillStyle = '#444444';
        ctx.fillRect(50, 50, 80, 80);
        
        ctx.fillStyle = '#222222';
        ctx.beginPath();
        ctx.arc(300, 80, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#666666';
        ctx.beginPath();
        ctx.moveTo(100, 200);
        ctx.lineTo(150, 250);
        ctx.lineTo(50, 250);
        ctx.closePath();
        ctx.fill();

        // Add some noise
        ctx.fillStyle = '#999999';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.fillRect(x, y, 2, 2);
        }

        // Convert to data URL and load
        const dataUrl = canvas.toDataURL('image/png');
        this.loadImageFromDataUrl(dataUrl);
    }

    clearResultCanvas() {
        this.resultCanvas.width = this.originalCanvas.width;
        this.resultCanvas.height = this.originalCanvas.height;
        
        this.resultCtx.fillStyle = '#f8f9fa';
        this.resultCtx.fillRect(0, 0, this.resultCanvas.width, this.resultCanvas.height);
        this.resultCtx.fillStyle = '#6c757d';
        this.resultCtx.font = '16px Arial';
        this.resultCtx.textAlign = 'center';
        this.resultCtx.fillText('Нажмите "Обработать" для применения фильтра', 
            this.resultCanvas.width / 2, 
            this.resultCanvas.height / 2
        );
        
        this.resultStats.textContent = '';
    }

    processImage() {
        if (!this.originalImage) {
            alert('Пожалуйста, загрузите изображение сначала');
            return;
        }

        const method = this.methodSelect.value;
        const windowSize = parseInt(this.windowSize.value);
        const thresholdC = parseInt(this.thresholdC.value);

        // Validate parameters
        if (windowSize < 3 || windowSize > 51 || windowSize % 2 === 0) {
            alert('Размер окна должен быть нечётным числом от 3 до 51');
            return;
        }

        // Get image data
        const imageData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);

        let processedData;
        switch (method) {
            case 'globalMean':
                processedData = this.globalMeanThresholding(imageData);
                break;
            case 'globalOtsu':
                processedData = this.globalOtsuThresholding(imageData);
                break;
            case 'localMean':
                processedData = this.localMeanThresholding(imageData, windowSize, thresholdC);
                break;
            case 'localMedian':
                processedData = this.localMedianThresholding(imageData, windowSize, thresholdC);
                break;
            case 'adaptive':
                processedData = this.adaptiveThresholding(imageData, windowSize, thresholdC);
                break;
        }

        this.displayProcessedImage(processedData);
        this.updateStats(imageData, processedData);
    }

    globalMeanThresholding(imageData) {
        const { width, height, data } = imageData;
        const result = new ImageData(width, height);
        
        // Calculate global mean
        let sum = 0;
        let count = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = this.getGrayValue(data[i], data[i + 1], data[i + 2]);
            sum += gray;
            count++;
        }
        
        const globalMean = sum / count;
        
        // Apply threshold
        for (let i = 0; i < data.length; i += 4) {
            const gray = this.getGrayValue(data[i], data[i + 1], data[i + 2]);
            const binaryValue = gray > globalMean ? 255 : 0;
            this.setPixel(result.data, i, binaryValue);
        }
        
        return result;
    }

    globalOtsuThresholding(imageData) {
        const { width, height, data } = imageData;
        const result = new ImageData(width, height);
        
        // Calculate histogram
        const histogram = new Array(256).fill(0);
        const totalPixels = width * height;
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = Math.round(this.getGrayValue(data[i], data[i + 1], data[i + 2]));
            histogram[gray]++;
        }
        
        // Calculate probabilities
        const probabilities = histogram.map(count => count / totalPixels);
        
        // Find optimal threshold using Otsu's method
        let maxVariance = 0;
        let optimalThreshold = 0;
        
        for (let t = 0; t < 256; t++) {
            // Calculate class probabilities
            let w0 = 0, w1 = 0;
            for (let i = 0; i <= t; i++) {
                w0 += probabilities[i];
            }
            w1 = 1 - w0;
            
            if (w0 === 0 || w1 === 0) continue;
            
            // Calculate class means
            let mu0 = 0, mu1 = 0;
            for (let i = 0; i <= t; i++) {
                mu0 += i * probabilities[i];
            }
            mu0 /= w0;
            
            for (let i = t + 1; i < 256; i++) {
                mu1 += i * probabilities[i];
            }
            mu1 /= w1;
            
            // Calculate between-class variance
            const variance = w0 * w1 * Math.pow(mu0 - mu1, 2);
            
            if (variance > maxVariance) {
                maxVariance = variance;
                optimalThreshold = t;
            }
        }
        
        
        // Apply threshold
        for (let i = 0; i < data.length; i += 4) {
            const gray = this.getGrayValue(data[i], data[i + 1], data[i + 2]);
            const binaryValue = gray > optimalThreshold ? 255 : 0;
            this.setPixel(result.data, i, binaryValue);
        }
        
        return result;
    }

    localMeanThresholding(imageData, windowSize, C) {
        return this.applyLocalThreshold(imageData, windowSize, C, 'mean');
    }

    localMedianThresholding(imageData, windowSize, C) {
        return this.applyLocalThreshold(imageData, windowSize, C, 'median');
    }

    adaptiveThresholding(imageData, windowSize, C) {
        const { width, height, data } = imageData;
        const result = new ImageData(width, height);
        const halfWindow = Math.floor(windowSize / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                
                let sum = 0;
                let count = 0;
                
                // Calculate local mean
                for (let wy = -halfWindow; wy <= halfWindow; wy++) {
                    for (let wx = -halfWindow; wx <= halfWindow; wx++) {
                        const ny = y + wy;
                        const nx = x + wx;
                        
                        if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                            const nIdx = (ny * width + nx) * 4;
                            const gray = this.getGrayValue(data[nIdx], data[nIdx + 1], data[nIdx + 2]);
                            sum += gray;
                            count++;
                        }
                    }
                }
                
                const localMean = sum / count;
                const currentGray = this.getGrayValue(data[idx], data[idx + 1], data[idx + 2]);
                const binaryValue = currentGray > (localMean - C) ? 255 : 0;
                
                this.setPixel(result.data, idx, binaryValue);
            }
        }
        
        return result;
    }

    applyLocalThreshold(imageData, windowSize, C, method) {
        const { width, height, data } = imageData;
        const result = new ImageData(width, height);
        const halfWindow = Math.floor(windowSize / 2);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                
                const localValues = [];
                for (let wy = -halfWindow; wy <= halfWindow; wy++) {
                    for (let wx = -halfWindow; wx <= halfWindow; wx++) {
                        const ny = y + wy;
                        const nx = x + wx;
                        
                        if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                            const nIdx = (ny * width + nx) * 4;
                            const gray = this.getGrayValue(data[nIdx], data[nIdx + 1], data[nIdx + 2]);
                            localValues.push(gray);
                        }
                    }
                }
                
                let threshold;
                if (method === 'mean') {
                    threshold = localValues.reduce((a, b) => a + b, 0) / localValues.length;
                } else { // median
                    localValues.sort((a, b) => a - b);
                    threshold = localValues[Math.floor(localValues.length / 2)];
                }
                
                const currentGray = this.getGrayValue(data[idx], data[idx + 1], data[idx + 2]);
                const binaryValue = currentGray > (threshold - C) ? 255 : 0;
                
                this.setPixel(result.data, idx, binaryValue);
            }
        }
        
        return result;
    }

    displayProcessedImage(imageData) {
        this.resultCtx.putImageData(imageData, 0, 0);
    }

    updateStats(originalData, processedData) {
        const originalMean = this.calculateMean(originalData);
        const processedMean = this.calculateMean(processedData);
        
        this.originalStats.textContent = `Средняя яркость: ${originalMean.toFixed(1)}`;
        this.resultStats.textContent = `Средняя яркость: ${processedMean.toFixed(1)}`;
        
    }

    calculateMean(imageData) {
        const data = imageData.data;
        let sum = 0;
        let count = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            sum += this.getGrayValue(data[i], data[i + 1], data[i + 2]);
            count++;
        }
        
        return sum / count;
    }

    getGrayValue(r, g, b) {
        return 0.299 * r + 0.587 * g + 0.114 * b;
    }

    setPixel(data, index, value) {
        data[index] = value;     // R
        data[index + 1] = value; // G
        data[index + 2] = value; // B
        data[index + 3] = 255;   // A
    }

    createAdditionalTestImages() {
        // Create image with clear bimodal distribution (good for global methods)
        const bimodalCanvas = document.createElement('canvas');
        bimodalCanvas.width = 400;
        bimodalCanvas.height = 300;
        const bimodalCtx = bimodalCanvas.getContext('2d');
        
        // Clear background
        bimodalCtx.fillStyle = '#ffffff';
        bimodalCtx.fillRect(0, 0, 400, 300);
        
        // Add dark objects
        bimodalCtx.fillStyle = '#000000';
        bimodalCtx.fillRect(50, 50, 100, 100);
        bimodalCtx.fillRect(250, 50, 100, 100);
        bimodalCtx.beginPath();
        bimodalCtx.arc(200, 200, 60, 0, Math.PI * 2);
        bimodalCtx.fill();
        
        // Add text
        bimodalCtx.fillStyle = '#000000';
        bimodalCtx.font = '16px Arial';
        bimodalCtx.textAlign = 'center';
        bimodalCtx.fillText('Бимодальное распределение', 200, 20);
        bimodalCtx.fillText('(подходит для глобальных методов)', 200, 40);
        
        // Save as downloadable link
        this.downloadImage(bimodalCanvas, 'bimodal_test.png');
        
        // Create image with uneven lighting (good for adaptive methods)
        const unevenCanvas = document.createElement('canvas');
        unevenCanvas.width = 400;
        unevenCanvas.height = 300;
        const unevenCtx = unevenCanvas.getContext('2d');
        
        // Create radial gradient (uneven lighting)
        const radialGradient = unevenCtx.createRadialGradient(200, 150, 0, 200, 150, 200);
        radialGradient.addColorStop(0, '#ffffff');
        radialGradient.addColorStop(0.5, '#cccccc');
        radialGradient.addColorStop(1, '#888888');
        
        unevenCtx.fillStyle = radialGradient;
        unevenCtx.fillRect(0, 0, 400, 300);
        
        // Add objects
        unevenCtx.fillStyle = '#000000';
        unevenCtx.fillRect(50, 50, 80, 80);
        unevenCtx.fillRect(270, 50, 80, 80);
        unevenCtx.fillRect(50, 170, 80, 80);
        unevenCtx.fillRect(270, 170, 80, 80);
        
        // Add text
        unevenCtx.fillStyle = '#000000';
        unevenCtx.font = '16px Arial';
        unevenCtx.textAlign = 'center';
        unevenCtx.fillText('Неравномерное освещение', 200, 20);
        unevenCtx.fillText('(подходит для адаптивных методов)', 200, 40);
        
        this.downloadImage(unevenCanvas, 'uneven_lighting_test.png');
        
    }

    downloadImage(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    reset() {
        this.originalImage = null;
        this.imageUpload.value = '';
        this.setupCanvases();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ImageProcessor();
});