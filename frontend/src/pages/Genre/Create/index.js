import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Page, Layout, Form, FormLayout, TextField, Button, Toast } from '@shopify/polaris';

import api from '../../../services/api';

const Create = (props) => {

    const history = useHistory();

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const toggleSaved = useCallback(() => setSaved((saved) => !saved), []);
    const toastSaved = saved ? (
        <Toast content={`Genre ${name} saved successfully`} onDismiss={toggleSaved} />
    ) : null;

    const handleSetName = useCallback(
        (value) => setName(value),
        []
    );

    const handleSubmit = useCallback(
        () => {
            setIsLoading(isLoading => !isLoading);
            try {

                const apiResponse = isUpdating ?
                    api.put(`/catalog/genre/${id}`, { name }) :
                    api.post('/catalog/genre/create', { name });

                apiResponse
                    .then(() => {
                        if (isUpdating) {
                            history.push(`/genre/detail/${id}`, { 'updated': `Genre ${name} updated successfully` });
                        } else {
                            toggleSaved();
                            setName('');
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
        [id, name, isUpdating, history, toggleSaved]
    );

    useEffect(() => {
        if (props.history.location.state) {
            setIsUpdating(true);
            setId(props.history.location.state.id);
            setName(props.history.location.state.name);
        }
    }, [props]);

    return (
        <Page title='Create Genre'>
            <Layout>
                <Layout.Section>
                    <Form onSubmit={handleSubmit}>
                        <FormLayout>
                            <TextField
                                id="Name"
                                value={name}
                                label="Name"
                                onChange={handleSetName}
                                type="text"
                            // TODO Treat error of invalid field
                            // error="Store name is required"
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