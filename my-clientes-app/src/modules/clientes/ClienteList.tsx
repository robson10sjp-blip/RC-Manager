import React, { useEffect, useState } from 'react';
import { getClientes } from './clienteService';

const ClienteList: React.FC = () => {
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await getClientes();
                setClientes(data);
            } catch (error) {
                console.error("Error fetching clientes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Lista de Clientes</h2>
            <ul>
                {clientes.map(cliente => (
                    <li key={cliente.id}>
                        {cliente.nome} - {cliente.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClienteList;