import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const baseFont = { fontFamily: '"Open Sans", sans-serif', fontSize: 16, color: '#2B3133' };
const inputStyles = { ...baseFont, padding: 8, border: '1px solid #ccc' };
const buttonStyles = { ...baseFont, padding: 10, background: '#0E6FAA', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' };

export default function ApartmentSelectionPage() {
    const [apartments, setApartments] = useState([]);
    const [selected, setSelected] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'ELIGE UN APARTAMENTO';
    }, []);

    useEffect(() => {
        async function fetchList() {
            try {
                const res = await fetch(
                    'https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments'
                );
                if (!res.ok) throw new Error('Failed to fetch apartments');
                const data = await res.json();
                setApartments(data);
                if (data.length > 0) setSelected(data[0].id);
            } catch (err) {
                console.error(err);
                alert('Error loading apartments');
            }
        }
        fetchList();
    }, []);

    const handleChoose = () => {
        navigate(`/status/${selected}`);
    };

    return (
        <div style={{ ...baseFont, display: 'flex', flexDirection: 'column', gap: 10, width: 300 }}>
            <h2 style={baseFont}>Elige un apartamento</h2>
            <select
                value={selected}
                onChange={e => setSelected(e.target.value)}
                style={inputStyles}
            >
                {apartments.map(apt => (
                    <option key={apt.id} value={apt.id}>{apt.address}</option>
                ))}
            </select>
            <button onClick={handleChoose} style={buttonStyles}>Elegir</button>
        </div>
    );
}