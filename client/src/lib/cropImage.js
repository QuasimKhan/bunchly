// src/lib/cropImage.js
// Utility to crop an image given the pixel crop from react-easy-crop
export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    // returns a blob (image/png) and dataUrl if needed
    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(e);
            img.src = url;
        });

    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    // draw the image portion to the canvas
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // convert to blob
    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                resolve(blob);
            },
            "image/jpeg",
            0.92
        ); // quality 0.92 - change if you want smaller size
    });
}
