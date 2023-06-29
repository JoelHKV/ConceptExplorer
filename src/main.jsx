
import React from 'react';
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './reducers/counterSlice';
import App from './App';

const store = configureStore({
    reducer: {
        counter: counterReducer,
    }
});

 

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
);



