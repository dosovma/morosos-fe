import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const baseFont = { fontFamily: '"Open Sans", sans-serif', fontSize: 16, color: '#2B3133' };
const formStyles = { ...baseFont, display: 'flex', flexDirection: 'column', gap: 10, width: 300 };
const inputStyles = { ...baseFont, padding: 8, border: '1px solid #ccc' };
const buttonStyles = { ...baseFont, padding: 10, background: '#0E6FAA', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' };

export default function CreateAgreementPage() {
    useEffect(() => { document.title = 'CONTRATO'; }, []);
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const aptId = params.get('aptId');
    const [aptInfo, setAptInfo] = useState(null);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        async function fetchApt() {
            try {
                const res = await fetch(`https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}`);
                if (!res.ok) throw new Error();
                setAptInfo(await res.json());
            } catch {
                alert('Error loading apartment information');
            }
        }
        if (aptId) fetchApt();
    }, [aptId]);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch(
                `https://gtw06or8tl.execute-api.eu-north-1.amazonaws.com/test/api/v1/apartments/${aptId}/agreements`,
                { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant: { name, surname }, elapsed_at: elapsed }) }
            );
            if (!res.ok) throw new Error();
            navigate(`/agreement/${(await res.json()).agreement_id}`);
        } catch {
            alert('Error creating agreement');
        }
    };

    if (!aptInfo) return <div style={baseFont}>Cargando...</div>;
    const title = `Acuerdo adicional al contrato de arrendamiento de apartamento, casa u otra vivienda, ubicada en ${aptInfo.address}`;

    return (
        <form onSubmit={handleSubmit} style={formStyles}>
            <p style={baseFont}>{title}</p>
            <h2 style={baseFont}>Por favor, introduzca sus datos para firmar el acuerdo:</h2>
            <label style={baseFont}>Nombre</label>
            <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} style={inputStyles} required />
            <label style={baseFont}>Apellido</label>
            <input placeholder="Apellido" value={surname} onChange={e => setSurname(e.target.value)} style={inputStyles} required />
            <label style={baseFont}>Fecha de finalización del contrato</label>
            <input type="datetime-local" value={elapsed} onChange={e => setElapsed(e.target.value)} style={inputStyles} required />
            <p style={{ fontFamily: '"Open Sans", sans-serif', fontSize: 12, color: '#2B3133', marginTop: 4 }}>
                Esta es la fecha en la que finaliza su estancia y se activará la desconexión automática de los servicios
            </p>
            <button type="submit" style={buttonStyles}>Enviar</button>
        </form>
    );
}