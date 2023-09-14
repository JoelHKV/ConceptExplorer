import { createSlice } from '@reduxjs/toolkit';

 
//const markerDiameterPerZoom = [0.1, 0.1, 0.11, 0.12, 0.13, 0.15, 0.17, 0.19, 0.22, 0.26, 0.31, 0.37, 0.45, 0.45, 0.45, 0.45, 0.45];
const initialState = [
    {
        gameMode: 'globe',
        zoomGlobal: true,
        googleMapDimensions: { width: 756, height: 534 },
        browseView: { zoom: 7 },
        globalView: { lat: 0, lng: 0, zoom: 2 },
        viewThreshold: 6,
    //    markerDiameterPerZoom: markerDiameterPerZoom,
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
        newZoomGlobal: (state, action) => {
            return [
                {
                    ...state[0],
                    zoomGlobal: action.payload
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

export const { newGameMode, newMapDimensions, newMapLocation, newZoomGlobal,    newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } = conceptExplorerReducer.actions;
export default conceptExplorerReducer.reducer;