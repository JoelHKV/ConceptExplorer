import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } from '../reducers/conceptExplorerSlice';

import { Button } from '@mui/material';
import './ModeButtonRow.css';


const ModeButtonRow = ({ showGlobeView, showOneConceptView, drawPolyline, roundCounter, optionChoiceHistory, processMarkers, updateMarkers, deleteHistory }) => {

    const dispatch = useDispatch();

   
    const markerState = useSelector((state) => state.counter[0].markerState);
    const gameMode = useSelector((state) => state.counter[0].gameMode); 
  //  const singleConceptZoomLevel = useSelector((state) => state.counter[0].singleConceptZoomLevel);
  //  const globalConceptZoomLevel = useSelector((state) => state.counter[0].globalConceptZoomLevel);
    const markerDiameterPerZoom = useSelector((state) => state.counter[0].markerDiameterPerZoom);


    const controlButtons = (param) => {
        // processMarkers(thisConcept, 0, lat, lng, 'nohist', true)
        if (param === 'home') {
            deleteHistory()
            const goToChoice = optionChoiceHistory[0];
            processMarkers(goToChoice.conceptName, 0, goToChoice.centerLat, goToChoice.centerLng, 'nohist', false)
        }

        if (param === 'back') {
            const goToChoice = optionChoiceHistory[roundCounter - 1];
            const clickDirection = goToChoice.clickDirection
            const oppositeClickDirection = clickDirection !== 0 ? ((clickDirection + 4) > 8 ? (clickDirection + 4 - 8) : (clickDirection + 4)) : 0;
            processMarkers(goToChoice.conceptName, oppositeClickDirection, goToChoice.centerLat, goToChoice.centerLng, 'hist', true)
        }

        if (param === 'route') {

            dispatch(newGameMode('route'))
            dispatch(deleteMarkerState({ markerName: 'ALL' }))
            dispatch(deletePolylineState({ polylineName: 'ALL' }))

            const latArray = [];
            const lngArray = [];
            const valArray = [];

            for (let i = 0; i < optionChoiceHistory.length; i++) {

                const thisChoice = optionChoiceHistory[i];
                latArray.push(thisChoice.centerLat)
                lngArray.push(thisChoice.centerLng)
                valArray.push(thisChoice.conceptName)
                drawPolyline(thisChoice.centerLat, thisChoice.centerLng, thisChoice.clickLat, thisChoice.clickLng, i)

            }

            const zoomLevel = 4
                      
            const minLat2 = Math.min(...latArray);
            const maxLat2 = Math.max(...latArray);
            const minLng2 = Math.min(...lngArray);
            const maxLng2 = Math.max(...lngArray);

            const latLngSpace = Math.max((maxLng2 - minLng2), (maxLat2 - minLat2))

            const thisMapLocation = {
                lat: (minLat2 + maxLat2) / 2, // Default latitude  
                lng: (minLng2 + maxLng2) / 2, // Default longitude  dall
                delta: latLngSpace,
            }

            dispatch(newMapLocation({ dall: 'dall', value: thisMapLocation }));

            setTimeout(() => {
                updateMarkers(valArray, valArray, latArray, lngArray, 1, markerDiameterPerZoom[zoomLevel])
            }, 100);


        }


        if (param === 'globe') {
            showGlobeView()
        }


        if (param === 'random') {
            showOneConceptView(-1)
        } 


    }
    let buttonData = []
    console.log(gameMode)
    if (gameMode === 'globe') {
        buttonData = [
            {
                name: 'random',
                className: 'browse-control',
                enabled: true,
                param: 'random',
            },
            {
                name: 'globe',
                className: 'browse-control',
                enabled: true,
                param: 'globe',
            },



        ];

    } else {
        buttonData = [
            {
                name: 'home',
                className: 'browse-control',
                enabled: roundCounter > 0 && gameMode !== 'details',
                param: 'home',
            },
            {
                name: 'back',
                className: 'browse-control',
                enabled: roundCounter > 0 && gameMode !== 'route' && gameMode !== 'details',
                param: 'back',
            },
            {
                name: 'route',
                className: 'browse-control',
                enabled: roundCounter > 0 && gameMode !== 'details',
                param: 'route',
            },
            {
                name: 'globe',
                className: 'browse-control',
                enabled: gameMode !== 'details',
                param: 'globe',
            },
        ];
    }


     
    const buttons = buttonData.map((button, index) => (
        <div key={index} className={`${button.className} ${button.enabled ? '' : 'mode-button-disabled'}`}>
            <Button variant="contained" onClick={() => controlButtons(button.param)}>
                {button.name}
            </Button>
        </div>
    ));

    return (
        <div className="ModeButtonRow centerContent">
            {buttons}
        </div>
    );
};

export default ModeButtonRow;