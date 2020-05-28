import React, { useState, useCallback, useEffect } from 'react';
import { Page, Layout, Form, FormLayout, TextField, Select, Button } from '@shopify/polaris';
import axios from 'axios';

import api from '../../../services/api';

const Create = () => {

    const [title, setTitle] = useState('');
    const [authors, setAuthors] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [summary, setSummary] = useState('');
    const [isbn, setISBN] = useState('');
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');

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
            try {
                api
                    .post('/catalog/book/create',
                        {
                            title: title,
                            author: selectedAuthor,
                            summary: summary,
                            isbn: isbn,
                            genre: selectedGenre
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
        [title, selectedAuthor, summary, isbn, selectedGenre]
    );

    useEffect(() => {
        try {
            axios
                .all([
                    api.get('/catalog/authors'),
                    api.get('/catalog/genres')
                ])
                .then(axios.spread((_authors, _genres) => {
                    setSelectedAuthor(_authors.data.author_list[0]._id);
                    setSelectedGenre(_genres.data.genre_list[0]._id);
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
    }, []);

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