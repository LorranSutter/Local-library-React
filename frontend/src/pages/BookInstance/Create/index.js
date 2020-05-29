import React, { useState, useCallback, useEffect } from 'react';
import { Page, Layout, Form, FormLayout, TextField, Select, Button, Toast } from '@shopify/polaris';

import api from '../../../services/api';

const Create = () => {

    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [imprint, setImprint] = useState('');
    const [date, setDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Maintenance');
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleSaved = useCallback(() => setSaved((saved) => !saved), []);
    const toastSaved = saved ? (
        <Toast content={`Book Instance saved successfully`} onDismiss={toggleSaved} />
    ) : null;

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
            setIsLoading(isLoading => !isLoading);
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
                        toggleSaved();
                        setImprint('');
                        setDate('');
                        setSelectedStatus('Maintenance');
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        setIsLoading(isLoading => !isLoading);
                    });

            } catch (error) {
                console.log(error);
            }
        },
        [selectedBook, imprint, selectedStatus, date, toggleSaved]
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
                            {isLoading ?
                                <Button primary submit loading> Save </Button>
                                :
                                <Button primary submit> Save </Button>
                            }
                            {toastSaved}
                        </FormLayout>
                    </Form>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Create;