import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';



export const fetchAllConcepts = (thisURL) => {
    const [concepts, setConcepts] = useState([]);
    const [globalData, setGlobalData] = useState([]);

    const [load1, setLoad1] = useState(false);  
    const [error, setError] = useState(null);

    const fetchData = () => { 
 
        axios
            .get(thisURL)
            .then(response => {
                setConcepts(response.data)             
                getConceptEntryPoints(response.data)
                setLoad1(true)   

            })
            .catch(error => {
                setError('1st error: ' + error);
            })
            .finally(() => {
                
            });

    }


    useEffect(() => {
        fetchData()
    }, [])


    const getConceptEntryPoints = (data) => {
        const uniqueBranches = new Set();
        const keykey = Object.keys(data);
        keykey.forEach(entry => {
                uniqueBranches.add(data[entry]['branch']);
        });
        const globeEntries = [...uniqueBranches]


        const newLat = [];
        const newLng = [];

        for (let i = 0; i < globeEntries.length; i++) {
            newLat.push(Math.random() * 140 - 70);
            newLng.push(Math.random() * 360 - 180);
        }

        const thisGlobalData = { branch: globeEntries, lat: newLat, lng: newLng }
        setGlobalData(thisGlobalData)
  
          
}

    const loaded = load1;

    return { concepts, globalData, loaded, error }


};

