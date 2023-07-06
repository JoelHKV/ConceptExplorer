import { createSlice } from '@reduxjs/toolkit';
import { shuffleFisherYates } from '../utilities/numberCruching';
const initialState = [
    {
        roundNro: 0,
        roundTotal: 3,
        points: 0,
        randPainter: 0,
        randPainting: 0,
        gameMode: 'intro',
    }
]

const counterReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        randomChoice: (state, maxIndex) => {
            
            state[0].randPainter = Math.floor(Math.random() * (maxIndex.payload[1] + 1))
            state[0].randPainting = Math.floor(Math.random() * (maxIndex.payload[0] + 1));
        },
        addQuizOptions: (state, maxIndex) => {
            let thesepainters = Array.from({ length: (maxIndex.payload + 1) }, (_, i) => i);
            const correctPainter = state[0].randPainter
            thesepainters = thesepainters.filter(painter => painter !== correctPainter);
            thesepainters = shuffleFisherYates(thesepainters).slice(0, 3)
            thesepainters.push(correctPainter);
            state[0].painterOptions = shuffleFisherYates(thesepainters)

        },
        paintingSliderChoice: (state, newValue) => {
            state[0].randPainting = newValue.payload;
        },
        painterSliderChoice: (state, newValue) => {
            state[0].randPainter = newValue.payload;
        },
        incrementRound: (state) => {
            state[0].roundNro += 1;
        },
        incrementPoint: (state) => {
            state[0].points += 1;
        },
        newGameMode: (state, newValue) => {
            state[0].gameMode = newValue.payload;
        },
        zeroCounter: (state) => {
            state[0].roundNro = 0;
            state[0].points = 0;
        },
    }

});

export const { incrementRound, incrementPoint, zeroCounter, addQuizOptions, randomChoice, paintingSliderChoice, painterSliderChoice, newGameMode } = counterReducer.actions;
export default counterReducer.reducer;