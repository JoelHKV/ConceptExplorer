import React from 'react';
import { Box } from '@mui/material';
import { VictoryChart, VictoryBar, VictoryTheme } from 'victory';



import './BarChartArray.css';


const BarChart = ({ data }) => (
    <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [0, 1] }}
        domainPadding={{ x: [50, 0] }}
        horizontal
    >
        <VictoryBar data={data}
            barWidth={20}  // Adjust the bar width as desired
            barRatio={1} // Adjust the spacing between bars


        />
    </VictoryChart>
);


const BarChartArray = ({ data }) => (
    <Box className='BarChartArray'>
        {data.map((dataset, index) => (
            <BarChart key={index} data={dataset} />
        ))}
    </Box>
);

export default BarChartArray;