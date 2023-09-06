
export const googleMapFlight = (dispatch, newMapLocation, origin, destination, duration, latlngEasingFn, zoomEasingFn) => {

    //const dispatch = useDispatch();
    const hop = true
    const startTime = Date.now();

    const animatePanning = () => {
        const elapsed = Date.now() - startTime;
        const fraction = elapsed / duration;

        if (fraction < 1) {


            const latlngFraction = latlngEasingFn(fraction);
            const zoomFraction = zoomEasingFn(fraction);

            const lat = origin.lat + latlngFraction * (destination.lat - origin.lat);
            const lng = origin.lng + latlngFraction * (destination.lng - origin.lng);
            const zoom = Math.round(origin.zoom + zoomFraction * (destination.zoom - origin.zoom));
            let zoomWeight
            if (hop) {
                zoomWeight = fraction < 0.5 ? 2 * (0.5 - fraction) : 2 * (fraction - 0.5);
            }
            else {
                zoomWeight = 1; 
            }
            const weightedZoom = zoom * zoomWeight + 2 * (1 - zoomWeight)


            dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng, zoom: weightedZoom } }));
            setTimeout(function () {
                requestAnimationFrame(animatePanning);
            }, 50);
        } else {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: destination.lat, lng: destination.lng, zoom: destination.zoom } }));
        }
    }

    animatePanning();

}


export const firstTwoThirdEasing = (fraction) => {
    return fraction < 2 / 3 ? 1.5 * fraction : 1;
}
export const lastTwoThirdEasing = (fraction) => {
    return fraction < 1 / 3 ? 0 : 1.5 * (fraction - 1 / 3);
}

export const linearEasing = (fraction) => {
    return fraction
}

export const hopInAirEasing = (fraction) => {
    const midPointValue = 0.2;
    const startW = fraction < 1 / 2 ? 2* fraction * (0.5 - fraction)  : 0 
    console.log(startW)
    return  fraction  
}