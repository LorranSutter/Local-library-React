import React, { useState, useCallback } from 'react';
import { Page, Layout, Form, FormLayout, TextField, Button } from '@shopify/polaris';

import api from '../../../services/api';

const Create = () => {

    const [firstName, setFirstName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [dateDeath, setDateDeath] = useState('');
    // const [saveError, setSaveError] = useState(false);

    const handleSetFirstName = useCallback(
        (value) => setFirstName(value),
        []
    );
    const handleSetFamilyName = useCallback(
        (value) => setFamilyName(value),
        []
    );
    const handleSetDateBirth = useCallback(
        (value) => setDateBirth(value),
        []
    );
    const handleSetDateDeath = useCallback(
        (value) => setDateDeath(value),
        []
    );

    const handleSubmit = useCallback(
        () => {
            try {
                api
                    .post('/catalog/author/create',
                        {
                            first_name: firstName,
                            family_name: familyName,
                            date_of_birth: dateBirth,
                            date_of_death: dateDeath
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
        [firstName, familyName, dateBirth, dateDeath]
    );

    return (
        <Page title='Create Author'>
            <Layout>
                <Layout.Section>
                    <Form onSubmit={handleSubmit}>
                        <FormLayout>
                            <FormLayout.Group>
                                <TextField
                                    id="firstName"
                                    value={firstName}
                                    label="First Name"
                                    onChange={handleSetFirstName}
                                    type="text"
                                // TODO Treat error of invalid field
                                // error="Store name is required"
                                />
                                <TextField
                                    id="familyName"
                                    value={familyName}
                                    label="Family Name"
                                    onChange={handleSetFamilyName}
                                    type="text"
                                // TODO Treat error of invalid field
                                // error="Store name is required"
                                />
                            </FormLayout.Group>
                            <FormLayout.Group>
                                <TextField
                                    id="dateBirth"
                                    value={dateBirth}
                                    label="Date of birth"
                                    onChange={handleSetDateBirth}
                                    type="date"
                                // TODO Treat error of invalid field
                                // error="Store name is required"
                                />
                                <TextField
                                    id="dateDeath"
                                    value={dateDeath}
                                    label="Date of death"
                                    onChange={handleSetDateDeath}
                                    type="date"
                                // TODO Treat error of invalid field
                                // error="Store name is required"
                                />
                            </FormLayout.Group>
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