import React, { useState, useEffect } from 'react';
import { Page, Layout, ResourceList, ResourceItem, TextStyle } from '@shopify/polaris';

import api from '../../../services/api';

const Detail = ({ match }) => {

    const [name, setName] = useState('')
    const [authorBooks, setAuthorBooks] = useState([]);

    useEffect(() => {
        api
            .get(`/catalog/author/${match.params.id}`)
            .then(res => {
                setName(`${res.data.author.family_name}, ${res.data.author.first_name}`);
                setAuthorBooks(res.data.author_books);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [match]);

    return (
        <Page title={`Author: ${name}`}>
            <Layout>
                <Layout.Section>
                    <ResourceList
                        items={authorBooks}
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