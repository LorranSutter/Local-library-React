import React, { useState, useEffect } from 'react';
import { Page, Layout, Link, ResourceList, ResourceItem, TextContainer, TextStyle } from '@shopify/polaris';

import api from '../../../services/api';

const List = () => {

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
                                        url={`/book/detail/${item._id}`}
                                    >
                                        <TextContainer>
                                            <TextStyle variation="strong">
                                                <Link key={item._id} url={`/book/detail/${item._id}`}>{item.title}</Link>
                                            </TextStyle>
                                        </TextContainer>
                                        <TextContainer>
                                            {item.author ? `${item.author.family_name}, ${item.author.first_name}` : ''}
                                        </TextContainer>

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

export default List;