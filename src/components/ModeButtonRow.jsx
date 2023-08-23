import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { newGameMode, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } from '../reducers/conceptExplorerSlice';

import { Button } from '@mui/material';
import './ModeButtonRow.css';

const buttonData = [
    {
        name: 'home',
        className: 'fly-control',
        param: 'home',
    },
    {
        name: 'back',
        className: 'fly-control',
        param: 'back',
    },
    {
        name: 'route',
        className: 'fly-control',
        param: 'route',
    },
    {
        name: 'globe',
        className: 'fly-control',
        param: 'globe',
    },
    {
        name: 'random',
        className: 'fly-control',
        param: 'random',
    },
  

];

const ModeButtonRow = ({ diameter, drawPolyline, roundCounter, optionChoiceHistory, processMarkers, updateMarkers, deleteHistory, latLngData, showBaseConcept, globeConcepts, enabled }) => {

    const dispatch = useDispatch();


    const controlButtons = (param) => {

        if (param === 'home') {
            deleteHistory()
            const firstChoice = optionChoiceHistory[0];
            processMarkers(firstChoice[0], 0, firstChoice[10], firstChoice[11], 'nohist', false)
        }

        if (param === 'back') {
            const prevChoice = optionChoiceHistory[roundCounter - 1];
            const oppositeClickDirection = prevChoice[9] !== 0 ? ((prevChoice[9] + 4) > 8 ? (prevChoice[9] + 4 - 8) : (prevChoice[9] + 4)) : 0;
            processMarkers(prevChoice[0], oppositeClickDirection, prevChoice[10], prevChoice[11], 'hist', true)
        }

        if (param === 'route') {

            dispatch(newGameMode('route'))
            dispatch(deleteMarkerState({ markerName: 'ALL' }))
            dispatch(deletePolylineState({ polylineName: 'ALL' }))

            const latArray = [];
            const lngArray = [];
            const valArray = [];

            for (let i = 0; i < optionChoiceHistory.length; i++) {

                const thisStep = optionChoiceHistory[i];
                latArray.push(thisStep[10])
                lngArray.push(thisStep[11])
                valArray.push(thisStep[0])
                drawPolyline(thisStep[10], thisStep[11], thisStep[12], thisStep[13], i)


            }


            setTimeout(() => {
                updateMarkers(valArray, valArray, latArray, lngArray, 1, diameter)
            }, 100);

            const minLat2 = Math.min(...latArray);
            const maxLat2 = Math.max(...latArray);
            const minLng2 = Math.min(...lngArray);
            const maxLng2 = Math.max(...lngArray);

            const thisMapLocation = {
                lat: (minLat2 + maxLat2) / 2, // Default latitude  
                lng: (minLng2 + maxLng2) / 2, // Default longitude  dall
                delta: Math.max((minLng2 - maxLng2), (minLat2 - maxLat2)),
            }

            dispatch(newMapLocation({ dall: 'dall', value: thisMapLocation }));

        }




        if (param === 'globe') {
            dispatch(newGameMode('globe'))
            deleteHistory()
            dispatch(newMapLocation({ dall: 'dall', value: { lat: 0, lng: 0, zoom: 2 } }));
            updateMarkers(globeConcepts, globeConcepts, latLngData.lat, latLngData.lng, 1, 60)
        }



        if (param === 'random') {
            const randInd = Math.floor(Math.random() * (globeConcepts.length + 0));
            showBaseConcept(randInd)

        } 


    }



    const buttons = buttonData.map((button, index) => (
        <div key={index} className={`${button.className} ${enabled[index] ? '' : 'mode-button-disabled'}`}>
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