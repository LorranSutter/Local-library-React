import React from 'react';
import { Navigation } from '@shopify/polaris';
import { HomeMajorFilled } from '@shopify/polaris-icons';

import { useHistory } from 'react-router-dom';

const Navigator = () => {

    const history = useHistory();

    const goToHome = () => history.push('/');

    const goToAllAuthors = () => history.push('/catalog/authors');
    const goToAllGenres = () => history.push('/catalog/genres');
    const goToAllBooks = () => history.push('/catalog/books');
    const goToAllBooksInstances = () => history.push('/catalog/bookinstances');

    const goToCreateAuthor = () => history.push('/catalog/author/create');
    const goToCreateGenre = () => history.push('/catalog/genre/create');
    const goToCreateBook = () => history.push('/catalog/book/create');
    const goToCreateBookInstance = () => history.push('/catalog/bookinstance/create');

    return (
        <Navigation location='/'>
            <Navigation.Section
                items={[
                    {
                        label: 'Home',
                        icon: HomeMajorFilled,
                        onClick: goToHome
                    }
                ]}
            />
            <Navigation.Section
                separator
                title="Listing"
                items={[
                    {
                        label: 'All authors',
                        onClick: goToAllAuthors
                    },
                    {
                        label: 'All genres',
                        onClick: goToAllGenres
                    },
                    {
                        label: 'All books',
                        onClick: goToAllBooks
                    },
                    {
                        label: 'All book instances',
                        onClick: goToAllBooksInstances
                    }
                ]}
            />
            <Navigation.Section
                separator
                title="Registration"
                items={[
                    {
                        label: 'Create a new author',
                        onClick: goToCreateAuthor
                    },
                    {
                        label: 'Create a new genre',
                        onClick: goToCreateGenre
                    },
                    {
                        label: 'Create a new book',
                        onClick: goToCreateBook
                    },
                    {
                        label: 'Create a new book instance',
                        onClick: goToCreateBookInstance
                    }
                ]}
            />
        </Navigation>
    );
}

export default Navigator;