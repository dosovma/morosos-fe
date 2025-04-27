import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateAgreementPage from './pages/CreateAgreementPage';
import AgreementPage from './pages/AgreementPage';
import ApartmentStatusPage from './pages/ApartmentStatusPage';

export default function App() {
    return (
        <div style={styles.container}>
            <Routes>
                <Route path="/" element={<CreateAgreementPage />} />
                <Route path="/agreement/:id" element={<AgreementPage />} />
                <Route path="/status" element={<ApartmentStatusPage />} />
            </Routes>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: '"Open Sans", sans-serif',
        padding: 20
    }
};