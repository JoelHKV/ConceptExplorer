import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';



export const getConcept = (thisURL, thisURL2) => {
    const [concepts, setConcepts] = useState([]);
    const [globeConcepts, setGlobeConcepts] = useState([]);


    const [conceptRank, setConceptRank] = useState()

    const [load1, setLoad1] = useState(false);
    const [load2, setLoad2] = useState(false);  
    const [error, setError] = useState(null);

    //let latLngData2;


    
    const fetchData = () => { 

  
        axios
            .get(thisURL)
            .then(response => {
                setConcepts(response.data)
                const tempGlobalConcepts = Object.keys(response.data).slice(0, 20);
                

                setGlobeConcepts(tempGlobalConcepts)
                setLoad1(true)

            })
            .catch(error => {
                setError('1st error: ' + error);
            })
            .finally(() => {
                
            });
        axios
            .get(thisURL2)
            .then(response => {
                setConceptRank(response.data)
                setLoad2(true)
 
            })
            .catch(error => {
                setError('2nd error: ' + error);
            })
            .finally(() => {
                
            });


    }



    useEffect(() => {
        fetchData()
    }, [])

    const latLngData = useMemo(() => {
        const newLat = [];
        const newLng = [];

        for (let i = 0; i < globeConcepts.length; i++) {
            newLat.push(Math.random() * 140 - 70);
            newLng.push(Math.random() * 360 - 180);
        }

        return { lat: newLat, lng: newLng };
    }, [globeConcepts]);




    const loaded = load1 && load2;

    return { concepts, conceptRank, globeConcepts, latLngData, loaded, error }


};

