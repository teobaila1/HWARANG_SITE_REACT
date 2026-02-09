import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TabelPrezenta from '../components/TabelPrezenta';

const PaginaPrezenta = () => {
    const { id } = useParams(); // Luăm ID-ul grupei din URL
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '98%', margin: '0 auto', color: 'white' }}>

                <h2 style={{ borderBottom: '2px solid #d32f2f', paddingBottom: '10px', marginBottom: '20px' }}>
                    Situație Prezențe
                </h2>

                {/* Aici Tabelul are loc să respire */}
                <TabelPrezenta idGrupa={id} />

            </div>
        </>
    );
};

export default PaginaPrezenta;