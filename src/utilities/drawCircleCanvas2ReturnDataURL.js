export function drawCircleCanvas2ReturnDataURL(diameter, text, score) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = diameter; // Set the desired width
    canvas.height = diameter; // Set the desired height

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate the radius of the circle based on the available space in the canvas
    const maxRadius = Math.min(centerX, centerY);


    //const circleRadius = Math.min(maxRadius, diameter / 2);

    // Draw a black circle

    const drawCirlce = (ctx, centerX, centerY, circleRadius, thisColor) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
        ctx.fillStyle = thisColor;
        ctx.fill();
        ctx.closePath();

    }

    drawCirlce(ctx, centerX, centerY, maxRadius, "black") 
    drawCirlce(ctx, centerX, centerY, 0.9 * maxRadius, "white")
    drawCirlce(ctx, centerX, centerY, 0.5 * maxRadius, "black")
    drawCirlce(ctx, centerX, centerY, 0.4 * maxRadius, "#aaaaaa")

     


     
    const textRadius = 0.9 * maxRadius - 12;
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Calculate the position for the text
    console.log(text.length)
    for (let i = 0; i < text.length; i++) {
        const angle = ((i - text.length / 2) / Math.max(9,(text.length+2))) * Math.PI * 2 - Math.PI/2.5;
        const textX = centerX + Math.cos(angle) * textRadius;
        const textY = centerY + Math.sin(angle) * textRadius;
        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(angle + Math.PI / 2); // Rotate by 90 degrees
        ctx.fillText(text[i], 0, 0);
        ctx.restore();
    }


    ctx.font = " bold 20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // Calculate the position for the text
    const textX = centerX;
    const textY = centerY+1;
    ctx.fillText(score, textX, textY);



  //  const textX = centerX;
   // const textY = centerY-5;
  //  ctx.fillText(text, textX, textY);


    const dataURI = canvas.toDataURL();
    return dataURI;
}




 