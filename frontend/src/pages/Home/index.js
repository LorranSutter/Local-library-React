import React, { useState, useEffect } from 'react';
import { Page, Layout, Card, List } from '@shopify/polaris';

import api from '../../services/api';

const Home = () => {

    const [books, setBooks] = useState([]);
    const [copies, setCopies] = useState([]);
    const [copiesAvailable, setCopiesAvailable] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);

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
    }, []);

    return (
        <Page title="Local Library">
            <Layout>
                <Layout.Section>
                    <Card sectioned title="The library has the following record counts">
                        <List>
                            <List.Item>Books: {books}</List.Item>
                            <List.Item>Copies: {copies}</List.Item>
                            <List.Item>Available copies: {copiesAvailable}</List.Item>
                            <List.Item>Authors: {authors}</List.Item>
                            <List.Item>Genres: {genres}</List.Item>
                        </List>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Home;