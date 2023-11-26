function generateQRCode() {
    const textInput = document.getElementById('textInput').value;
    const qrcodeContainer = document.getElementById('qrcode');

    if (textInput.trim() === '') {
        alert('Please enter some text.');
        return;
    }

    // Clear previous QR code
    qrcodeContainer.innerHTML = '';

    // Generate QR code
    const qrcode = new QRCode(qrcodeContainer, {
        text: textInput,
        width: 200,
        height: 200
    });
}
