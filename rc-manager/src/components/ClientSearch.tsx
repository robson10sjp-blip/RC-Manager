import React from 'react';

interface ClientSearchProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

const ClientSearch: React.FC<ClientSearchProps> = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="client-search">
      <input
        type="text"
        placeholder="Pesquisar cliente..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
    </div>
  );
};

export default ClientSearch;
