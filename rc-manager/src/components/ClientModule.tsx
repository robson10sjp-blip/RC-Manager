import React, { useState, useEffect } from 'react';
import ClientForm from './ClientForm';
import ClientList from './ClientList';
import ClientSearch from './ClientSearch';
import { getClients, deleteClient } from '../services/clientService';

const ClientModule: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    setLoading(true);
    const clientsData = await getClients();
    setClients(clientsData);
    setLoading(false);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleClientSaved = async () => {
    setSelectedClient(null);
    await loadClients();
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
  };

  const handleDelete = async (id: string) => {
    await deleteClient(id);
    await loadClients();
  };

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="client-module">
      <ClientForm
        client={selectedClient}
        onClientSaved={handleClientSaved}
        onCancel={() => setSelectedClient(null)}
      />
      <ClientSearch searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      <ClientList
        clients={filteredClients}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ClientModule;
