import React, { useState, useEffect } from 'react';
import { Page, Layout, ResourceList, ResourceItem } from '@shopify/polaris';

import api from '../../../services/api';

const Detail = ({ match }) => {

    const [title, setTitle] = useState('')
    const [bookInstances, setBookInstances] = useState([]);

    useEffect(() => {
        api
            .get(`/catalog/book/${match.params.id}`)
            .then(res => {
                setTitle(res.data.book.title);
                setBookInstances(res.data.book_instances);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [match]);

    return (
        <Page title={`Book: ${title}`}>
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
                                        {item._id}
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