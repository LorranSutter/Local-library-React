import React from 'react';
import { Frame } from '@shopify/polaris';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';

import Navigator from './components/Navigator';
import Home from './pages/Home';
import GenreList from './pages/Genre/GenreList';
import GenreDetail from './pages/Genre/GenreDetail';
import AuthorList from './pages/Author/AuthorList';
import AuthorDetail from './pages/Author/AuthorDetail';
import BookList from './pages/Book/BookList';
import BookDetail from './pages/Book/BookDetail';
import BookInstanceList from './pages/BookInstance/BookInstanceList';
import BookInstanceDetail from './pages/BookInstance/BookInstanceDetail';

function App() {
  return (
    <BrowserRouter>
      <Frame navigation={Navigator}>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/catalog' exact component={Home} />
          <Route path='/catalog/genres' exact component={GenreList} />
          <Route path='/catalog/genre/:id' exact component={GenreDetail} />
          <Route path='/catalog/authors' exact component={AuthorList} />
          <Route path='/catalog/author/:id' exact component={AuthorDetail} />
          <Route path='/catalog/books' exact component={BookList} />
          <Route path='/catalog/book/:id' exact component={BookDetail} />
          <Route path='/catalog/bookinstances' exact component={BookInstanceList} />
          <Route path='/catalog/bookinstance/:id' exact component={BookInstanceDetail} />
        </Switch>
      </Frame>
    </BrowserRouter>
  );
}

export default App;
