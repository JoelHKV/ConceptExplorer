import { createSlice } from '@reduxjs/toolkit';
const initialState = [
    {
        gameMode: 'intro',
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
        setMap: (state, action) => {
            state[0].map = action.payload;
        },
    }

});

export const { newGameMode, setMap } = quizGameReducer.actions;
export default quizGameReducer.reducer;