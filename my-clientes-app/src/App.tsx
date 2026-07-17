import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ClienteForm from './modules/clientes/ClienteForm';
import ClienteList from './modules/clientes/ClienteList';
import ClienteSearch from './modules/clientes/ClienteSearch';
import ClienteEdit from './modules/clientes/ClienteEdit';
import ClienteDelete from './modules/clientes/ClienteDelete';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Clientes Management</h1>
        <Switch>
          <Route path="/" exact component={ClienteList} />
          <Route path="/add" component={ClienteForm} />
          <Route path="/edit/:id" component={ClienteEdit} />
          <Route path="/search" component={ClienteSearch} />
          <Route path="/delete/:id" component={ClienteDelete} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;