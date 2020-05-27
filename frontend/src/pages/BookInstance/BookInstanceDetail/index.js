import React, { useState, useEffect } from 'react';
import { Page, Layout } from '@shopify/polaris';

import api from '../../../services/api';

const BookInstanceDetail = ({ match }) => {

    const [id, setId] = useState('')
    const [genreBook, setGenreBook] = useState([]);

    useEffect(() => {
        api
            .get(`/catalog/bookinstance/${match.params.id}`)
            .then(res => {
                setId(res.data.bookinstance._id);
                setGenreBook(res.data.bookinstance.book.title);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [match]);

    return (
        <Page title={`Id: ${id}`}>
            <Layout>
                <Layout.Section>
                    {`Title: ${genreBook}`}
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default BookInstanceDetail;