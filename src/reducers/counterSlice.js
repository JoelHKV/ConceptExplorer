import { createSlice } from '@reduxjs/toolkit';

const initialState = [
    {
        itemnro: 0,
        points: 0,
        randpainter: 0,
        randpainting: 0,
        playmode: 'intro',
        rounds: 3,
    }

]

const painter_count = 10
const painting_count = 20


const counterReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        randomChoice: (state) => {       
            state[0].randpainter = Math.floor(Math.random() * painter_count)
            state[0].randpainting = Math.floor(Math.random() * painting_count);
        },
        xSliderChoice: (state, newValue) => {
            state[0].randpainting = newValue.payload;
        },
        ySliderChoice: (state, newValue) => {
            state[0].randpainter = newValue.payload;
        },
        incrementRound: (state) => {
            state[0].itemnro += 1;
        },
        incrementPoint: (state) => {
            state[0].points += 1;
        },
        modeToggle: (state, newValue) => {
           // state[0].playmode = 'practice'; // newValue.payload;
            console.log(newValue.payload)
            state[0].playmode = newValue.payload;

        },
        zeroCounter: (state) => {
            state[0].itemnro = 0;
            state[0].points = 0;
        },
    }

});

export const { incrementRound, incrementPoint, zeroCounter, randomChoice, xSliderChoice, ySliderChoice, modeToggle } = counterReducer.actions;
export default counterReducer.reducer;