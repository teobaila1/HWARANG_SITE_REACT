import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TabelPrezenta from '../components/TabelPrezenta';

const IstoricPrezenteCopil = () => {
    const { id } = useParams(); // ID-ul copilului din URL

    return (
        <>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '100%', margin: '0 auto', color: 'white' }}>

                {/* Header cu buton Back */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', borderBottom: '2px solid #d32f2f', paddingBottom: '10px' }}>
                    <h2 style={{ margin: 0 }}>Prezențe Detaliate</h2>
                </div>

                {/* Aici folosim tabelul, dar îi dăm idCopil în loc de idGrupa */}
                <TabelPrezenta idCopil={id} />

            </div>
        </>
    );
};

export default IstoricPrezenteCopil;