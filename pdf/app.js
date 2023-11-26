$(document).ready(function () {
    $('#pdfInput').on('change', function (e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var typedarray = new Uint8Array(e.target.result);
                convertPdfToImage(typedarray);
            };
            reader.readAsArrayBuffer(file);
        }
    });

    $('#downloadButton').on('click', function () {
        var canvas = document.getElementById('pdfCanvas');
        var imageDataURL = canvas.toDataURL('image/png');
        downloadImage(imageDataURL);
    });

    function convertPdfToImage(data) {
        pdfjsLib.getDocument({ data: data }).promise.then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                var scale = 1.5;
                var viewport = page.getViewport({ scale: scale });

                var canvas = document.getElementById('pdfCanvas');
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };

                page.render(renderContext).promise.then(function () {
                    // Now the canvas contains the rendered PDF page as an image
                    // Enable the download button
                    $('#downloadButton').prop('disabled', false);
                });
            });
        });
    }

    function downloadImage(dataURL) {
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = 'converted_image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
});
