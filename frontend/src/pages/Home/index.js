import React, { useState, useEffect, useCallback } from 'react';
import { Page, Layout, Card, List, Link, Spinner, Toast } from '@shopify/polaris';

import api from '../../services/api';

const Home = () => {

    const [books, setBooks] = useState();
    const [copies, setCopies] = useState();
    const [copiesAvailable, setCopiesAvailable] = useState();
    const [authors, setAuthors] = useState();
    const [genres, setGenres] = useState();
    const [activeError, setActiveError] = useState(false);

    const dataSpinner = (data) => {
        return (<Link url='/catalog/books'>{data ?? <Spinner size='small' color='inkLightest' />}</Link>);
    }

    const toggleActiveError = useCallback(() => setActiveError((active) => !active), []);
    const toastError = activeError ? (
        <Toast content="Error retrieving data" error onDismiss={toggleActiveError} />
    ) : null;

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
            .catch(() => {
                toggleActiveError();
            });
    }, [toggleActiveError]);

    // TODO Better list presentation
    // TODO Better spinner presentation
    return (
        <Page title="Local Library">
            <Layout>
                <Layout.Section>
                    <Card sectioned title="The library has the following record counts">
                        <List>
                            <List.Item>
                                Books: {dataSpinner(books)}
                            </List.Item>
                            <List.Item>
                                Copies: {dataSpinner(copies)}
                            </List.Item>
                            <List.Item>
                                Available copies: {dataSpinner(copiesAvailable)}
                            </List.Item>
                            <List.Item>
                                Authors: {dataSpinner(authors)}
                            </List.Item>
                            <List.Item>
                                Genres: {dataSpinner(genres)}
                            </List.Item>
                        </List>
                    </Card>
                </Layout.Section>
            </Layout>
            {toastError}
        </Page>
    );
}

export default Home;