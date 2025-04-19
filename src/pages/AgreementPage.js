import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Switch({ checked, onChange, disabled = false }) {
    const labelStyle = { position: 'relative', display: 'inline-block', width: 40, height: 20 };
    const inputStyle = { opacity: 0, width: 0, height: 0 };
    const sliderBase = { position: 'absolute', cursor: disabled ? 'default' : 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ccc', transition: '.4s', borderRadius: 20 };
    const sliderChecked = { backgroundColor: '#4285f4' };
    const knobBase = { position: 'absolute', height: 16, width: 16, left: 2, bottom: 2, backgroundColor: 'white', transition: '.4s', borderRadius: '50%' };
    const knobChecked = { transform: 'translateX(20px)' };

    return (
        <label style={labelStyle}>
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                style={inputStyle}
            />
            <span style={{ ...sliderBase, ...(checked ? sliderChecked : {}) }}>
        <span style={{ ...knobBase, ...(checked ? knobChecked : {}) }} />
      </span>
        </label>
    );
}

export default function AgreementPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [agreement, setAgreement] = useState(null);
    const [autoDetect, setAutoDetect] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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
        if (!autoDetect) {
            setErrorMsg('You have to turn on automation detection');
            return;
        }
        setErrorMsg('');
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
            // After successful sign, refresh page
            navigate(`/agreement/${id}`);
        } catch {
            alert('Error signing agreement');
        }
    };

    if (!agreement) return <div>Loading...</div>;

    const isSigned = agreement.status === 'signed';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 300 }}>
            <button
                onClick={handleSign}
                style={{ ...buttonStyles, background: isSigned ? '#ccc' : '#4285f4', cursor: isSigned ? 'not-allowed' : 'pointer' }}
                disabled={isSigned}
            >
                Sign
            </button>
            <div>
                <Switch
                    checked={autoDetect}
                    onChange={() => setAutoDetect(!autoDetect)}
                    disabled={isSigned}
                />{' '}
                <span>Turn on automatic detect system</span>
            </div>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <div>{agreement.text}</div>
        </div>
    );
}

const buttonStyles = { padding: 10, color: '#fff', border: 'none', width: '100%' };