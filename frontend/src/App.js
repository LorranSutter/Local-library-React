import React from 'react';
import { Frame } from '@shopify/polaris';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';

import Navigator from './components/Navigator';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Frame navigation={<Navigator />}>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/catalog' exact component={Home} />
        </Switch>
      </Frame>
    </BrowserRouter>
  );
}

export default App;
