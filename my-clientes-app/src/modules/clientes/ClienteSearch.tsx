import React, { useState } from 'react';
import { clienteService } from './clienteService';

const ClienteSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [clientes, setClientes] = useState([]);

    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            setClientes([]);
            return;
        }
        const results = await clienteService.searchClientes(searchTerm);
        setClientes(results);
    };

    return (
        <div>
            <h2>Pesquisar Clientes</h2>
            <input
                type="text"
                placeholder="Digite o nome do cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <button onClick={handleSearch}>Pesquisar</button>
            <ul>
                {clientes.map((cliente) => (
                    <li key={cliente.id}>{cliente.nome}</li>
                ))}
            </ul>
        </div>
    );
};

export default ClienteSearch;