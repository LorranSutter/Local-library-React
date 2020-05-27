import React from 'react';
import { Frame } from '@shopify/polaris';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';

import Navigator from './components/Navigator';
import Home from './pages/Home';
import GenreList from './pages/Genre/GenreList';
import AuthorList from './pages/Author/AuthorList';
import BookList from './pages/Book/BookList';
import BookInstanceList from './pages/BookInstance/BookInstanceList';

function App() {
  return (
    <BrowserRouter>
      <Frame navigation={Navigator}>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/catalog' exact component={Home} />
          <Route path='/catalog/genres' exact component={GenreList} />
          <Route path='/catalog/authors' exact component={AuthorList} />
          <Route path='/catalog/books' exact component={BookList} />
          <Route path='/catalog/bookinstances' exact component={BookInstanceList} />
        </Switch>
      </Frame>
    </BrowserRouter>
  );
}

export default App;
