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

import api from '../../../services/api';

const Create = (props) => {

    const history = useHistory();

    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [summary, setSummary] = useState('');
    const [isbn, setISBN] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleSaved = useCallback(() => setSaved((saved) => !saved), []);
    const toastSaved = saved ? (
        <Toast content={`Book ${title} saved successfully`} onDismiss={toggleSaved} />
    ) : null;

    const handleSelectAuthorChange = useCallback((value) => setSelectedAuthor(value), []);
    const handleSelectGenreChange = useCallback((value) => setSelectedGenre(value), []);

    const handleSetTitle = useCallback(
        (value) => setTitle(value),
        []
    );
    const handleSetSummary = useCallback(
        (value) => setSummary(value),
        []
    );
    const handleSetISBN = useCallback(
        (value) => setISBN(value),
        []
    );

    const handleSubmit = useCallback(
        () => {
            setIsLoading(isLoading => !isLoading);
            try {

                const apiResponse = isUpdating ?
                    api.put(`/catalog/book/${id}`,
                        {
                            title: title,
                            author: selectedAuthor,
                            summary: summary,
                            isbn: isbn,
                            genre: selectedGenre
                        })
                    :
                    api.post('/catalog/book/create',
                        {
                            title: title,
                            author: selectedAuthor,
                            summary: summary,
                            isbn: isbn,
                            genre: selectedGenre
                        });

                apiResponse
                    .then(() => {
                        if (isUpdating) {
                            history.push(`/book/detail/${id}`, { 'updated': `Book ${title} updated successfully` });
                        } else {
                            toggleSaved();
                            setTitle('');
                            setSummary('');
                            setISBN('');
                            setIsLoading(isLoading => !isLoading);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        setIsLoading(isLoading => !isLoading);
                    });

            } catch (error) {
                console.log(error);
            }
        },
        [id, title, selectedAuthor, summary, isbn, selectedGenre, isUpdating, history, toggleSaved]
    );

    useEffect(() => {
        try {
            axios
                .all([
                    api.get('/catalog/authors'),
                    api.get('/catalog/genres')
                ])
                .then(axios.spread((_authors, _genres) => {
                    if (props.history.location.state) {
                        setIsUpdating(true);
                        setId(props.history.location.state.id);
                        setTitle(props.history.location.state.title);
                        setSelectedAuthor(props.history.location.state.author._id);
                        setSummary(props.history.location.state.summary);
                        setISBN(props.history.location.state.isbn);
                        setSelectedGenre(props.history.location.state.genre[0]._id);
                    } else {
                        setSelectedAuthor(_authors.data.author_list[0]._id);
                        setSelectedGenre(_genres.data.genre_list[0]._id);
                    }
                    setAuthors(
                        _authors.data.author_list
                            .map((author) => {
                                return {
                                    label: `${author.first_name} ${author.family_name}`,
                                    value: author._id,
                                }
                            })
                    )
                    setGenres(
                        _genres.data.genre_list
                            .map((genre) => {
                                return {
                                    label: genre.name,
                                    value: genre._id,
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
        <Page title='Create Book'>
            <Layout>
                <Layout.Section>
                    <Form onSubmit={handleSubmit}>
                        <FormLayout>
                            <TextField
                                id="title"
                                value={title}
                                label="Title"
                                onChange={handleSetTitle}
                                type="text"
                            // TODO Treat error of invalid field
                            // error="Store name is required"
                            />
                            <Select
                                label="Author"
                                options={authors}
                                onChange={handleSelectAuthorChange}
                                value={selectedAuthor}
                            />
                            <TextField
                                id="summary"
                                value={summary}
                                label="Summary"
                                onChange={handleSetSummary}
                                type="text"
                                multiline
                            // TODO Treat error of invalid field
                            // error="Store name is required"
                            />
                            <TextField
                                id="isbn"
                                value={isbn}
                                label="ISBN"
                                onChange={handleSetISBN}
                                type="text"
                            // TODO Treat error of invalid field
                            // error="Store name is required"
                            />
                            {/* TODO Handle multiple choices */}
                            <Select
                                label="Genre"
                                options={genres}
                                onChange={handleSelectGenreChange}
                                value={selectedGenre}
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