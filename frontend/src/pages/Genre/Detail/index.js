import React, { useState, useEffect } from 'react';
import { Page, Layout, ResourceList, ResourceItem, TextStyle } from '@shopify/polaris';

import api from '../../../services/api';

const Detail = ({ match }) => {

    const [title, setTitle] = useState('')
    const [genreBooks, setGenreBooks] = useState([]);

    useEffect(() => {
        api
            .get(`/catalog/genre/${match.params.id}`)
            .then(res => {
                setTitle(res.data.genre.name);
                setGenreBooks(res.data.genre_books);
                console.log(res.data.genre_books)
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [match]);

    return (
        <Page title={`Genre: ${title}`}>
            <Layout>
                <Layout.Section>
                    <ResourceList
                        items={genreBooks}
                        renderItem={
                            (item) => {
                                return (
                                    <ResourceItem
                                        id={item._id}
                                        url={`/book/detail/${item._id}`}
                                    >
                                        <h3>
                                            <TextStyle variation="strong">{item.title}</TextStyle>
                                        </h3>
                                        <p>
                                            {item.summary}
                                        </p>
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

export default Detail;