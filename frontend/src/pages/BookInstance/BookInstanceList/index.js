import React, { useState, useEffect } from 'react';
import { Page, Layout, ResourceList, ResourceItem } from '@shopify/polaris';

import api from '../../../services/api';

const BookInstanceList = () => {

    const [bookInstances, setBookInstances] = useState([]);

    useEffect(() => {
        api
            .get('/catalog/bookInstances')
            .then(res => {
                setBookInstances(res.data.bookinstance_list);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, []);

    return (
        <Page title="Book instance list">
            <Layout>
                <Layout.Section>
                    <ResourceList
                        items={bookInstances}
                        renderItem={
                            (item) => {
                                return (
                                    <ResourceItem
                                        id={item._id}
                                        url={`/catalog/bookinstance/${item._id}`}
                                    >
                                        {item.book.title}
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

export default BookInstanceList;