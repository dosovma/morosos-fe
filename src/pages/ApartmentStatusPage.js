import React, { useEffect, useState } from 'react';

const baseFont = {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: 16,
    color: '#2B3133'
};

const buttonStyles = {
    ...baseFont,
    padding: 10,
    background: '#0E6FAA',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginBottom: 10
};

function Switch({ checked, disabled = false }) {
    const labelStyle = { position: 'relative', display: 'inline-block', width: 40, height: 20 };
    const inputStyle = { opacity: 0, width: 0, height: 0 };
    const sliderBase = {
        position: 'absolute',
        cursor: 'default',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: disabled ? '#99A7BC' : '#ccc',
        transition: '.4s',
        borderRadius: 20
    };
    const sliderChecked = { backgroundColor: '#0E6FAA' };
    const knobBase = {
        position: 'absolute',
        height: 16,
        width: 16,
        left: 2,
        bottom: 2,
        backgroundColor: 'white',
        transition: '.4s',
        borderRadius: '50%'
    };
    const knobChecked = { transform: 'translateX(20px)' };

    return (
        <label style={labelStyle}>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                style={inputStyle}
            />
            <span style={{ ...sliderBase, ...(checked ? sliderChecked : {}) }}>
        <span style={{ ...knobBase, ...(checked ? knobChecked : {}) }} />
      </span>
        </label>
    );
}

export default function ApartmentStatusPage() {
    const [landlord, setLandlord] = useState(null);
    const [devices, setDevices] = useState([]);
    const aptId = 'e3abab76-6c94-419f-a7de-e97a01af62db';

    const fetchStatus = async () => {
        try {
            const res = await fetch(
                `https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}`
            );
            if (!res.ok) throw new Error('Failed to fetch apartment status');
            const data = await res.json();
            setLandlord(data.landlord);
            setDevices(data.devices || []);
        } catch (err) {
            console.error(err);
            alert('Error loading apartment status');
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [aptId]);

    const handleTurnOn = async () => {
        try {
            const res = await fetch(
                `https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}/statuses`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'apartment_on' })
                }
            );
            if (!res.ok) throw new Error('Failed to turn on apartment');
            await res.json();
            fetchStatus();
        } catch (err) {
            console.error(err);
            alert('Error turning on apartment');
        }
    };

    const handleTurnOff = async () => {
        try {
            const res = await fetch(
                `https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}/statuses`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'apartment_off' })
                }
            );
            if (!res.ok) throw new Error('Failed to turn off apartment');
            await res.json();
            fetchStatus();
        } catch (err) {
            console.error(err);
            alert('Error turning off apartment');
        }
    };

    if (!landlord) return <div style={baseFont}>Cargando...</div>;

    return (
        <div style={{ ...baseFont, width: 300 }}>
            <button onClick={handleTurnOn} style={buttonStyles}>Encender</button>
            <button onClick={handleTurnOff} style={buttonStyles}>Apagar</button>

            <h2 style={baseFont}>Propietario</h2>
            <p>Nombre: {landlord.name}</p>
            <p>Apellido: {landlord.surname}</p>

            <h2 style={baseFont}>Control de electricidad y agua</h2>
            {devices.map(dev => (
                <div key={dev.id} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0' }}>
                    <Switch checked={dev.on} disabled />
                    <span>{dev.name}</span>
                </div>
            ))}
        </div>
    );
}