export function drawCircleCanvasReturnDataURL(diameter, text) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = diameter; // Set the desired width
    canvas.height = diameter; // Set the desired height

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate the radius of the circle based on the available space in the canvas
    const maxRadius = Math.min(centerX, centerY);
    const circleRadius = Math.min(maxRadius, diameter / 2);

    // Draw a black circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();

    // Draw a white circle on top
    const whiteCircleRadius = 0.8 * diameter / 2; // 80% of the canvas area
    ctx.beginPath();
    ctx.arc(centerX, centerY, whiteCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

      
    ctx.font = "25px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Calculate the position for the text
    const textX = centerX;
    const textY = centerY;
    ctx.fillText(text, textX, textY);


    const dataURI = canvas.toDataURL();
    return dataURI;
}




 