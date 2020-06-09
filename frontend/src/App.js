import React from 'react';
import { Frame } from '@shopify/polaris';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';

import Navigator from './components/Navigator';
import Home from './pages/Home';
import GenreList from './pages/Genre/List';
import GenreDetail from './pages/Genre/Detail';
import GenreCreate from './pages/Genre/Create';
import AuthorList from './pages/Author/List';
import AuthorDetail from './pages/Author/Detail';
import AuthorCreate from './pages/Author/Create';
import BookList from './pages/Book/List';
import BookDetail from './pages/Book/Detail';
import BookCreate from './pages/Book/Create';
import BookInstanceList from './pages/BookInstance/List';
import BookInstanceDetail from './pages/BookInstance/Detail';
import BookInstanceCreate from './pages/BookInstance/Create';

function App() {
  return (
    <BrowserRouter>
      <Frame navigation={Navigator}>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/catalog' exact component={Home} />
          <Route path='/genres' exact component={GenreList} />
          <Route path='/genre/detail/:id' exact component={GenreDetail} />
          <Route path='/genre/create' exact component={GenreCreate} />
          <Route path='/authors' exact component={AuthorList} />
          <Route path='/author/detail/:id' exact component={AuthorDetail} />
          <Route path='/author/create' exact component={AuthorCreate} />
          <Route path='/books' exact component={BookList} />
          <Route path='/book/detail/:id' exact component={BookDetail} />
          <Route path='/book/create' exact component={BookCreate} />
          <Route path='/bookinstances' exact component={BookInstanceList} />
          <Route path='/bookinstance/detail/:id' exact component={BookInstanceDetail} />
          <Route path='/bookinstance/create' exact component={BookInstanceCreate} />
        </Switch>
      </Frame>
    </BrowserRouter>
  );
}

export default App;
