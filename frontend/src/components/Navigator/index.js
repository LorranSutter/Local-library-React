import React from 'react';
import { Navigation } from '@shopify/polaris';
import { HomeMajorFilled } from '@shopify/polaris-icons';

const Navigator = () => {
    return (
        <Navigation location='/'>
            <Navigation.Section
                items={[
                    {
                        label: 'Home',
                        icon: HomeMajorFilled
                    }
                ]}
            />
            <Navigation.Section
                separator
                title="Listing"
                items={[
                    {
                        label: 'All books'
                    },
                    {
                        label: 'All authors'
                    },
                    {
                        label: 'All genres'
                    },
                    {
                        label: 'All book instances'
                    }
                ]}
            />
            <Navigation.Section
                separator
                title="Registration"
                items={[
                    {
                        label: 'Create a new author',
                    },
                    {
                        label: 'Create a new genre'
                    },
                    {
                        label: 'Create a new book'
                    },
                    {
                        label: 'Create a new book instance'
                    }
                ]}
            />
        </Navigation>
    );
}

export default Navigator;