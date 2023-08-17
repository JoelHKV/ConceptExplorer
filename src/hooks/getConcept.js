import axios from 'axios';
import { useState, useEffect } from 'react';



export const getConcept = (thisURL, thisURL2) => {
    const [concepts, setConcepts] = useState([]);
    const [conceptRank, setConceptRank] = useState()

    const [load1, setLoad1] = useState(false);
    const [load2, setLoad2] = useState(false);  
    const [error, setError] = useState(null);
    
    const fetchData = () => { 

  
        axios
            .get(thisURL)
            .then(response => {
                setConcepts(response.data)
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

    const loaded = load1 && load2;

    return { concepts, conceptRank, loaded, error }


};

