import axios from 'axios';
import { useState, useEffect} from 'react';



export const getConceptDetails = (queryParam) => {
    const [conceptDetails, setConceptDetails] = useState([]);
 
    const [loaded, setLoaded] = useState(false);  
    const [error, setError] = useState(null);

    const url = 'https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore?concept_name=';
  
    const fetchData = () => { 
        
        axios
            .get(url + queryParam)
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

