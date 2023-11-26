document.addEventListener('DOMContentLoaded', function () {
    const imageInput = document.getElementById('imageInput');
    const selectedImage = document.getElementById('selectedImage');
    const textOverlay = document.getElementById('textOverlay');
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const colorSelect = document.getElementById('colorSelect');
    const sizeSlider = document.getElementById('sizeSlider');
    const downloadButton = document.getElementById('downloadButton');

    let isDragging = false;
    let startX, startY;

    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                selectedImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function applyText() {
        const text = textInput.value;
        const font = fontSelect.value;
        const color = colorSelect.value;
        const size = `${sizeSlider.value}px`;

        textOverlay.textContent = text;
        textOverlay.style.fontFamily = font;
        textOverlay.style.color = color;
        textOverlay.style.fontSize = size;
    }

    textInput.addEventListener('input', applyText);
    fontSelect.addEventListener('change', applyText);
    colorSelect.addEventListener('input', applyText);
    sizeSlider.addEventListener('input', applyText);

    textOverlay.addEventListener('mousedown', function (e) {
        isDragging = true;
        startX = e.clientX - textOverlay.getBoundingClientRect().left;
        startY = e.clientY - textOverlay.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            const x = e.clientX - startX;
            const y = e.clientY - startY;

            textOverlay.style.left = `${x}px`;
            textOverlay.style.top = `${y}px`;
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    downloadButton.addEventListener('click', function () {
        // Create a temporary canvas to draw the image and text overlay
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set canvas dimensions to match the image
        canvas.width = selectedImage.width;
        canvas.height = selectedImage.height;

        // Draw the image
        context.drawImage(selectedImage, 0, 0, canvas.width, canvas.height);

        // Apply the text overlay
        context.font = `${sizeSlider.value}px ${fontSelect.value}`;
        context.fillStyle = colorSelect.value;
        context.fillText(textInput.value, parseInt(textOverlay.style.left) || 0, parseInt(textOverlay.style.top) || 0);

        // Convert the canvas to a data URL and trigger the download
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'text_image.png';
        link.click();
    });

    // Apply text initially
    applyText();
});
