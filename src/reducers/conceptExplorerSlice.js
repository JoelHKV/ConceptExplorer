import { createSlice } from '@reduxjs/toolkit';


const markerDiameterPerZoom = [50, 50, 60, 70, 80, 90, 100, 120, 140, 180, 260, 360, 460, 460, 460, 460, 460];

const initialState = [
    {
        gameMode: 'globe',
        googleMapDimensions: { width: 756, height: 534 },
        browseZoomLevel: 7,
        singleConceptZoomLevel: 6,
        globalConceptZoomLevel: 2,
        markerDiameterPerZoom: markerDiameterPerZoom,
        markerState: {},
        polylineState: {},
        mapLocation: {},
    }
]

const conceptExplorerReducer = createSlice({
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
  
        newMapDimensions: (state, action) => {
            return [
                {
                    ...state[0],
                    googleMapDimensions: action.payload
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

export const { newGameMode, newMapDimensions, newMapLocation, newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } = conceptExplorerReducer.actions;
export default conceptExplorerReducer.reducer;