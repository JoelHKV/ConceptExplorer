import { createSlice } from '@reduxjs/toolkit';
const initialState = [
    {
        gameMode: 'intro',
    }
]

const quizGameReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {     
        newGameMode: (state, newValue) => {
            state[0].gameMode = newValue.payload;
        },
    }

});

export const { newGameMode } = quizGameReducer.actions;
export default quizGameReducer.reducer;