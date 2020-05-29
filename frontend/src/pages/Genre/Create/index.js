import React, { useState, useCallback } from 'react';
import { Page, Layout, Form, FormLayout, TextField, Button, Toast } from '@shopify/polaris';

import api from '../../../services/api';

const Create = () => {

    const [name, setName] = useState('');
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
                api
                    .post('/catalog/genre/create', { name })
                    .then(res => {
                        console.log(res);
                        toggleSaved();
                        setName('');
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
        [name, toggleSaved]
    );

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