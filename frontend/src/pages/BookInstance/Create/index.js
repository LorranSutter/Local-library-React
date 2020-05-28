import React, { useState, useCallback, useEffect } from 'react';
import { Page, Layout, Form, FormLayout, TextField, Select, Button } from '@shopify/polaris';

import api from '../../../services/api';

const Create = () => {

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [imprint, setImprint] = useState('');
    const [date, setDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Maintenance');

    const handleSelectBookChange = useCallback((value) => setSelectedBook(value), []);
    const handleSelectStatusChange = useCallback((value) => setSelectedStatus(value), []);

    const statusOptions = [
        { label: 'Maintenance', value: 'Maintenance' },
        { label: 'Available', value: 'Available' },
        { label: 'Loaned', value: 'Loaned' },
        { label: 'Reserved', value: 'Reserved' }
    ];

    const handleSetImprint = useCallback(
        (value) => setImprint(value),
        []
    );
    const handleSetDate = useCallback(
        (value) => setDate(value),
        []
    );

    const handleSubmit = useCallback(
        () => {
            console.log({
                book: selectedBook,
                imprint: imprint,
                status: selectedStatus,
                due_back: date
            })
            try {
                api
                    .post('/catalog/bookinstance/create',
                        {
                            book: selectedBook,
                            imprint: imprint,
                            status: selectedStatus,
                            due_back: date
                        })
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    });

            } catch (error) {
                console.log(error);
            }
        },
        [selectedBook, imprint, selectedStatus, date]
    );

    useEffect(() => {
        try {
            api
                .get('/catalog/books')
                .then((res) => {
                    setSelectedBook(res.data.book_list[0]._id);
                    setBooks(
                        res.data.book_list
                            .map((book) => {
                                return {
                                    label: book.title,
                                    value: book._id,
                                }
                            })
                    )
                })
                .catch(err => {
                    console.log(err);
                });

        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <Page title='Create Book Instance'>
            <Layout>
                <Layout.Section>
                    <Form onSubmit={handleSubmit}>
                        <FormLayout>
                            <Select
                                label="Book"
                                options={books}
                                onChange={handleSelectBookChange}
                                value={selectedBook}
                            />
                            <TextField
                                id="imprint"
                                value={imprint}
                                label="Imprint"
                                onChange={handleSetImprint}
                                type="text"
                            // TODO Treat error of invalid field
                            // error="Store name is required"
                            />
                            <TextField
                                id="date"
                                value={date}
                                label="Date when book available"
                                onChange={handleSetDate}
                                type="date"
                            // TODO Treat error of invalid field
                            // error="Store name is required"
                            />
                            <Select
                                label="Status"
                                options={statusOptions}
                                onChange={handleSelectStatusChange}
                                value={selectedStatus}
                            />
                            <Button primary submit>
                                Save
                            </Button>
                        </FormLayout>
                    </Form>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Create;