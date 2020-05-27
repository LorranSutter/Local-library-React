import React from 'react';
import { Frame } from '@shopify/polaris';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';

import Navigator from './components/Navigator';
import Home from './pages/Home';
import GenreList from './pages/Genre/List';
import GenreDetail from './pages/Genre/Detail';
import AuthorList from './pages/Author/List';
import AuthorDetail from './pages/Author/Detail';
import BookList from './pages/Book/List';
import BookDetail from './pages/Book/Detail';
import BookInstanceList from './pages/BookInstance/List';
import BookInstanceDetail from './pages/BookInstance/Detail';

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
