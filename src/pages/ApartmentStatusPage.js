import React, { useEffect, useState } from 'react';

function Switch({ checked, disabled = false }) {
    const labelStyle = { position: 'relative', display: 'inline-block', width: 40, height: 20 };
    const inputStyle = { opacity: 0, width: 0, height: 0 };
    const sliderBase = { position: 'absolute', cursor: 'default', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', transition: '.4s', borderRadius: 20 };
    const sliderChecked = { backgroundColor: '#4285f4' };
    const knobBase = { position: 'absolute', height: 16, width: 16, left: 2, bottom: 2, backgroundColor: 'white', transition: '.4s', borderRadius: '50%' };
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

const buttonStyles = { padding: 10, background: '#4285f4', color: '#fff', border: 'none', cursor: 'pointer', width: '100%', marginBottom: 10 };
export default function ApartmentStatusPage() {
    const [landlord, setLandlord] = useState(null);
    const [devices, setDevices] = useState([]);
    const aptId = '34d08177-e842-4d44-af86-7c2386dda01c';

    const fetchStatus = async () => {
        try {
            const res = await fetch(
                `https://j4mc0vpyp2.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}`
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
                `https://j4mc0vpyp2.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}/status`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'apartment_off' })
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
                `https://j4mc0vpyp2.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}/status`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'apartment_on' })
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

    if (!landlord) return <div>Loading...</div>;

    return (
        <div style={{ width: 300 }}>
            <button onClick={handleTurnOn} style={buttonStyles}>TurnOn</button>
            <button onClick={handleTurnOff} style={buttonStyles}>TurnOff</button>

            <h2>Landlord</h2>
            <p>Name: {landlord.name}</p>
            <p>Surname: {landlord.surname}</p>

            <h2>Devices</h2>
            {devices.map(dev => (
                <div key={dev.id} style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '5px 0' }}>
                    <Switch checked={dev.on} disabled />
                    <span>{dev.name}</span>
                </div>
            ))}
        </div>
    );
}
