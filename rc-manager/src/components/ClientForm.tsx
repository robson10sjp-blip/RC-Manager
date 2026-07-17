import React, { useState, useEffect } from 'react';
import { addClient, updateClient } from '../services/clientService';

interface Client {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

interface ClientFormProps {
  client: Client | null;
  onClientSaved: () => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClientSaved, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setEmail(client.email || '');
      setPhone(client.phone || '');
    } else {
      clearForm();
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clientData = { name, email, phone };

    if (client?.id) {
      await updateClient(client.id, clientData);
    } else {
      await addClient(clientData);
    }

    onClientSaved();
    clearForm();
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className="client-form">
      <h2>{client?.id ? 'Editar Cliente' : 'Novo Cliente'}</h2>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Telefone:</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit">{client?.id ? 'Atualizar' : 'Adicionar'} Cliente</button>
        {client?.id && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ClientForm;
