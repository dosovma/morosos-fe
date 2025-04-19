import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAgreementPage() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [elapsed, setElapsed] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        const payload = {
            tenant: { name, surname },
            start_at: elapsed,
            apartment: '65c87ef1-5917-47cb-9e97-235d257bae06',
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

    return (
        <form onSubmit={handleSubmit} style={formStyles}>
            <h2>Create Agreement</h2>
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
const buttonStyles = { padding: 10, background: '#4285f4', color: '#fff', border: 'none', cursor: 'pointer' };