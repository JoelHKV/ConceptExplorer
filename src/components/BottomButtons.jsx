import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } from '../reducers/conceptExplorerSlice';

import { Button } from '@mui/material';
import './BottomButtons.css';

import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';
import { processRoute } from '../utilities/processRoute';

import { thisFlight, getCurrentLocation } from '../utilities/googleMapFlight';

 


const BottomButtons = ({ map, getMarkerDiameter, isFlying, setIsFlying, processMarkerClick, loaded, globalData, roundCounter, clickHistory, processMarkers, updateMarkers, setRoundCounter }) => {

    const dispatch = useDispatch();

   
    const markerState = useSelector((state) => state.counter[0].markerState);
    const gameMode = useSelector((state) => state.counter[0].gameMode); 
   
    const browseView = useSelector((state) => state.counter[0].browseView);
    const globalView = useSelector((state) => state.counter[0].globalView);
    const viewThreshold = useSelector((state) => state.counter[0].viewThreshold);

    


    const markerDiameterPerZoom = useSelector((state) => state.counter[0].markerDiameterPerZoom);
    const googleMapDimensions = useSelector((state) => state.counter[0].googleMapDimensions);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);

    const zoomGlobal = useSelector((state) => state.counter[0].zoomGlobal);


    useEffect(() => {
        if (loaded) {
            dispatch(newMapLocation({ dall: 'dall', value: globalView }));
            setGlobeView()
        }
    }, [loaded])

    useEffect(() => {
        if (loaded && !isFlying) {
            if (zoomGlobal) {
                setGlobeView()
            }
            else {
                const diameter = getMarkerDiameter('big')
                changeMarkerSize(diameter)
            }        
        }
    }, [zoomGlobal])





    const changeMarkerSize = (diameter) => {
        let i = 0;

        while (markerState['Marker' + i]) {
            const thisMarker = { ...markerState['Marker' + i] };
            thisMarker.diameter = diameter;
            thisMarker.dataURL = drawCanvasSizeReturnDataURL(diameter, thisMarker.title, '', [0.9, 0.45, 0.35], diameter / 5)

            dispatch(newMarkerState({ markerName: 'Marker' + i, updatedData: thisMarker }));
            i++
        }

    }
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
             
            dispatch(newMapLocation({ dall: 'dall', value: thisMapLocation }));
            
            setTimeout(() => {
                const diameter = getMarkerDiameter('big')
                updateMarkers(thisRoute.concept, thisRoute.concept, thisRoute.lat, thisRoute.lng, 1, diameter)
            }, 100);


        }

        if (param === 'random') {
            dispatch(newGameMode('globe'))
            if (gameMode !== 'globe') {
                setGlobeView()
            }
                                                
            setTimeout(() => { 
                const conceptNumber = Math.floor(Math.random() * (globalData.branch.length));
                processMarkerClick(globalData.branch[conceptNumber], conceptNumber, globalData.lat[conceptNumber], globalData.lng[conceptNumber], false);
            }, 100);

                                 
        } 
        if (param === 'globe') {
            if (gameMode !== 'globe' || getCurrentLocation(map).zoom >= viewThreshold) {
                setGlobeView()
            }

           
            const destination = globalView;
            const flightTime = thisFlight(dispatch, newMapLocation, map, setIsFlying, destination, viewThreshold)
                   
        }
    }
    
    const setGlobeView = () => {
        clearGoogleMap()
        dispatch(newGameMode('globe'))
        

        setTimeout(() => {   
            const diameter = getMarkerDiameter('small')
            updateMarkers(globalData.branch, globalData.branch, globalData.lat, globalData.lng, 1, diameter)
        }, 30);
      
       
    }

    const homeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'HOME', [0.9, 0.7, 0.6], 80 / 6)
    const backButtonImage = drawCanvasSizeReturnDataURL(80, '', 'BACK', [0.9, 0.7, 0.6], 80 / 6)
    const routeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'ROUTE', [0.9, 0.7, 0.6], 80 / 6)
    const randomButtonImage = drawCanvasSizeReturnDataURL(80, '', 'RANDOM', [0.9, 0.7, 0.6], 80 / 6)
    const globeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'GLOBE', [0.9, 0.7, 0.6], 80 / 6)

    const homeButtonEnabled = roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe';
    const backButtonEnabled = roundCounter > 0 && gameMode !== 'route' && gameMode !== 'details' && gameMode !== 'globe';
    const routeButtonEnabled = roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe';
    const randomButtonEnabled = gameMode !== 'details' && !isFlying;
    const globeButtonEnabled = gameMode !== 'details' && !isFlying;

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