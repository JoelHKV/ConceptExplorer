
export const createMarker = (map, markerData) => {
    const labelOptions = {
        text: ' ',
        color: 'black',
        fontSize: '18px',
        fontWeight: 'bold'
    };
    let markerImage = null; //no marker image for regular marker
    if (markerData.diameter) {
        const diameter = markerData.diameter;
        markerImage = new google.maps.MarkerImage(
            markerData.dataURL, // data for custom marker
            new google.maps.Size(diameter, diameter),
            new google.maps.Point(0, 0),
            new google.maps.Point(diameter / 2, diameter / 2)
        );
    }

    const markerHandle = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: map,
        icon: markerImage,
        title: markerData.title,
        label: labelOptions,
        opacity: markerData.opacity || 1,

    });
  
    return markerHandle


}

export const createPolyline = (map, polylineData) => {
    const polytype = polylineData.symbol || 'FORWARD_CLOSED_ARROW';
    const polylineHandle = new window.google.maps.Polyline({
        path: [{ lat: polylineData.lat[0], lng: polylineData.lng[0] }, { lat: polylineData.lat[1], lng: polylineData.lng[1] }],
        geodesic: true,
        strokeColor: polylineData.color || 'red',
        strokeOpacity: polylineData.opacity || 1,
        strokeWeight: polylineData.weight || 5,
        icons: [{
            icon: { path: google.maps.SymbolPath[polytype] },
            offset: polylineData.arrowOffset || '100%',
        }],
        map: map,
    });
    return polylineHandle;
};







