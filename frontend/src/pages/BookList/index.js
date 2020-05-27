import React, { useState, useEffect } from 'react';
import { Page, Layout, ResourceList, ResourceItem } from '@shopify/polaris';

import api from '../../services/api';

const BooksList = () => {

    const [books, setBooks] = useState([]);

    useEffect(() => {
        api
            .get('/catalog/books')
            .then(res => {
                setBooks(res.data.book_list);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, []);

    return (
        <Page title="Book list">
            <Layout>
                <Layout.Section>
                    <ResourceList
                        items={books}
                        renderItem={
                            (item) => {
                                return (
                                    <ResourceItem
                                        id={item._id}
                                        url={`/catalog/book/${item._id}`}
                                    >
                                        {item.title}
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

export default BooksList;