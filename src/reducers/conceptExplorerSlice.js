import { createSlice } from '@reduxjs/toolkit';


const googlemapMarkerSizes = {
    small: 0.11,
    medium: 0.15,
    large: 0.2,
}


const initialState = [
    {
        gameMode: 'globe',
        zoomTracker: [2, 2], // keeps track of last two zoom levels for various purposes
        googleMapDimensions: { width: 756, height: 534 },
        googlemapMarkerSizes: googlemapMarkerSizes,
        browseView: { zoom: 7 },
        globalView: { lat: 0, lng: 0, zoom: 2 },
        viewThreshold: 4,
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
        newZoomTracker: (state, action) => {
            return [
                {
                    ...state[0],
                    zoomTracker: action.payload
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

export const { newGameMode, newMapDimensions, newMapLocation, newZoomTracker,    newMarkerState, deleteMarkerState, newPolylineState, deletePolylineState } = conceptExplorerReducer.actions;
export default conceptExplorerReducer.reducer;