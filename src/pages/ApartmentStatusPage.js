import React, { useEffect, useState } from 'react';

const baseFont = { fontFamily:'"Open Sans",sans-serif', fontSize:16, color:'#2B3133' };
const buttonStyles = { ...baseFont, padding:10, background:'#0E6FAA', color:'#fff', border:'none', cursor:'pointer',width:'100%', marginTop:10 };

function Switch({ checked, disabled=false }) {
    const sliderBase = {position:'absolute',cursor:'default',top:0,left:0,right:0,bottom:0,backgroundColor:disabled?'#99A7BC':'#ccc',transition:'.4s',borderRadius:20};
    const sliderChecked={backgroundColor:'#0E6FAA'};
    const knob={position:'absolute',height:16,width:16,left:2,bottom:2,backgroundColor:'white',transition:'.4s',borderRadius:'50%'};
    return (
        <label style={{position:'relative',display:'inline-block',width:40,height:20}}>
            <input type="checkbox" checked={checked} disabled style={{opacity:0,width:0,height:0}}/>
            <span style={{...sliderBase, ...(checked?sliderChecked:{})}}><span style={{...knob, ...(checked?{transform:'translateX(20px)'}:{})}}/></span>
        </label>
    );
}

export default function ApartmentStatusPage() {
    useEffect(() => { document.title='PRIVADO'; }, []);
    const [aptInfo, setAptInfo] = useState(null);
    const [devices, setDevices] = useState([]);
    const aptId = 'e3abab76-6c94-419f-a7de-e97a01af62db';

    const fetchStatus = async () => {
        try {
            const res = await fetch(`https://.../apartments/${aptId}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setAptInfo(data);
            setDevices(data.devices||[]);
        } catch { alert('Error loading apartment status'); }
    };
    useEffect(() => { fetchStatus(); }, [aptId]);

    const handleTurnOn = async () => {
        try {
            const res = await fetch(`https://.../statuses`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'apartment_on'})});
            if (!res.ok) throw new Error();
            fetchStatus();
        } catch { alert('Error turning on apartment'); }
    };
    const handleTurnOff = async () => {
        try {
            const res = await fetch(`https://.../statuses`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'apartment_off'})});
            if (!res.ok) throw new Error();
            fetchStatus();
        } catch { alert('Error turning off apartment'); }
    };

    if (!aptInfo) return <div style={baseFont}>Cargando...</div>;
    return (
        <div style={{...baseFont,width:300}}>
            <h2 style={baseFont}>Propietario</h2>
            <p style={baseFont}>Nombre: {aptInfo.landlord.name}</p>
            <p style={baseFont}>Apellido: {aptInfo.landlord.surname}</p>

            <h2 style={baseFont}>Control de electricidad y agua</h2>
            <p style={{...baseFont,fontSize:12,marginTop:4}}>Estado actual de los servicios</p>
            {devices.map(dev=>(
                <div key={dev.id} style={{display:'flex',alignItems:'center',gap:8,margin:'5px 0'}}>
                    <Switch checked={dev.on} disabled/><span>{dev.name}</span>
                </div>
            ))}

            <button onClick={handleTurnOn} style={buttonStyles}>Encender</button>
            <button onClick={handleTurnOff} style={buttonStyles}>Apagar</button>
        </div>
    );
}
