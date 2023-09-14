
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, FormControlLabel } from '@mui/material'; // use MUI component library

import { createMarker, createPolyline } from '../utilities/googleMapHelper';
//import { googleMapLoader } from '../utilities/googleMapLoader';
import { measureGoogleMapDimensions } from '../hooks/measureGoogleMapDimensions';


import { newZoomGlobal } from '../reducers/conceptExplorerSlice';



import './GoogleMapsApp.css';

 
const GoogleMapsApp = ({ processMarkerClick, map }) => {
 
    const oldMarkerHandleArray = useRef({});
    const oldPolylineHandleArray = useRef({});
 
    const dispatch = useDispatch();
    const [mapLocked, setMapLocked] = useState(false);

    const gameMode = useSelector((state) => state.counter[0].gameMode);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);
    const markerState = useSelector((state) => state.counter[0].markerState);
    const polylineState = useSelector((state) => state.counter[0].polylineState);
    const zoomGlobal = useSelector((state) => state.counter[0].zoomGlobal);
    const viewThreshold = useSelector((state) => state.counter[0].viewThreshold);
    
     
    const { elementRef } = measureGoogleMapDimensions(); //measurements dispatched as a redux state
   

    useEffect(() => {
        if (map) {          
           //  map.setCenter({ lat: mapLocation.lat, lng: mapLocation.lng});
             map.panTo({ lat: mapLocation.lat, lng: mapLocation.lng });
           
            if (mapLocation.zoom) { // use zoom if zoom data is given
                 map.setZoom(mapLocation.zoom);
            }
            if (mapLocation.delta) { // use bounds if delta data is given
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend({ lat: mapLocation.lat + mapLocation.delta, lng: mapLocation.lng + mapLocation.delta });
                bounds.extend({ lat: mapLocation.lat - mapLocation.delta, lng: mapLocation.lng - mapLocation.delta });
                map.fitBounds(bounds);

            }                
        }
    }, [map, mapLocation]);

    useEffect(() => {
        if (map) {

            let markerNames = Object.keys(markerState); // this is what we want
            let oldMarkerNames = Object.keys(oldMarkerHandleArray); // this is the prev state
            if (markerNames.length === 0) {  // all markers deleted  
                oldMarkerNames.forEach((markerName) => {
                    if (markerName !== 'current') {
                        oldMarkerHandleArray[markerName].handle.setMap(null); // iterate handles and delete markers
                    }
                })
                oldMarkerHandleArray.current = {}; //delete handles
                return
            }

            let deleteMarkerNames = oldMarkerNames.filter(name => name !== 'current' && !markerNames.includes(name));
                if (oldMarkerHandleArray[deleteMarkerNames]) { // check the handle
                oldMarkerHandleArray[deleteMarkerNames].handle.setMap(null); // delete marker
                    delete oldMarkerHandleArray.current[deleteMarkerNames];
                return
                }
            
            markerNames.forEach((markerName, index) => {
                
                const markerData = markerState[markerName]; // Access the value using the key
                if (
                    !oldMarkerHandleArray[markerName] || // If oldMarkerDataArray[markerName] doesn't exist
                    (oldMarkerHandleArray[markerName].timestamp !== markerData.timestamp)
                ) {

                    if (oldMarkerHandleArray[markerName]) {
                        oldMarkerHandleArray[markerName].handle.setMap(null);
                    }

                    const newMarkerHandle = createMarker(map, markerData)
                    newMarkerHandle.addListener("click", () => {          
                        if (markerData.param === null) { return }
                        processMarkerClick(markerData.param ? markerData.param : markerData.title, index, markerData.lat, markerData.lng, true);
                    });

                    oldMarkerHandleArray[markerName] = {}
                    oldMarkerHandleArray[markerName].handle = newMarkerHandle
                    oldMarkerHandleArray[markerName].timestamp = markerData.timestamp
                                        
                }
            });

        }
    }, [map, markerState]);


    useEffect(() => {
        if (map) {

            let polylineNames = Object.keys(polylineState); // this is what we want
            let oldPolylineNames = Object.keys(oldPolylineHandleArray); // this is the prev state
            if (polylineNames.length === 0) {  // all markers deleted  
                oldPolylineNames.forEach((polylineName) => {
                    if (polylineName !== 'current') {
                        oldPolylineHandleArray[polylineName].handle.setMap(null); // iterate handles and delete markers
                    }
                })
                oldPolylineHandleArray.current = {}; //delete handles
                return
            }

            let deletePolylineNames = oldPolylineNames.filter(name => name !== 'current' && !polylineNames.includes(name));
            if (oldPolylineHandleArray[deletePolylineNames]) { // check the handle
                oldPolylineHandleArray[deletePolylineNames].handle.setMap(null); // delete marker
                delete oldPolylineHandleArray.current[deletePolylineNames];
                return
            }

            polylineNames.forEach((polylineName, index) => {
                
                const polylineData = polylineState[polylineName]; // Access the value using the key
                if (
                    !oldPolylineHandleArray[polylineName] || // If oldMarkerDataArray[markerName] doesn't exist
                    (oldPolylineHandleArray[polylineName].timestamp !== polylineData.timestamp)
                ) {

                    if (oldPolylineHandleArray[polylineName]) {
                        oldPolylineHandleArray[polylineName].handle.setMap(null);
                    }

                 
                    const newPolylineHandle = createPolyline(map, polylineData)
                    oldPolylineHandleArray[polylineName] = {}
                    oldPolylineHandleArray[polylineName].handle = newPolylineHandle
                    oldPolylineHandleArray[polylineName].timestamp = polylineData.timestamp



                }
            });

        }
    }, [map, polylineState]);


    useEffect(() => {

        const zoomChangeListener = map?.addListener('zoom_changed', () => {
            const zoomLevel = map.getZoom()
           // const zoomChange = 4;

            if ((zoomLevel < viewThreshold && zoomGlobal) || (zoomLevel > viewThreshold && !zoomGlobal)) {
                return
            }      
          dispatch(newZoomGlobal(!zoomGlobal))
        });
        const zoomListenerRef = React.createRef();
        zoomListenerRef.current = zoomChangeListener;

        return () => {
            if (zoomListenerRef.current) {
                google.maps.event.removeListener(zoomListenerRef.current);
            }
        };

    }, [map, gameMode, zoomGlobal]);

    useEffect(() => {
        const idleListener = map?.addListener("idle", () => {          

        });
        const centerListener = map?.addListener('center_changed', () => {
          
        });


    }, [map]);



    const handleMapLockChange = (event) => {
        setMapLocked(event.target.checked);
        const newGestureHandling = mapLocked ? "auto" : "none";
        map.setOptions({
            gestureHandling: newGestureHandling,
        });
    };
 
    return (   
        
        <div className="GoogleMapsApp">
                         
            <div id="map" ref={elementRef} ></div>
            <FormControlLabel className="move-or-not-box"
                control={<Checkbox checked={mapLocked}
                onChange={handleMapLockChange} />}
                label="Map Lock"
            />
            </div>
    );
        
};

export default GoogleMapsApp;