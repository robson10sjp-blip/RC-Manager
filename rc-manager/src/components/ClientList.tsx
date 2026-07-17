import React from 'react';

interface ClientListProps {
  clients: any[];
  loading: boolean;
  onEdit: (client: any) => void;
  onDelete: (id: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div>Carregando clientes...</div>;
  }

  return (
    <div className="client-list">
      <h2>Lista de Clientes</h2>
      {clients.length === 0 ? (
        <p>Nenhum cliente encontrado.</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id} className="client-item">
              <div>
                <strong>{client.name}</strong>
                <div>{client.email}</div>
                <div>{client.phone}</div>
              </div>
              <div className="client-actions">
                <button onClick={() => onEdit(client)}>Editar</button>
                <button className="danger" onClick={() => onDelete(client.id)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientList;
