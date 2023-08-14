
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { newMapState } from '../reducers/quizGameSlice';


import { Grid, Box, Switch, Typography, Slider, Checkbox, FormControlLabel } from '@mui/material'; // use MUI component library


import './GoogleMapsApp.css';



 
const GoogleMapsApp = ({ markerFunction  }) => {
 
    const [markerHandleArray, setMarkerHandleArray] = useState([]);
    const [polylineHandleArray, setPolylineHandleArray] = useState([]);
    const [map, setMap] = useState(null);

    const [mapLocked, setMapLocked] = useState(false);

    const mapState = useSelector((state) => state.counter[0].mapState);
    const dispatch = useDispatch();


    const handleMapLockChange = (event) => {
        setMapLocked(event.target.checked);
        const newGestureHandling = mapLocked ? "auto" : "none";
        map.setOptions({
             gestureHandling: newGestureHandling,
       });
    };





    const updateMarkerPolylineArrayAtIndex = (arraySetter, index, newValue) => {
        arraySetter((prevArray) => {
            if (index >= 0) {
                const newArray = [...prevArray];
                while (newArray.length <= index) {
                    newArray.push(null); // Fill with null values up to the desired index
                }
                newArray[index] = newValue;
                return newArray;
            }
            return prevArray; // Return the array unchanged if index is negative
        });
    };

    const createMarker = (markerData, index) => {

        const defaultLabelOptions = {
            text: ' ',
            color: 'black',
            fontSize: '18px',
            fontWeight: 'bold'
        };

        const labelOptions = markerData.label // use specified label data if given, otherwise default
            ? Object.assign({}, defaultLabelOptions, markerData.label)
            : defaultLabelOptions;

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
        markerHandle.addListener("click", () => {
            if (markerData.param === null) { return }
            markerFunction(markerData.param ? markerData.param : markerData.title, index, markerData.lat, markerData.lng);

        });  
        return markerHandle
    }

    const createPolyline = (polylineData) => {
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
        return polylineHandle
    }




   
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

       // if (mapLocked) { 

        const mapOptions = {
            center: { lat: mapState.lat, lng: mapState.lng }, // San Francisco coordinates
            disableDefaultUI: true,
            gestureHandling: "auto",
        };

        const mapElement = document.getElementById('map');
        const newMap = new window.google.maps.Map(mapElement, mapOptions);

        newMap.addListener("idle", () => {           
            //handleIdleFunction()       
        });

        setMap(newMap); // Save the map instance in the state     
    };


  

  
    useEffect(() => {
        if (map) {     
            //map.setCenter({ lat: mapState.lat, lng: mapState.lng });

            map.panTo({ lat: mapState.lat, lng: mapState.lng });


            if (mapState.zoom) { // use zoom if zoom data is given
                map.setZoom(mapState.zoom);
                dispatch(newMapState({ attribute: 'zoom', value: null }));
            }
            if (mapState.delta) { // use bounds if delta data is given
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend({ lat: mapState.lat + mapState.delta, lng: mapState.lng + mapState.delta });
                bounds.extend({ lat: mapState.lat - mapState.delta, lng: mapState.lng - mapState.delta });
                map.fitBounds(bounds);

                dispatch(newMapState({ attribute: 'delta', value: null }));

                const updatedZoom = map.getZoom();
                console.log("Updated Zoom Level:", updatedZoom);

            }

            if (mapState.markers) {                  
                mapState.markers.forEach((markerData, index) => {                   
                    if (markerData.render) {      
                         const oldMarkerHandle = markerHandleArray[index];                     
                        if (oldMarkerHandle && oldMarkerHandle.setMap) { //                             
                             oldMarkerHandle.setMap(null); // This removes the marker from the map
                        }   
                        let newMarkerHandle = null
                        if (!markerData.delete) {
                            newMarkerHandle = createMarker(markerData, index)
                        }                   
                        updateMarkerPolylineArrayAtIndex(setMarkerHandleArray, index, newMarkerHandle)
                        dispatch(newMapState({ attribute: 'render', value: false, markerIndex: index }));                      
                     }
               })
                
            } 
            
            if (mapState.polylines) { // polyline             
                mapState.polylines.forEach((polylineData, index) => {  
                    if (polylineData.render) {
                        const oldPolylineHandle = polylineHandleArray[index];
                        if (oldPolylineHandle && oldPolylineHandle.setMap) {
                            oldPolylineHandle.setMap(null); // This removes the polyline from the map
                        }  
                        let newPolylineHandle = null
                        if (!polylineData.delete) {
                            newPolylineHandle = createPolyline(polylineData) 
                        }
                                            
                        updateMarkerPolylineArrayAtIndex(setPolylineHandleArray, index, newPolylineHandle)
                        dispatch(newMapState({ attribute: 'render', value: false, polylineIndex: index }));                                               
                     }
                    
                });
            }
          
        
        }
    }, [map, mapState]);
    

    return (   
        
        <div className="GoogleMapsApp centerContent">
                         
        <div id="map" ></div>
            <FormControlLabel className="move-or-not-box"
                control={<Checkbox checked={mapLocked}
                onChange={handleMapLockChange} />}
                label="Map Lock"
            />
            </div>
    );
        
};

export default GoogleMapsApp;