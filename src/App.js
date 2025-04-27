import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateAgreementPage from './pages/CreateAgreementPage';
import AgreementPage from './pages/AgreementPage';
import ApartmentStatusPage from './pages/ApartmentStatusPage';
import ApartmentSelectionPage from './pages/ApartmentSelectionPage';

export default function App() {
    return (
        <div style={{ fontFamily: '"Open Sans", sans-serif', padding: 20 }}>
            <Routes>
                <Route path="/" element={<ApartmentSelectionPage />} />
                <Route path="/agreement/:id" element={<AgreementPage />} />
                <Route path="/apartment/:aptId" element={<ApartmentStatusPage />} />
                <Route path="/agreement" element={<CreateAgreementPage />} />
            </Routes>
        </div>
    );
}
