import React from 'react';
import ClientModule from './components/ClientModule';
import ProductModule from './components/ProductModule';
import './styles/client.css';

const App: React.FC = () => {
  return (
    <div className="App container">
      <h1>RC Manager</h1>
      <ClientModule />
      <ProductModule />
    </div>
  );
};

export default App;
