import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAgreementPage() {
    const aptId = '34d08177-e842-4d44-af86-7c2386dda01c';
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [elapsed, setElapsed] = useState('');
    const [aptInfo, setAptInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchApt() {
            try {
                const res = await fetch(
                    `https://j4mc0vpyp2.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}`
                );
                if (!res.ok) throw new Error('Failed to fetch apartment info');
                const data = await res.json();
                setAptInfo(data);
            } catch (err) {
                console.error(err);
                alert('Error loading apartment information');
            }
        }
        fetchApt();
    }, [aptId]);

    const handleSubmit = async e => {
        e.preventDefault();
        const payload = {
            tenant: { name, surname },
            start_at: elapsed,
            apartment: aptInfo.id,
            elapsed_at: elapsed
        };
        try {
            const res = await fetch(
                'https://j4mc0vpyp2.execute-api.eu-north-1.amazonaws.com/test/api/v1/agreements',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }
            );
            if (!res.ok) throw new Error('Failed to create agreement');
            const data = await res.json();
            navigate(`/agreement/${data.agreement_id}`);
        } catch (err) {
            console.error(err);
            alert('Error creating agreement');
        }
    };

    if (!aptInfo) return <div>Loading...</div>;

    const title = `Арендное соглашение с ${aptInfo.landlord.name} ${aptInfo.landlord.surname} по апартаментам ${aptInfo.id}`;

    return (
        <form onSubmit={handleSubmit} style={formStyles}>
            <h2>Create Agreement</h2>
            <p>{title}</p>
            <input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyles}
                required
            />
            <input
                placeholder="Surname"
                value={surname}
                onChange={e => setSurname(e.target.value)}
                style={inputStyles}
                required
            />
            <input
                type="date"
                value={elapsed}
                onChange={e => setElapsed(e.target.value)}
                style={inputStyles}
                required
            />
            <button type="submit" style={buttonStyles}>Submit</button>
        </form>
    );
}

const formStyles = { display: 'flex', flexDirection: 'column', gap: 10, width: 300 };
const inputStyles = { padding: 8, fontSize: 16 };
const buttonStyles = { padding: 10, background: '#4285f4', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' };