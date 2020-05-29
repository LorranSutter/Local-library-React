import React, { useState, useCallback } from 'react';
import { Page, Layout, Form, FormLayout, TextField, Button, Toast } from '@shopify/polaris';

import api from '../../../services/api';

const Create = () => {

    const [firstName, setFirstName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [dateDeath, setDateDeath] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    // const [saveError, setSaveError] = useState(false);

    const toggleSaved = useCallback(() => setSaved((saved) => !saved), []);
    const toastSaved = saved ? (
        <Toast content={`Author ${firstName} saved successfully`} onDismiss={toggleSaved} />
    ) : null;

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
            setIsLoading(isLoading => !isLoading);
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
                        toggleSaved();
                        setFirstName('');
                        setFamilyName('');
                        setDateBirth('');
                        setDateDeath('');
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
        [firstName, familyName, dateBirth, dateDeath, toggleSaved]
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