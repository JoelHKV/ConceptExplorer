
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { newMapLocation, newPolylineState, newMarkerState, newGameMode } from '../reducers/quizGameSlice';


import { Grid, Box, Switch, Typography, Slider, Checkbox, FormControlLabel } from '@mui/material'; // use MUI component library


import './GoogleMapsApp.css';



 
const GoogleMapsApp = ({ markerFunction, handleZoomChangedFunction }) => {
 
 
    const [map, setMap] = useState(null);
    const oldMarkerHandleArray = useRef({});
    const oldPolylineHandleArray = useRef({});
 

    const [mapLocked, setMapLocked] = useState(false);
    const [zoomListenerHandle, setZoomListenerHandle] = useState();
   
    const polylineState = useSelector((state) => state.counter[0].polylineState);
    const markerState = useSelector((state) => state.counter[0].markerState);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);
    const gameMode = useSelector((state) => state.counter[0].gameMode);

   


    const dispatch = useDispatch();




   
    useEffect(() => {
        // Load the Google Maps JavaScript API
        const script = document.createElement('script');
        script.src = `https://returnsecret-c2cjxe2frq-lz.a.run.app`;
        script.defer = true;
        script.async = true;
        window.initMap = initMap;
        document.head.appendChild(script);
    }, []);

    useEffect(() => {
        if (map) {
             
            //map.setCenter({ lat: mapState.lat, lng: mapState.lng });
          //  if (mapLocation.lat) {
                map.panTo({ lat: mapLocation.lat, lng: mapLocation.lng });
          //  }

            if (mapLocation.zoom) { // use zoom if zoom data is given
                map.setZoom(mapLocation.zoom);
              //  dispatch(newMapLocation({ attribute: 'zoom', value: null }));
            }
            if (mapLocation.delta) { // use bounds if delta data is given
                const bounds = new window.google.maps.LatLngBounds();
                bounds.extend({ lat: mapLocation.lat + mapLocation.delta, lng: mapLocation.lng + mapLocation.delta });
                bounds.extend({ lat: mapLocation.lat - mapLocation.delta, lng: mapLocation.lng - mapLocation.delta });
                map.fitBounds(bounds);

             //   dispatch(newMapLocation({ attribute: 'delta', value: null }));

              //  const updatedZoom = map.getZoom();
              //  console.log("Updated Zoom Level:", updatedZoom);

            } 


           


             


        }
    }, [map, mapLocation]);


    useEffect(() => {

        console.log('add listener')
        const zoomChangeListener = map?.addListener('zoom_changed', zoomFunction);
        const zoomListenerRef = React.createRef();
        zoomListenerRef.current = zoomChangeListener;

        return () => {
            if (zoomListenerRef.current) {
                console.log('remove listener');
                google.maps.event.removeListener(zoomListenerRef.current);
            }
        };

    }, [map, gameMode]);

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

                    const newMarkerHandle = createMarker2(markerData, index)
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

                  //  const newPolylineHandle = createMarker2(polylineData, index)
                    const newPolylineHandle = createPolyline(polylineData)
                    oldPolylineHandleArray[polylineName] = {}
                    oldPolylineHandleArray[polylineName].handle = newPolylineHandle
                    oldPolylineHandleArray[polylineName].timestamp = polylineData.timestamp



                }
            });

        }
    }, [map, polylineState]);



 



    const handleMapLockChange = (event) => {
        setMapLocked(event.target.checked);
        const newGestureHandling = mapLocked ? "auto" : "none";
        map.setOptions({
             gestureHandling: newGestureHandling,
       });
    };


     


    const createMarker2 = (markerData, index) => {
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




   





    const initMap = () => {
        // Initialize the map

       // if (mapLocked) { 

        const mapOptions = {
            center: { lat: mapLocation.lat, lng: mapLocation.lng },  
            disableDefaultUI: true,
            gestureHandling: "auto",
        };

        const mapElement = document.getElementById('map');
        const newMap = new window.google.maps.Map(mapElement, mapOptions);

        newMap.addListener("idle", () => {           
            //handleIdleFunction()       
        });

       // newMap.addListener("zoom_changed", () => {
            
        //    const newZoomLevel = newMap.getZoom();
        //    handleZoomChangedFunction(newZoomLevel)
       // });

        setMap(newMap); // Save the map instance in the state     
    };

    const zoomFunction = () => {
        console.log(gameMode)
        const newZoomLevel = map.getZoom();
      //  console.log(newZoomLevel)

        handleZoomChangedFunction(newZoomLevel)


    }
    
   // useEffect(() => {
        // Attach the event listener when the component mounts
     //   if (map) {
      //      map.addListener(map, 'zoom_changed', handleZoomChangedFunction);

            // Clean up the event listener when the component unmounts
         //   return () => {
         //       map.removeListener(map, 'zoom_changed', handleZoomChangedFunction);
         //   };
      //  }
   // }, [map, gameMode]);
  

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