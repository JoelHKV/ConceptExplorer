import { createSlice } from '@reduxjs/toolkit';
import { drawCircleCanvas2ReturnDataURL } from '../utilities/drawCircleCanvas2ReturnDataURL';

const diameter=90

const initMapLocation = {
    lat: 27.7749, // Default latitude  
    lng: -112.4194, // Default longitude  
    // zoom: 7, // Default zoom level
    delta: 2,
}



const initMarkerData = {
    "Marker0": {
        lat: 27.7749,
        lng: -112.4194,
        title: "MIND",
        param: "mind",
        timestamp: 23232,
        diameter: diameter,
        dataURL: drawCircleCanvas2ReturnDataURL(diameter, 'MIND', 2.9),
    },

 

}

const initPolylineData = {
    "Polyline0": {
        lat: [27.7749, 28.7749],
        lng: [-112.4194, -113.4194],
    color: '#333333',
},
    "Polyline1": {
        lat: [27.7749, 28.7749],
        lng: [-111.4194, -111.4194],
        color: '#333333',
    }
}

const initMapData = {
    
    markers: [ ],
    polylines: [ ],

};




const initialState = [
    {
        round: 0,
        gameMode: 'browse2',
        concept: 'mind',
        mapState: initMapData,
        markerState: initMarkerData,
        polylineState: initPolylineData,
        mapLocation: initMapLocation, 
    }
]

const quizGameReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {     
        newRound: (state, newValue) => {
            state[0].round = state[0].round + newValue.payload;
        },
        newGameMode: (state, action) => {
            return [
                {
                    ...state[0],
                    gameMode: action.payload
                },
                ...state.slice(1) // Copy the rest of the state array
            ];
        },
        newConcept: (state, newValue) => {
            state[0].concept = newValue.payload;
        },


        newMapLocation: (state, action) => {
            const { attribute, dall, value } = action.payload;
            const newState = [...state];

            if (typeof dall !== 'undefined') {
                newState[0] = {
                    ...newState[0],
                    mapLocation: value
                };
            } else {
                newState[0] = {
                    ...newState[0],
                    mapLocation: {
                        ...newState[0].mapLocation,
                        [attribute]: value
                    }
                };
            }

            return newState;
            

        },
        newMarkerState: (state, action) => {      
            const { markerName, updatedData } = action.payload;

            if (markerName === 'ALL' && updatedData.delete) {
                return state.map(item => ({
                    ...item,
                    markerState: {}
                }));
                 
            }
            if (markerName !== 'ALL' && updatedData.delete) {
                console.log('go here')
                return state.map(item => ({
                    ...item,
                    markerState: Object.keys(item.markerState).reduce((acc, key) => {
                        if (key !== markerName) {
                            acc[key] = item.markerState[key];
                        }
                        return acc;
                    }, {})
                }));
            }


            updatedData.timestamp=Date.now()
            return state.map(item => ({
                ...item,
                markerState: {
                    ...item.markerState,
                    [markerName]: {
                        ...item.markerState[markerName],
                        ...updatedData
                    }
                }
            }));           
        },

        newPolylineState: (state, action) => {
            const { polylineName, updatedData } = action.payload;

            if (polylineName === 'ALL' && updatedData.delete) {
                return state.map(item => ({
                    ...item,
                    polylineState: {}
                }));
            }

            if (polylineName !== 'ALL' && updatedData.delete) {
                console.log('go here')
                return state.map(item => ({
                    ...item,
                    polylineState: Object.keys(item.polylineState).reduce((acc, key) => {
                        if (key !== polylineName) {
                            acc[key] = item.polylineState[key];
                        }
                        return acc;
                    }, {})
                }));
            }

            updatedData.timestamp = Date.now();
            return state.map(item => ({
                ...item,
                polylineState: {
                    ...item.polylineState,
                    [polylineName]: {
                        ...item.polylineState[polylineName],
                        ...updatedData
                    }
                }
            }));
        },
 







        newMapState: (state, action) => {
            const { attribute, dall, value, markerIndex, polylineIndex } = action.payload;
            if (typeof dall !== 'undefined') {
                 
                state[0].mapState = value;

                
                    
            


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

export const { newGameMode, newConcept, newMapState, newMapLocation, newMarkerState, newPolylineState, newRound } = quizGameReducer.actions;
export default quizGameReducer.reducer;