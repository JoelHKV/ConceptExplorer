
export function drawCanvasReturnDataURL(radiusList, diameter) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = diameter; // Set the desired width
    canvas.height = diameter; // Set the desired height

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.beginPath();

    for (let i = 0; i < 360; i++) {
        const angle = (i * Math.PI) / 180;
        const x = centerX + diameter / 2 * radiusList[i] * Math.cos(angle);
        const y = centerY + diameter / 2 * radiusList[i] * Math.sin(angle);

        ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.stroke();

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, diameter / 2);
    gradient.addColorStop(0, "blue");
    gradient.addColorStop(0.2, "green");
    gradient.addColorStop(0.5, "yellow");
    gradient.addColorStop(1, "red");

    ctx.fillStyle = gradient;
    ctx.fill();

    const dataURI = canvas.toDataURL();
    //  console.log('here')
    // console.log(dataURI)
    return dataURI;
}