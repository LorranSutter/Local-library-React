import React, { useState, useEffect } from 'react';
import { Page, Layout, ResourceList, ResourceItem } from '@shopify/polaris';

import api from '../../../services/api';

const GenreList = () => {

    const [genres, setGenres] = useState([]);

    useEffect(() => {
        api
            .get('/catalog/genres')
            .then(res => {
                setGenres(res.data.genre_list);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, []);

    return (
        <Page title="Genre list">
            <Layout>
                <Layout.Section>
                    <ResourceList
                        items={genres}
                        renderItem={
                            (item) => {
                                return (
                                    <ResourceItem
                                        id={item._id}
                                        url={`/catalog/genre/${item._id}`}
                                    >
                                        {item.name}
                                    </ResourceItem>
                                )
                            }
                        }
                    />
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default GenreList;