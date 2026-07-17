import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getCliente, updateCliente } from './clienteService';
import ClienteForm from './ClienteForm';

const ClienteEdit = () => {
    const { id } = useParams();
    const history = useHistory();
    const [cliente, setCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const data = await getCliente(id);
                setCliente(data);
            } catch (err) {
                setError('Erro ao carregar os dados do cliente.');
            } finally {
                setLoading(false);
            }
        };

        fetchCliente();
    }, [id]);

    const handleUpdate = async (updatedData) => {
        try {
            await updateCliente(id, updatedData);
            history.push('/clientes');
        } catch (err) {
            setError('Erro ao atualizar os dados do cliente.');
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Editar Cliente</h2>
            {cliente && (
                <ClienteForm initialData={cliente} onSubmit={handleUpdate} />
            )}
        </div>
    );
};

export default ClienteEdit;