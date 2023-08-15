import { createSlice } from '@reduxjs/toolkit';
import { drawCircleCanvas2ReturnDataURL } from '../utilities/drawCircleCanvas2ReturnDataURL';

const diameter=90

const initMapData = {
    lat: 27.7749, // Default latitude  
    lng: -112.4194, // Default longitude  
    // zoom: 7, // Default zoom level
     delta: 2,
    markers: [
       
        {
            lat: 27.7749, // Latitude of the first marker
            lng: -112.4194, // Longitude of the first marker
            title: "MIND", // Title of the first marker
            param: "mind",
            label: {
                color: "black",
            },
            render: true,
            diameter: diameter,
            dataURL: drawCircleCanvas2ReturnDataURL(diameter, 'MIND', 2.9),

        },

        {
            lat: 29.7749, // Latitude of the first marker
            lng: -112.4194, // Longitude of the first marker
            title: "SPACE", // Title of the first marker
            param: "space",
            label: {
                color: "black",
            },
            render: true,
            diameter: diameter,
            dataURL: drawCircleCanvas2ReturnDataURL(diameter, 'SPACE', 2.9),

        },


    

    ],
    polylines: [ ],

};




const initialState = [
    {
        round: 0,
        gameMode: 'browse',
        concept: 'mind',
        mapState: initMapData,
    }
]

const quizGameReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {     
        newRound: (state, newValue) => {
            state[0].round = state[0].round + newValue.payload;
        },
        newGameMode: (state, newValue) => {
            state[0].gameMode = newValue.payload;
        },
        newConcept: (state, newValue) => {
            state[0].concept = newValue.payload;
        },
        newMapState: (state, action) => {
            const { attribute, dall, value, markerIndex, polylineIndex } = action.payload;
            if (typeof dall !== 'undefined') {
                 
                state[0].mapState = value;

                
                    
            


                return
            }

            if (typeof markerIndex === 'undefined' && typeof polylineIndex === 'undefined') {
                state[0].mapState[attribute] = value;
                return
            }
            
            if (typeof markerIndex !== 'undefined') {

                if (markerIndex === null) {
                    state[0].mapState.markers = [];
                    console.log('del')
                    return
                }



               // console.log(markerIndex)
                if (!state[0].mapState.markers[markerIndex]) {
                    state[0].mapState.markers[markerIndex] = {}
                }
                if (typeof attribute !== 'undefined') { // updating specific attribute
                    state[0].mapState.markers[markerIndex][attribute] = value;
                }
                else {  // or the whole marker at once            
                    state[0].mapState.markers[markerIndex] = value;
                }
            }
            if (typeof polylineIndex !== 'undefined') {

                if (polylineIndex === null) {
                    state[0].mapState.polylines = [];
                    console.log('del')
                    return
                }


                if (!state[0].mapState.polylines[polylineIndex]) {
                    state[0].mapState.polylines[polylineIndex] = {}
                }
                if (typeof attribute !== 'undefined') { // updating specific attribute
                    state[0].mapState.polylines[polylineIndex][attribute] = value;
                }
                else {  // or the whole marker at once    
                    state[0].mapState.polylines[polylineIndex] = value;
                }               
            }
        },
        updateMarkerLat: (state, action) => {
            const { markerIndex, newLat } = action.payload;
            state[0].mapState.markers[markerIndex].lat = newLat;
        },

    }

});

export const { newGameMode, newConcept, newMapState, newRound } = quizGameReducer.actions;
export default quizGameReducer.reducer;