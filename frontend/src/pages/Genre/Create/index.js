import React, { useState, useCallback } from 'react';
import { Page, Layout, Form, FormLayout, TextField, Button } from '@shopify/polaris';

import api from '../../../services/api';

const Create = () => {

    const [name, setName] = useState('');

    const handleSetName = useCallback(
        (value) => setName(value),
        []
    );

    const handleSubmit = useCallback(
        () => {
            try {
                api
                    .post('/catalog/genre/create', { name })
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
        [name]
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