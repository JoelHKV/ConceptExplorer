import React from 'react';
import Button from '@mui/material/Button';

const TitleBar = ({ clickInfo, gameMode }) => {

    const styles = `
    .banner {
        display: grid;
        width: 100%;
        grid-column: 1 / 13;
        grid-row: 1;
        background-color: #ffddff;
        height: 130%;
        
    }
    .title {
        display: grid;
        width: 100%;
        grid-column: 1 / 13;
        grid-row: 1;
        font-weight: 900;
        font-size: clamp(14px, 6vw, 40px);
        margin: auto;
        padding-top: 1vh;
    }
    
    .back_button {
        grid-column: 1;
        grid-row: 1;
        margin: auto;
        padding-top: 1vh;
        padding-left: 2vw;
    }
    
    .info_button {
        grid-column: 12;
        grid-row: 1;
        margin: auto;
        padding-top: 1vh;
        padding-right: 2vw;
    }
    .title, .back_button, .info_button, .back_button button, .info_button button {
        background-color: transparent;

    }

    .back_button button, .info_button button {
        color: black;
        height: clamp(14px, 6vw, 40px);
        padding: 10px;
        border: 0.1rem solid black;
        min-width: 4px;
        width: clamp(14px, 6vw, 40px);
    }

    .back_button button:hover, .info_button button:hover {
        background-color: #ff88ff; /* Set your desired background color on hover */
    }



  `;

    return (
        <>
            <div className="banner"></div>
            <div className="title">Gallery Galore</div>
            <div className="back_button">
                <Button
                variant="contained"
                    color="primary"
                    onClick={() => clickInfo()}

                >
                    B
                </Button>
            </div>
            <div className="info_button">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => clickInfo()}
                >
                    ?
                </Button>
            </div>
            <style>{styles}</style>
        </>
    );
};

export default TitleBar;