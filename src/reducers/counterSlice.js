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


function shuffleFisherYates(array) {
    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    return shuffledArray;
}



const counterReducer = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        randomChoice: (state, maxIndex) => {
            
            state[0].randpainter = Math.floor(Math.random() * (maxIndex.payload[1] + 1))
            state[0].randpainting = Math.floor(Math.random() * (maxIndex.payload[0] + 1));
        },
        addQuizOptions: (state, maxIndex) => {
            let thesepainters = Array.from({ length: (maxIndex.payload + 1) }, (_, i) => i);
            const correctPainter = state[0].randpainter
            thesepainters = thesepainters.filter(painter => painter !== correctPainter);
            thesepainters = shuffleFisherYates(thesepainters).slice(0, 3)
            thesepainters.push(correctPainter);
            thesepainters = shuffleFisherYates(thesepainters)
            state[0].painterOptions = thesepainters

        },
        horizontalSliderChoice: (state, newValue) => {
            state[0].randpainting = newValue.payload;
        },
        verticalSliderChoice: (state, newValue) => {
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

export const { incrementRound, incrementPoint, zeroCounter, addQuizOptions, randomChoice, horizontalSliderChoice, verticalSliderChoice, modeToggle } = counterReducer.actions;
export default counterReducer.reducer;