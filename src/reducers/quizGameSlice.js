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
   
}



const initialState = [
    {
        round: 0,
        gameMode: 'browse3',
        concept: 'mind',
        markerState: initMarkerData,
        polylineState: initPolylineData,
        mapLocation: initMapLocation, 
    }
]

const quizGameReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {     

        newGameMode: (state, action) => {
            return [
                {
                    ...state[0],
                    gameMode: action.payload
                },
                ...state.slice(1) // Copy the rest of the state array
            ];
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
        deleteMarkerState: (state, action) => {
            const { markerName } = action.payload;
            if (markerName==='ALL') {
                return state.map(item => ({
                    ...item,
                    markerState: {}
                }))
            }
            else {          
                return state.map(item => ({
                    ...item,
                    markerState: Object.keys(item.markerState).reduce((acc, key) => {
                        if (key !== markerName) {
                            acc[key] = item.markerState[key];
                        }
                        return acc;
                    }, {})
                }));
            };
        },
        newMarkerState: (state, action) => { 
            const { markerName, updatedData } = action.payload;      
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

        deletePolylineState: (state, action) => {
            const { polylineName } = action.payload;
            if (polylineName === 'ALL') {
                return state.map(item => ({
                    ...item,
                    polylineState: {}
                }));
            }
            else {
                return state.map(item => ({
                    ...item,
                    polylineState: Object.keys(item.polylineState).reduce((acc, key) => {
                        if (key !== polylineName) {
                            acc[key] = item.polylineState[key];
                        }
                        return acc;
                    }, {})
                }));
            };
        },

        newPolylineState: (state, action) => {
            const { polylineName, updatedData } = action.payload;         
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
        
    }

});

export const { newGameMode, newConcept, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState, newRound } = quizGameReducer.actions;
export default quizGameReducer.reducer;