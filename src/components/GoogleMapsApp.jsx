
import React, { useState, useEffect } from 'react';
 
import './GoogleMapsApp.css';

 
const GoogleMapsApp = ({ mapData, handleIdleFunction,  markerFunction }) => {

    const [markerPolylineHandleArray, setMarkerPolylineHandleArray] = useState(null);
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
        // Initialize the map
        const mapOptions = {
            center: { lat: mapData.lat, lng: mapData.lng }, // San Francisco coordinates
            zoom: mapData.zoom,
            disableDefaultUI: true,
            gestureHandling: "none",
        };

        const mapElement = document.getElementById('map');
        const newMap = new window.google.maps.Map(mapElement, mapOptions);




        newMap.addListener("idle", () => {           
            handleIdleFunction()       
        });


        setMap(newMap); // Save the map instance in the state
        
    };

  
    useEffect(() => {
        if (map) {     
            //map.setCenter({ lat: mapData.lat, lng: mapData.lng });

            map.panTo({ lat: mapData.lat, lng: mapData.lng });


            if (mapData.zoom) { // use zoom if zoom data is given
                map.setZoom(mapData.zoom);
            }
            if (mapData.delta) { // use bounds if delta data is given
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend({ lat: mapData.lat + mapData.delta, lng: mapData.lng + mapData.delta });
                bounds.extend({ lat: mapData.lat - mapData.delta, lng: mapData.lng - mapData.delta });
                map.fitBounds(bounds);
            }

            const allMarkerPolylineHandles = [];
            if (markerPolylineHandleArray) {
                markerPolylineHandleArray.forEach((thisMarkerPolylineHandle) => {
                thisMarkerPolylineHandle.setMap(null);
                });
                setMarkerPolylineHandleArray(null);
            }

            if (mapData.markers) {
         
                const defaultLabelOptions = {
                    text: ' ',
                    color: 'black',
                    fontSize: '18px',
                    fontWeight: 'bold'
                };
           
                mapData.markers.forEach((markerData, index) => {
                    const labelOptions = markerData.label // use specified label data if given, otherwise default
                        ? Object.assign({}, defaultLabelOptions, markerData.label)
                        : defaultLabelOptions;

                    let markerImage = null; //no marker image for regular marker
                    if (markerData.custom) { 
                        const diameter = markerData.custom.diameter;
                        markerImage = new google.maps.MarkerImage(
                            markerData.custom.dataURL, // data for custom marker
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
                    markerHandle.addListener("click", () => {
                        markerFunction(markerData.param ? markerData.param : markerData.title, index, markerData.lat, markerData.lng);

                    });             
                    allMarkerPolylineHandles.push(markerHandle)
                })
                
            } 
            
            if (mapData.polylines) { // polyline
                mapData.polylines.forEach((polylineData) => {    
                    const polytype = polylineData.symbol || 'FORWARD_CLOSED_ARROW'
                    const polylineHandle = new window.google.maps.Polyline({
                        path: [{ lat: polylineData.lat[0], lng: polylineData.lng[0] }, { lat: polylineData.lat[1], lng: polylineData.lng[1] }],
                        geodesic: true,
                        strokeColor: polylineData.color || 'red',
                        strokeOpacity: polylineData.opacity || 1,
                        strokeWeight: polylineData.weight || 5,
                        icons: [{
                            icon: { path: google.maps.SymbolPath[polytype] },
                            offset: polylineData.arrowOffset || '100%'
                        }],
                        map: map, 
                    });
                    allMarkerPolylineHandles.push(polylineHandle)
                });
            }
            setMarkerPolylineHandleArray(allMarkerPolylineHandles)
        
        }
    }, [map, mapData]);
    

    return (                 
        <div id="map" ></div>        
    );
        
};

export default GoogleMapsApp;