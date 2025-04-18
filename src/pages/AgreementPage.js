import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AgreementPage() {
    const { id } = useParams();
    const [agreement, setAgreement] = useState(null);
    const [autoDetect, setAutoDetect] = useState(false);
    const [signed, setSigned] = useState(false);

    useEffect(() => {
        async function fetchAgreement() {
            try {
                const res = await fetch(
                    `https://j4mc0vpyp2.execute-api.eu-north-1.amazonaws.com/test/api/v1/agreements/${id}`
                );
                if (!res.ok) throw new Error();
                const data = await res.json();
                setAgreement(data);
                setAutoDetect(data.auto_detect_system_enabled || false);
            } catch {
                alert('Error loading agreement');
            }
        }
        fetchAgreement();
    }, [id]);

    const handleSign = async () => {
        try {
            const res = await fetch(
                `https://j4mc0vpyp2.execute-api.eu-north-1.amazonaws.com/test/api/v1/agreements/${id}/status`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'sign' })
                }
            );
            if (!res.ok) throw new Error();
            setSigned(true);
        } catch {
            alert('Error signing agreement');
        }
    };

    if (signed) return <h3>Thank you for cooperation</h3>;
    if (!agreement) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={handleSign} style={buttonStyles}>Sign</button>
            <label>
                <input
                    type="radio"
                    checked={autoDetect === false ? false : true}
                    readOnly
                />
                Turn on automatic detect system
            </label>
        </div>
    );
}

const buttonStyles = { padding: 10, background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' };