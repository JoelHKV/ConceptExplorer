export const conceptFlowerCoordinates = (lat, lng, thisradius) => {
    const mercatorFactor = 1 / Math.cos((lat * Math.PI) / 180);
    const latArray = [];
    const lngArray = [];
    const angleIncrement = (2 * Math.PI) / 8;
    for (let i = 0; i < 9; i++) {
        const radius = i === 0 ? 0 : thisradius;
        latArray[i] = lat + radius / mercatorFactor * Math.cos(i * angleIncrement);
        lngArray[i] = lng + radius * Math.sin(i * angleIncrement);
    }
    return [latArray, lngArray];
}