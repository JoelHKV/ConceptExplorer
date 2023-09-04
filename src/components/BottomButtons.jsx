import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } from '../reducers/conceptExplorerSlice';

import { Button } from '@mui/material';
import './BottomButtons.css';

import { drawCanvasSizeReturnDataURL } from '../utilities/drawCanvasSizeReturnDataURL';


const BottomButtons = ({ showGlobeView, showOneConceptView, drawPolyline, roundCounter, optionChoiceHistory, processMarkers, updateMarkers, deleteHistory }) => {

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
    

    const homeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'HOME', [0.9, 0.7, 0.6], 80 / 6)
    const backButtonImage = drawCanvasSizeReturnDataURL(80, '', 'BACK', [0.9, 0.7, 0.6], 80 / 6)
    const routeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'ROUTE', [0.9, 0.7, 0.6], 80 / 6)
    const randomButtonImage = drawCanvasSizeReturnDataURL(80, '', 'RANDOM', [0.9, 0.7, 0.6], 80 / 6)
    const globeButtonImage = drawCanvasSizeReturnDataURL(80, '', 'GLOBE', [0.9, 0.7, 0.6], 80 / 6)


    const homeButtonEnabled = roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe';
    const backButtonEnabled = roundCounter > 0 && gameMode !== 'route' && gameMode !== 'details' && gameMode !== 'globe';
    const routeButtonEnabled = roundCounter > 0 && gameMode !== 'details' && gameMode !== 'globe';
    const randomButtonEnabled = gameMode !== 'details' && gameMode === 'globe';
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