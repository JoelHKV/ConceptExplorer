
export const thisFlight = (dispatch, newMapLocation, map, setIsFlying, destination, viewThreshold) => {

  

    const googleMapPresentLocation = getCurrentLocation(map)

    let flyParams
    let flyTime
    let hopRoute = false
    if (googleMapPresentLocation.zoom > viewThreshold && destination.zoom > viewThreshold) { // down  up down flight
        flyParams = [linearEasing, linearEasing];
        flyTime = 3400;
        hopRoute = true;
    }
    if (googleMapPresentLocation.zoom < viewThreshold && destination.zoom > viewThreshold) { // up down flight
        flyParams = [firstTwoThirdEasing, lastTwoThirdEasing];
        flyTime = 1400;
    }
    if (destination.zoom <= viewThreshold) { // down up flight
        flyParams = [lastTwoThirdEasing, firstTwoThirdEasing];
        flyTime = 1400;
    }
   // console.log(flyTime)

   setIsFlying(true)   
   googleMapFlight(dispatch, newMapLocation, googleMapPresentLocation, destination,
        flyTime, flyParams[0], flyParams[1], hopRoute, setIsFlying)


    return flyTime

}


export const getCurrentLocation = (map) => {
    const newCenter = map.getCenter();
    const zoomLevel = map.getZoom()
    return { lat: newCenter.lat(), lng: newCenter.lng(), zoom: zoomLevel }

}



export const googleMapFlight = (dispatch, newMapLocation, origin, destination, duration, latlngEasingFn, zoomEasingFn, hop, setIsFlying) => {

    //const dispatch = useDispatch();
   // const hop = true
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
               // zoomWeight = Math.sqrt(fraction < 0.5 ? 2 * (0.5 - fraction) : 2 * (fraction - 0.5));
                zoomWeight = Math.pow(fraction < 0.5 ? 2 * (0.5 - fraction) : 2 * (fraction - 0.5), 2);
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
            setIsFlying(false)
        }
    }

    animatePanning();

}

export const squareRootEasing = (fraction) => {
    return Math.sqrt(fraction)
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

