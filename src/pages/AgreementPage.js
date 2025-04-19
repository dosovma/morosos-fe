import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

// Simple switch/toggle component
function Switch({checked}) {
    const labelStyle = {
        position: 'relative',
        display: 'inline-block',
        width: 40,
        height: 20,
    };
    const inputStyle = {
        opacity: 0,
        width: 0,
        height: 0,
    };
    const sliderBase = {
        position: 'absolute',
        cursor: 'default',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#ccc',
        transition: '.4s',
        borderRadius: 20,
    };
    const sliderChecked = {
        backgroundColor: '#4285f4',
    };
    const knobBase = {
        position: 'absolute',
        height: 16,
        width: 16,
        left: 2,
        bottom: 2,
        backgroundColor: 'white',
        transition: '.4s',
        borderRadius: '50%',
    };
    const knobChecked = {
        transform: 'translateX(20px)',
    };

    return (
        <label style={labelStyle}>
            <input type="checkbox" checked={checked} disabled style={inputStyle}/>
            <span style={{
                ...sliderBase,
                ...(checked ? sliderChecked : {}),
            }}>
        <span style={{
            ...knobBase,
            ...(checked ? knobChecked : {}),
        }}/>
      </span>
        </label>
    );
}

export default function AgreementPage() {
    const {id} = useParams();
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
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({action: 'sign'})
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
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <button onClick={handleSign} style={buttonStyles}>Sign</button>
            <div>
                <Switch checked={autoDetect}/>{' '}
                <span>Turn on automatic detect system</span>
            </div>
        </div>
    );
}

const buttonStyles = {padding: 10, background: '#4285f4', color: '#fff', border: 'none', cursor: 'pointer'};