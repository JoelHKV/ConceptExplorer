export const saveHistory = (oldHistory, markerState, clickDirection, index) => {

    const thisOptionData = {
        conceptName: markerState['Marker0'].param,
        clickDirection: clickDirection,
        centerLat: markerState['Marker0'].lat,
        centerLng: markerState['Marker0'].lng,
        clickLat: markerState['Marker' + clickDirection].lat,
        clickLng: markerState['Marker' + clickDirection].lng,
    };

    const newHistory = [...oldHistory.slice(0, index)];

    newHistory[index] = thisOptionData;
    return newHistory

};