import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Page, Layout, Form, FormLayout, TextField, Button, Toast } from '@shopify/polaris';

import api from '../../../services/api';

const Create = (props) => {

    const history = useHistory();

    const [id, setId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [dateDeath, setDateDeath] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
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

                const apiResponse = isUpdating ?
                    api.put(`/catalog/author/${id}`,
                        {
                            first_name: firstName,
                            family_name: familyName,
                            date_of_birth: dateBirth,
                            date_of_death: dateDeath
                        }) :
                    api.post('/catalog/author/create',
                        {
                            first_name: firstName,
                            family_name: familyName,
                            date_of_birth: dateBirth,
                            date_of_death: dateDeath
                        });

                apiResponse
                    .then(() => {
                        if (isUpdating) {
                            history.push(`/author/detail/${id}`, { 'updated': `Author ${firstName} ${familyName} updated successfully` });
                        } else {
                            toggleSaved();
                            setFirstName('');
                            setFamilyName('');
                            setDateBirth('');
                            setDateDeath('');
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
        [id, firstName, familyName, dateBirth, dateDeath, history, isUpdating, toggleSaved]
    );

    useEffect(() => {
        if (props.history.location.state) {
            setIsUpdating(true);
            setId(props.history.location.state.id);
            setFirstName(props.history.location.state.firstName);
            setFamilyName(props.history.location.state.familyName);
            setDateBirth(props.history.location.state.dateBirth);
            setDateDeath(props.history.location.state.dateDeath);
        }
    }, [props]);

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