import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } from '../reducers/conceptExplorerSlice';

import { Button } from '@mui/material';
import './BottomButtons.css';

import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';
import { processRoute } from '../utilities/processRoute';


const BottomButtons = ({ loaded, globalData, roundCounter, clickHistory, processMarkers, updateMarkers, setRoundCounter }) => {

    const dispatch = useDispatch();

   
    const markerState = useSelector((state) => state.counter[0].markerState);
    const gameMode = useSelector((state) => state.counter[0].gameMode); 
   
    const browseZoomLevel = useSelector((state) => state.counter[0].browseZoomLevel);
    const globalConceptZoomLevel = useSelector((state) => state.counter[0].globalConceptZoomLevel);
    const markerDiameterPerZoom = useSelector((state) => state.counter[0].markerDiameterPerZoom);
    const googleMapDimensions = useSelector((state) => state.counter[0].googleMapDimensions);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);

    const googleMapPresentLocation = useSelector((state) => state.counter[0].googleMapPresentLocation);




    useEffect(() => {
        if (loaded) {
            dispatch(newMapLocation({ dall: 'dall', value: { lat: 0, lng: 0, zoom: globalConceptZoomLevel } }));
            showGlobeView()
        }
    }, [loaded])


    const clearGoogleMap = () => {
        dispatch(deleteMarkerState({ markerName: 'ALL' }))
        dispatch(deletePolylineState({ polylineName: 'ALL' }))
    }


    const controlButtons = (param) => {
 
        if (param === 'home') {
            setRoundCounter(0)
            clearGoogleMap()
            const goToChoice = clickHistory[0];
            processMarkers(goToChoice.conceptName, 0, goToChoice.centerLat, goToChoice.centerLng, false, false)
        }

        if (param === 'back') {
            const goToChoice = clickHistory[roundCounter - 1];
            const clickDirection = goToChoice.clickDirection
            const oppositeClickDirection = clickDirection !== 0 ? ((clickDirection + 4) > 8 ? (clickDirection + 4 - 8) : (clickDirection + 4)) : 0;
            processMarkers(goToChoice.conceptName, oppositeClickDirection, goToChoice.centerLat, goToChoice.centerLng, true, true)
        }

        if (param === 'route') {

            dispatch(newGameMode('route'))
            clearGoogleMap()
            const { thisMapLocation, thisRoute } = processRoute(clickHistory);
            const zoomLevel = 4
            dispatch(newMapLocation({ dall: 'dall', value: thisMapLocation }));

            setTimeout(() => {
                updateMarkers(thisRoute.concept, thisRoute.concept, thisRoute.lat, thisRoute.lng, 1, markerDiameterPerZoom[zoomLevel])
            }, 100);


        }

        if (param === 'random') {
            if (gameMode === 'globe') {
                ///showRandomGlobalConcept()


                

                const markerName = 'Marker' + Math.floor(Math.random() * (globalData.branch.length + 0));
            flyFromTo(googleMapPresentLocation, { lat: markerState[markerName].lat, lng: markerState[markerName].lng, zoom: browseZoomLevel }, 1400)
            }
            else {
             //   showGlobeView()

                clearGoogleMap()
                
                setTimeout(() => {
                      updateMarkers(globalData.branch, globalData.branch, globalData.lat, globalData.lng, 1, 120)
                 
                }, 100)   
                setTimeout(() => {
                    
                    showRandomGlobalConcept()
                }, 200)    
            }
             
        } 
        if (param === 'globe') {

            if (gameMode === 'globe') {
               // console.log(googleMapPresentLocation)
                flyFromTo(googleMapPresentLocation, { lat: 0, lng: 0, zoom: 2 }, 400)
                return
            }

            
            showGlobeView()
        }

    }


    const flyFromTo = (origin, destination, duration) => {


        var startTime = Date.now();

        function animatePanning() {
            var elapsed = Date.now() - startTime;
            var fraction = elapsed / duration;

            if (fraction < 1) {

                var squareRootFraction = Math.sqrt(fraction);
                var cubeRootFraction = Math.cbrt(fraction);
                var squaredFraction = Math.pow(fraction, 2);
                var cubedFraction = Math.pow(fraction, 3);
                var lat = origin.lat + squareRootFraction * (destination.lat - origin.lat);
                var lng = origin.lng + squareRootFraction * (destination.lng - origin.lng);
                var zoom = Math.round(origin.zoom + cubeRootFraction * (destination.zoom - origin.zoom));
                var zoom = Math.round(origin.zoom + fraction * (destination.zoom - origin.zoom));
                console.log(lat, lng, zoom)
              //  var newCenter = new google.maps.LatLng(lat, lng);
               // map.panTo(newCenter);
                dispatch(newMapLocation({ dall: 'dall', value: { lat: lat, lng: lng, zoom: zoom } }));
                requestAnimationFrame(animatePanning);
            } else {
                  dispatch(newMapLocation({ dall: 'dall', value: { lat: destination.lat, lng: destination.lng, zoom: destination.zoom } }));
            }
        }

        animatePanning();


     //   const distances = [0.7, 1];
   //     
      //  const flySteps = distances.map((distancePercent, i) => {

     //       const tempLat = (1 - distancePercent) * origin.lat + distancePercent * destination.lat;
       //     const tempLng = (1 - distancePercent) * origin.lng + distancePercent * destination.lng;
        //    const tempZoom = (1 - distancePercent) * origin.zoom + distancePercent * destination.zoom;
        //    console.log(tempLat, tempLng, tempZoom)
         //   setTimeout(() => {
         //   dispatch(newMapLocation({ dall: 'dall', value: { lat: tempLat, lng: tempLng, zoom: 2 } }));
         //   }, 300 * i);
       // }) 


    }
    const showGlobeView = () => {
        //deleteHistory()
        clearGoogleMap()

        const minDimen = Math.min(googleMapDimensions.width, googleMapDimensions.height)
        const diameter = minDimen * markerDiameterPerZoom[globalConceptZoomLevel]


        setTimeout(() => {
            dispatch(newGameMode('globe'))
            dispatch(newMapLocation({ dall: 'dall', value: { lat: 0, lng: 0, zoom: globalConceptZoomLevel } }));
            updateMarkers(globalData.branch, globalData.branch, globalData.lat, globalData.lng, 1, diameter)
         }, 100);
    }

    const showRandomGlobalConcept = () => {   
        const markerName = 'Marker' + Math.floor(Math.random() * (globalData.branch.length + 0));
       // dispatch(newMapLocation({ dall: 'dall', value: { lat: markerState[markerName].lat, lng: markerState[markerName].lng, zoom: browseZoomLevel } }));
        const distancePercent = 0.9;
        const intermLat = (1 - distancePercent) * mapLocation.lat + distancePercent *markerState[markerName].lat
        const intermLng = (1 - distancePercent) * mapLocation.lng + distancePercent * markerState[markerName].lng
        console.log(intermLat, intermLng)
        dispatch(newMapLocation({ dall: 'dall', value: { lat: intermLat, lng: intermLng, zoom: 4 } }));
        setTimeout(() => {

            dispatch(newMapLocation({ dall: 'dall', value: { lat: markerState[markerName].lat, lng: markerState[markerName].lng, zoom: 7 } }));

        }, 700) 


    }


    const homeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'HOME', [0.9, 0.7, 0.6], 80 / 6)
    const backButtonImage = drawCanvasSizeReturnDataURL(80, '', 'BACK', [0.9, 0.7, 0.6], 80 / 6)
    const routeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'ROUTE', [0.9, 0.7, 0.6], 80 / 6)
    const randomButtonImage = drawCanvasSizeReturnDataURL(80, '', 'RANDOM', [0.9, 0.7, 0.6], 80 / 6)
    const globeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'GLOBE', [0.9, 0.7, 0.6], 80 / 6)


    const homeButtonEnabled = roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe';
    const backButtonEnabled = roundCounter > 0 && gameMode !== 'route' && gameMode !== 'details' && gameMode !== 'globe';
    const routeButtonEnabled = roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe';
    const randomButtonEnabled = gameMode !== 'details';
    const globeButtonEnabled = gameMode !== 'details';

  

    return (
        <div className="BottomButtons">
            {gameMode !== 'glodbe' && (
                <> 
                    <img className={`home-button ${homeButtonEnabled ? '' : 'mode-button-disabled'}`} src={homeButtonImage} onClick={() => homeButtonEnabled ? controlButtons('home') : ''} alt="HOME" />
                    <img className={`back-button ${backButtonEnabled ? '' : 'mode-button-disabled'}`} src={backButtonImage} onClick={() => backButtonEnabled ? controlButtons('back') : ''} alt="BACK" />
                    <img className={`route-button ${routeButtonEnabled ? '' : 'mode-button-disabled'}`} src={routeButtonImage} onClick={() => routeButtonEnabled ? controlButtons('route') : ''} alt="ROUTE" />
                </>
            )}
            {gameMode !== 'glsdsobe' && (
                <img className={`random-button ${randomButtonEnabled ? '' : 'mode-button-disabled'}`} src={randomButtonImage} onClick={() => controlButtons('random')} alt="RANDOM" />
             )}
            <img className={`globe-button ${globeButtonEnabled ? '' : 'mode-button-disabled'}`} src={globeButtonImage} onClick={() => controlButtons('globe')} alt="GLOBE" />

        </div>
    );
};

export default BottomButtons;