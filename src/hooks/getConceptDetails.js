import axios from 'axios';
import { useState, useEffect} from 'react';



export const getConceptDetails = (cloudFunctionURL, queryParam) => {
    const [conceptDetails, setConceptDetails] = useState([]);
 
    const [loaded, setLoaded] = useState(false);  
    const [error, setError] = useState(null);

    const fetchData = () => { 
        
        axios
            .get(cloudFunctionURL + '?concept_name=' + queryParam)
            .then(response => {
                setConceptDetails(response.data)
                setLoaded(true)

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

   


    return { conceptDetails, loaded, error }


};

