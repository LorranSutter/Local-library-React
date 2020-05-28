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
                    url: '/authors'
                },
                {
                    label: 'All genres',
                    url: '/genres'
                },
                {
                    label: 'All books',
                    url: '/books'
                },
                {
                    label: 'All book instances',
                    url: '/bookinstances'
                }
            ]}
        />
        <Navigation.Section
            separator
            title="Registration"
            items={[
                {
                    label: 'Create a new author',
                    url: '/author/create'
                },
                {
                    label: 'Create a new genre',
                    url: '/genre/create'
                },
                {
                    label: 'Create a new book',
                    url: '/book/create'
                },
                {
                    label: 'Create a new book instance',
                    url: '/bookinstance/create'
                }
            ]}
        />
    </Navigation>
);

export default Navigator;