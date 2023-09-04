export const processRoute = (optionChoiceHistory) => {
    const latArray = [];
    const lngArray = [];
    const valArray = [];

    for (let i = 0; i < optionChoiceHistory.length; i++) {

        const thisChoice = optionChoiceHistory[i];
        latArray.push(thisChoice.centerLat)
        lngArray.push(thisChoice.centerLng)
        valArray.push(thisChoice.conceptName)

    }

    const thisRoute = { concept: valArray, lat: latArray, lng: lngArray }

    const minLat2 = Math.min(...latArray);
    const maxLat2 = Math.max(...latArray);
    const minLng2 = Math.min(...lngArray);
    const maxLng2 = Math.max(...lngArray);

    const latLngSpace = Math.max((maxLng2 - minLng2), (maxLat2 - minLat2))

    const thisMapLocation = {
        lat: (minLat2 + maxLat2) / 2, // Default latitude  
        lng: (minLng2 + maxLng2) / 2, // Default longitude  dall
        delta: latLngSpace,
    }
    return { thisMapLocation, thisRoute }
}

 