import React from 'react';
import ClientModule from './components/ClientModule';
import './styles/client.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Gerenciador de Clientes</h1>
      <ClientModule />
    </div>
  );
};

export default App;