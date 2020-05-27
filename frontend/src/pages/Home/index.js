import React, { useState, useEffect } from 'react';
import { Page, Layout, Card, List, Link, Spinner } from '@shopify/polaris';

import api from '../../services/api';

const Home = () => {

    const [books, setBooks] = useState();
    const [copies, setCopies] = useState();
    const [copiesAvailable, setCopiesAvailable] = useState();
    const [authors, setAuthors] = useState();
    const [genres, setGenres] = useState();

    useEffect(() => {
        api
            .get('/')
            .then(res => {
                setBooks(res.data.data.book_count);
                setCopies(res.data.data.book_instance_count);
                setCopiesAvailable(res.data.data.book_instance_available_count);
                setAuthors(res.data.data.author_count);
                setGenres(res.data.data.genre_count);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });
    }, []);
    // TODO Better list presentation
    // TODO Better spinner presentation

    return (
        <Page title="Local Library">
            <Layout>
                <Layout.Section>
                    <Card sectioned title="The library has the following record counts">
                        <List>
                            <List.Item>
                                Books: <Link url='/catalog/books'>{books ?? <Spinner size='small' color='inkLightest' />}</Link>
                            </List.Item>
                            <List.Item>
                                Copies: <Link url='/catalog/bookinstances'>{copies ?? <Spinner size='small' color='inkLightest' />}</Link>
                            </List.Item>
                            <List.Item>
                                Available copies: <Link url='/catalog/bookinstances'>{copiesAvailable ?? <Spinner size='small' color='inkLightest' />}</Link>
                            </List.Item>
                            <List.Item>
                                Authors: <Link url='/catalog/authors'>{authors ?? <Spinner size='small' color='inkLightest' />}</Link>
                            </List.Item>
                            <List.Item>
                                Genres: <Link url='/catalog/genres'>{genres ?? <Spinner size='small' color='inkLightest' />}</Link>
                            </List.Item>
                        </List>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Home;