import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import CreateAgreementPage from './pages/CreateAgreementPage';
import AgreementPage from './pages/AgreementPage';
import ApartmentStatusPage from './pages/ApartmentStatusPage';

function App() {
    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <NavLink to="/" style={styles.link}>Create Agreement</NavLink>
                <NavLink to="/status" style={styles.link}>Apartment Status</NavLink>
            </nav>
            <Routes>
                <Route path="/" element={<CreateAgreementPage />} />
                <Route path="/agreement/:id" element={<AgreementPage />} />
                <Route path="/status" element={<ApartmentStatusPage />} />
            </Routes>
        </div>
    );
}

const styles = {
    container: { fontFamily: 'sans-serif', padding: 20 },
    nav: { marginBottom: 20, display: 'flex', gap: 10 },
    link: { textDecoration: 'none', color: '#4285f4' }
};

export default App;