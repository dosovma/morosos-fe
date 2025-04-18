import React, { useEffect, useState } from 'react';

export default function ApartmentStatusPage() {
    const [landlord, setLandlord] = useState(null);
    const [devices, setDevices] = useState([]);
    const aptId = '227a77a3-ee4a-4b5e-b170-cb56e6c829c7';

    useEffect(() => {
        async function fetchStatus() {
            try {
                const res = await fetch(
                    `https://j4mc0vpyp2.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}`
                );
                if (!res.ok) throw new Error();
                const data = await res.json();
                setLandlord(data.landlord);
                setDevices(data.devices || []);
            } catch {
                alert('Error loading apartment status');
            }
        }
        fetchStatus();
    }, []);

    if (!landlord) return <div>Loading...</div>;

    return (
        <div>
            <h2>Landlord</h2>
            <p>Name: {landlord.name}</p>
            <p>Surname: {landlord.surname}</p>

            <h2>Devices</h2>
            {devices.map(dev => (
                <label key={dev.id} style={{ display: 'block', margin: '5px 0' }}>
                    <input
                        type="radio"
                        checked={dev.status === 'on'}
                        readOnly
                    />
                    {dev.name}
                </label>
            ))}
        </div>
    );
}