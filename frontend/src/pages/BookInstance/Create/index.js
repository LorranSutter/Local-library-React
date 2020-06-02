import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Page,
    Layout,
    Form,
    FormLayout,
    TextField,
    Select,
    Button,
    Toast
} from '@shopify/polaris';

import axios from 'axios';
import moment from 'moment';

import api from '../../../services/api';

const Create = (props) => {

    const history = useHistory();

    const [id, setId] = useState([]);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [imprint, setImprint] = useState('');
    const [date, setDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusOptions, setStatusOptions] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleSaved = useCallback(() => setSaved((saved) => !saved), []);
    const toastSaved = saved ? (
        <Toast content={`Book Instance saved successfully`} onDismiss={toggleSaved} />
    ) : null;

    const handleSelectBookChange = useCallback((value) => setSelectedBook(value), []);
    const handleSelectStatusChange = useCallback((value) => setSelectedStatus(value), []);

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

                const apiResponse = isUpdating ?
                    api.put(`/catalog/bookinstance/${id}`,
                        {
                            book: selectedBook,
                            imprint: imprint,
                            status: selectedStatus,
                            due_back: date
                        })
                    :
                    api.post('/catalog/bookinstance/create',
                        {
                            book: selectedBook,
                            imprint: imprint,
                            status: selectedStatus,
                            due_back: date
                        });

                apiResponse
                    .then(() => {
                        if (isUpdating) {
                            history.push(`/bookinstance/detail/${id}`, { 'updated': `Book Instance updated successfully` });
                        } else {
                            toggleSaved();
                            setImprint('');
                            setDate('');
                            setSelectedStatus(statusOptions[0].name);
                            setIsLoading(isLoading => !isLoading);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        setIsLoading(isLoading => !isLoading);
                    })

            } catch (error) {
                console.log(error);
            }
        },
        [id, selectedBook, imprint, selectedStatus, date, statusOptions, isUpdating, history, toggleSaved]
    );

    useEffect(() => {
        try {
            axios
                .all([
                    api.get('/catalog/books'),
                    api.get('/catalog/status')
                ])
                .then(axios.spread((_books, _status) => {
                    if (props.history.location.state) {
                        setIsUpdating(true);
                        setId(props.history.location.state.id);
                        setSelectedBook(props.history.location.state.book._id);
                        setImprint(props.history.location.state.bookinstance.imprint);
                        setDate(moment(props.history.location.state.bookinstance.due_back).format('YYYY-MM-DD'));
                        setSelectedStatus(props.history.location.state.bookinstance.status._id);
                    } else {
                        setSelectedBook(_books.data.book_list[0]._id);
                        setSelectedStatus(_status.data.list_status[0]._id);
                    }
                    setBooks(
                        _books.data.book_list
                            .map((book) => {
                                return {
                                    label: book.title,
                                    value: book._id,
                                }
                            })
                    )
                    setStatusOptions(
                        _status.data.list_status
                            .map((status) => {
                                return {
                                    label: status.name,
                                    value: status._id
                                }
                            })
                    )
                }))
                .catch(err => {
                    console.log(err);
                });

        } catch (error) {
            console.log(error);
        }
    }, [props]);

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