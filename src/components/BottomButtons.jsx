import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, deletePolylineState } from '../reducers/conceptExplorerSlice';

import './BottomButtons.css';

import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';
import { processRoute } from '../utilities/processRoute';

import { thisFlight, getCurrentLocation } from '../utilities/googleMapFlight';


const BottomButtons = ({ map, getMarkerDiameter, haltExecution, computeHalt, processMarkerClick, loaded, globalData, roundCounter, clickHistory, processMarkers, updateMarkers, setRoundCounter }) => {

    const dispatch = useDispatch();
 
    const markerState = useSelector((state) => state.counter[0].markerState);
    const gameMode = useSelector((state) => state.counter[0].gameMode);  
    const globalView = useSelector((state) => state.counter[0].globalView);
    const viewThreshold = useSelector((state) => state.counter[0].viewThreshold);   
    const zoomTracker = useSelector((state) => state.counter[0].zoomTracker);

    const buttonGeom = [0.9, 0.7, 0.6];
    const buttonTextSize = 0.16;

    useEffect(() => {
        if (loaded) {
            dispatch(newMapLocation({ dall: 'dall', value: globalView }));
            setGlobeView()
        }
    }, [loaded])

    useEffect(() => {

        if (!loaded || haltExecution || gameMode==='route') { return }
 
        if (zoomTracker[1] === viewThreshold && zoomTracker[0] === viewThreshold + 1) { // zooming out past threshold
            setGlobeView()
       
        }
        if (zoomTracker[1] === viewThreshold + 1 && zoomTracker[0] == viewThreshold) { // zooming in past threshold          
            const diameter = getMarkerDiameter('large')
            changeMarkerSize(diameter)
        }        
         
    }, [zoomTracker])


    const bottomButtonAction = (pressedButton) => {
 
        if (pressedButton === 'home') {
            setRoundCounter(0)
            clearGoogleMap()
            const goToChoice = clickHistory[0];
            processMarkers(goToChoice.conceptName, 0, goToChoice.centerLat, goToChoice.centerLng, false, false)
        }

        if (pressedButton === 'back') {
            const goToChoice = clickHistory[roundCounter - 1];
            const clickDirection = goToChoice.clickDirection
            const oppositeClickDirection = clickDirection !== 0 ? ((clickDirection + 4) > 8 ? (clickDirection + 4 - 8) : (clickDirection + 4)) : 0;
             
            processMarkers(goToChoice.conceptName, oppositeClickDirection, goToChoice.centerLat, goToChoice.centerLng, true, true)
        }

        if (pressedButton === 'route') {

            dispatch(newGameMode('route'))
            clearGoogleMap()
            const { thisMapLocation, thisRoute } = processRoute(clickHistory);
             
            dispatch(newMapLocation({ dall: 'dall', value: thisMapLocation }));
            
            setTimeout(() => {
                const diameter = getMarkerDiameter('medium')
                updateMarkers(thisRoute.concept, thisRoute.concept, thisRoute.lat, thisRoute.lng, 1, diameter, 'immediate')
            }, 100);


        }

        if (pressedButton === 'random') {
            dispatch(newGameMode('globe'))
            if (gameMode !== 'globe') {
                setGlobeView()
            }
                                                
            setTimeout(() => { 
                const conceptNumber = Math.floor(Math.random() * (globalData.branch.length));
                processMarkerClick(globalData.branch[conceptNumber], conceptNumber, globalData.lat[conceptNumber], globalData.lng[conceptNumber], false);
            }, 100);

                                 
        } 
        if (pressedButton === 'globe') {
            if (gameMode !== 'globe' || getCurrentLocation(map).zoom >= viewThreshold) {
                setGlobeView()
            }
    
            const destination = globalView;
           // computeHalt('halt')
            const flightTime = thisFlight(dispatch, newMapLocation, map, destination, viewThreshold)
            computeHalt(flightTime+200)
            setTimeout(() => { // set browsing markers
            //    computeHalt('go')
            }, flightTime);



        }
    }
    
    const setGlobeView = () => {
        clearGoogleMap()
        dispatch(newGameMode('globe'))
        
        setTimeout(() => {   
            const diameter = getMarkerDiameter('small')
            updateMarkers(globalData.branch, globalData.branch, globalData.lat, globalData.lng, 1, diameter, 'immediate')
        }, 30);
            
    }

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

    const buttonData = [
        { name: 'home', label: 'HOME', enabled: roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe' && !haltExecution },
        { name: 'back', label: 'BACK', enabled: roundCounter > 0 && gameMode !== 'route' && gameMode !== 'details' && gameMode !== 'globe' && !haltExecution },
        { name: 'route', label: 'ROUTE', enabled: roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe' && !haltExecution },
        { name: 'random', label: 'RAND', enabled: gameMode !== 'details' && !haltExecution },
        { name: 'globe', label: 'GLOBE', enabled: gameMode !== 'details' && !haltExecution },
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
                    onClick={() => button.enabled ? bottomButtonAction(button.name) : ''}
                    alt={button.label}
                />
            ))}
        </div>
    );
};

export default BottomButtons;