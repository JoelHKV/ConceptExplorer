import { createSlice } from '@reduxjs/toolkit';
const initialState = [
    {
        gameMode: 'browse',
        concept: 'mind',
        map: null,
    }
]

const quizGameReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {     
        newGameMode: (state, newValue) => {
            state[0].gameMode = newValue.payload;
        },
        newConcept: (state, newValue) => {
            state[0].concept = newValue.payload;
        },
        setMap: (state, action) => {
            state[0].map = action.payload;
        },
    }

});

export const { newGameMode, newConcept, setMap } = quizGameReducer.actions;
export default quizGameReducer.reducer;