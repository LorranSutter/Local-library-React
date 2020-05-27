import React from 'react';
import { Navigation } from '@shopify/polaris';
import { HomeMajorFilled } from '@shopify/polaris-icons';

const Navigator = (
    <Navigation location='/'>
        <Navigation.Section
            items={[
                {
                    label: 'Home',
                    icon: HomeMajorFilled,
                    url: '/catalog'
                }
            ]}
        />
        <Navigation.Section
            separator
            title="Listing"
            items={[
                {
                    label: 'All authors',
                    url: '/catalog/authors'
                },
                {
                    label: 'All genres',
                    url: '/catalog/genres'
                },
                {
                    label: 'All books',
                    url: '/catalog/books'
                },
                {
                    label: 'All book instances',
                    url: '/catalog/bookinstances'
                }
            ]}
        />
        <Navigation.Section
            separator
            title="Registration"
            items={[
                {
                    label: 'Create a new author',
                    url: '/catalog/author/create'
                },
                {
                    label: 'Create a new genre',
                    url: '/catalog/genre/create'
                },
                {
                    label: 'Create a new book',
                    url: '/catalog/book/create'
                },
                {
                    label: 'Create a new book instance',
                    url: '/catalog/bookinstance/create'
                }
            ]}
        />
    </Navigation>
);

export default Navigator;