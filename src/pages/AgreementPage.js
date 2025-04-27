import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
    width: '100%'
};

function Switch({ checked, onChange, disabled = false }) {
    const labelStyle = { position: 'relative', display: 'inline-block', width: 40, height: 20 };
    const inputStyle = { opacity: 0, width: 0, height: 0 };
    const sliderBase = {
        position: 'absolute',
        cursor: disabled ? 'default' : 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: disabled ? '#99A7BC' : '#ccc',
        transition: '.4s',
        borderRadius: 20
    };
    const sliderChecked = checked ? { backgroundColor: disabled ? '#99A7BC' : '#0E6FAA' } : {};
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
                onChange={onChange}
                style={inputStyle}
            />
            <span style={{ ...sliderBase, ...sliderChecked }}>
        <span style={{ ...knobBase, ...(checked ? knobChecked : {}) }} />
      </span>
        </label>
    );
}

export default function AgreementPage() {
    const { id } = useParams();
    const [agreement, setAgreement] = useState(null);
    const [autoDetect, setAutoDetect] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const aptId = 'e3abab76-6c94-419f-a7de-e97a01af62db';

    const fetchAgreement = async () => {
        try {
            const res = await fetch(
                `https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}/agreements/${id}`
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            setAgreement(data);
            setAutoDetect(data.auto_detect_system_enabled || false);
        } catch {
            alert('Error loading agreement');
        }
    };

    useEffect(() => {
        if (agreement) {
            document.title = `Acuerdo adicional al contrato de arrendamiento: ${agreement.address}`;
        }
    }, [agreement]);

    useEffect(() => {
        fetchAgreement();
    }, [id]);

    const handleSign = async () => {
        if (!autoDetect) {
            setErrorMsg('Debes activar la desconexión automática');
            return;
        }
        setErrorMsg('');
        try {
            const res = await fetch(
                `https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}/agreements/${id}/statuses`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'sign' })
                }
            );
            if (!res.ok) throw new Error();
            await res.json();
            fetchAgreement();
        } catch {
            alert('Error signing agreement');
        }
    };

    if (!agreement) return <div style={baseFont}>Cargando...</div>;

    const isSigned = agreement.status === 'signed';

    return (
        <div style={{ ...baseFont, display: 'flex', flexDirection: 'column', gap: 10, width: 300 }}>
            <div dangerouslySetInnerHTML={{ __html: agreement.text }} />
            <div>
                <Switch
                    checked={autoDetect}
                    onChange={() => setAutoDetect(!autoDetect)}
                    disabled={isSigned}
                />{' '}
                <span style={baseFont}>Activar sistema de desconexión automática.</span>
            </div>
            {errorMsg && <p style={{ color: '#50BCDA' }}>{errorMsg}</p>}
            <button
                onClick={handleSign}
                style={{ ...buttonStyles, background: isSigned ? '#99A7BC' : '#0E6FAA', cursor: isSigned ? 'not-allowed' : 'pointer' }}
                disabled={isSigned}
            >
                Firmar
            </button>
        </div>
    );
}