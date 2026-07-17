import React from 'react';
import { useHistory } from 'react-router-dom';
import { clienteService } from './clienteService';

const ClienteDelete = ({ clienteId }) => {
    const history = useHistory();

    const handleDelete = async () => {
        try {
            await clienteService.deleteCliente(clienteId);
            history.push('/clientes'); // Redireciona para a lista de clientes após a exclusão
        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            alert("Erro ao excluir cliente. Tente novamente.");
        }
    };

    return (
        <div>
            <h2>Excluir Cliente</h2>
            <p>Tem certeza que deseja excluir este cliente?</p>
            <button onClick={handleDelete}>Excluir</button>
            <button onClick={() => history.push('/clientes')}>Cancelar</button>
        </div>
    );
};

export default ClienteDelete;