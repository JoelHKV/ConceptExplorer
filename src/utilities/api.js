import axios from 'axios';

const api = axios.create({
    baseURL: 'https://europe-north1-koira-363317.cloudfunctions.net/readConceptsFireStore', // Replace with your API base URL
    // You can set other axios configurations here, such as headers, interceptors, etc.
});

export default api;
