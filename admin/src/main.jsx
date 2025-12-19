import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { BrowserRouter, Router, Route } from 'react-router-dom';
import DoctorContextProvider from './context/DoctorContext';
import AdminContextProvider from './context/AdminContext';
import AppContextProvider from './context/AppContext';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AdminContextProvider>
                <DoctorContextProvider>
                    <AppContextProvider>
                        <App></App>
                    </AppContextProvider>
                </DoctorContextProvider>
            </AdminContextProvider>
            <ToastContainer></ToastContainer>
        </BrowserRouter>
    </StrictMode>,
);
