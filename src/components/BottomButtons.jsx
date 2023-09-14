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

    
     
    const googleMapDimensions = useSelector((state) => state.counter[0].googleMapDimensions);
    const mapLocation = useSelector((state) => state.counter[0].mapLocation);

    const zoomTracker = useSelector((state) => state.counter[0].zoomTracker);


    useEffect(() => {
        if (loaded) {
            dispatch(newMapLocation({ dall: 'dall', value: globalView }));
            setGlobeView()
        }
    }, [loaded])

    useEffect(() => {

        if (!loaded || isFlying || gameMode==='route') { return }
 
        if (zoomTracker[1] === viewThreshold && zoomTracker[0] === viewThreshold + 1) { // zooming out past threshold
            setGlobeView()
       
        }
        if (zoomTracker[1] === viewThreshold + 1 && zoomTracker[0] == viewThreshold) { // zooming in past threshold
            console.log('bigmarker')
            const diameter = getMarkerDiameter('big')
            changeMarkerSize(diameter)
        }        
         
    }, [zoomTracker])





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
                const diameter = getMarkerDiameter('medium')
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

    const buttonGeom = [0.9, 0.7, 0.6];
    const buttonTextSize = 0.16;

    const buttonData = [
        { name: 'home', label: 'HOME', enabled: roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe' },
        { name: 'back', label: 'BACK', enabled: roundCounter > 0 && gameMode !== 'route' && gameMode !== 'details' && gameMode !== 'globe' },
        { name: 'route', label: 'ROUTE', enabled: roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe' },
        { name: 'random', label: 'RAND', enabled: gameMode !== 'details' && !isFlying },
        { name: 'globe', label: 'GLOBE', enabled: gameMode !== 'details' && !isFlying },
    ];

    const buttonImages = {};

    for (const button of buttonData) {
        buttonImages[button.name] = drawCanvasSizeReturnDataURL(80, '', button.label, buttonGeom, 80 * buttonTextSize);
    }

    return (
        <div className="BottomButtons">
            {buttonData.map((button) => (
                <img
                    key={button.name}
                    className={`${button.name}-button ${button.enabled ? '' : 'mode-button-disabled'}`}
                    src={buttonImages[button.name]}
                    onClick={() => button.enabled ? controlButtons(button.name) : ''}
                    alt={button.label}
                />
            ))}
        </div>
    );
};

export default BottomButtons;