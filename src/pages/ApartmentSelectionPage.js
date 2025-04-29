import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const baseFont = { fontFamily: '"Open Sans", sans-serif', fontSize: 16, color: '#2B3133' };
const inputStyles = { ...baseFont, padding: 8, border: '1px solid #ccc' };
const buttonStyles = { ...baseFont, padding: 10, background: '#0E6FAA', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' };

export default function ApartmentSelectionPage() {
    useEffect(() => { document.title = 'ELIGE UN APARTAMENTO'; }, []);
    const [apartments, setApartments] = useState([]);
    const [selected, setSelected] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchList() {
            try {
                const res = await fetch('https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments');
                if (!res.ok) throw new Error('Failed to fetch apartments');
                const data = await res.json();
                const list = data.apartments || [];
                setApartments(list);
                if (list.length > 0) setSelected(list[0].id);
            } catch {
                alert('Error loading apartments');
            }
        }
        fetchList();
    }, []);

    const handleChoose = () => {
        if (selected) navigate(`/apartment/${selected}`);
    };

    return (
        <div style={{ ...baseFont, display: 'flex', flexDirection: 'column', gap: 10, width: 300 }}>
            <p style={{ ...baseFont, fontWeight: 'bold' }}>¡Hola! Por favor seleccione un apartamento de la lista:</p>
            <select value={selected} onChange={e => setSelected(e.target.value)} style={inputStyles}>
                {apartments.map(apt => (
                    <option key={apt.id} value={apt.id}>{apt.address}</option>
                ))}
            </select>
            <button onClick={handleChoose} style={buttonStyles}>Elegir</button>
        </div>
    );
}