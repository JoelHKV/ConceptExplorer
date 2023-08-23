import { useState, useEffect } from 'react';

export const googleMapLoader = (mapLocation) => {
   
    const [map, setMap] = useState(null);

    useEffect(() => {
        // Load the Google Maps JavaScript API
        const script = document.createElement('script');
        script.src = `https://returnsecret-c2cjxe2frq-lz.a.run.app`;
        script.defer = true;
        script.async = true;
        window.initMap = initMap;
        document.head.appendChild(script);
    }, []);

    const initMap = () => {
  
        const mapOptions = {  
            disableDefaultUI: true,
            gestureHandling: "auto",
        };

        if (mapLocation && mapLocation.lat && mapLocation.lng) {
            mapOptions.center = { lat: mapLocation.lat, lng: mapLocation.lng };
        }

        const mapElement = document.getElementById('map');
        const newMap = new window.google.maps.Map(mapElement, mapOptions);

        setMap(newMap); // Save the map instance in the state     
    };

    return map

}
