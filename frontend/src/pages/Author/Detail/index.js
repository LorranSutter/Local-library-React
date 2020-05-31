import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Page, Layout, Card, ResourceList, ResourceItem, TextContainer, TextStyle, ButtonGroup, Button, Modal, Toast } from '@shopify/polaris';

import moment from 'moment';

import api from '../../../services/api';

const Detail = (props) => {

    const history = useHistory();

    const [firstName, setFirstName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [dateBirth, setDateBirth] = useState('');
    const [dateDeath, setDateDeath] = useState('');
    const [authorBooks, setAuthorBooks] = useState([]);
    const [activeModal, setActiveModal] = useState(false);
    const [updatedMsg, setUpdatedMsg] = useState('');
    const [showUpdatedToast, setShowUpdatedToast] = useState(false);

    const formattedDate = `${dateBirth ? moment(dateBirth).format('LL') : ''} - ${dateDeath ? moment(dateDeath).format('LL') : ''}`;

    const handleToggleModal = useCallback(() => setActiveModal(!activeModal), [activeModal]);

    const toggleUpdated = useCallback(() => setShowUpdatedToast((showUpdatedToast) => !showUpdatedToast), []);
    const toastUpdated = showUpdatedToast ? (
        <Toast content={updatedMsg} onDismiss={toggleUpdated} />
    ) : null;

    const handleUpdated = useCallback(() => {
        if (props.history.location.state) {
            setUpdatedMsg(props.history.location.state.updated);
            toggleUpdated();
            props.history.replace({ state: undefined });
        }
    }, [props, toggleUpdated]);

    const handleDelete = useCallback(() => {
        try {
            api
                .delete(`/catalog/author/${props.match.params.id}`)
                .then((res) => {
                    if (res.status === 200) {
                        history.push('/authors', { 'deleted': `Author ${firstName} ${familyName} deleted successfully` });
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                    // TODO handle api error
                })
        } catch (error) {

        }
    }, [props, history, firstName, familyName]);

    const handleUpdate = useCallback(() => {
        history.push('/author/create', {
            'id': props.match.params.id,
            'firstName': firstName,
            'familyName': familyName,
            'dateBirth': moment(dateBirth).format('YYYY-MM-DD'),
            'dateDeath': moment(dateDeath).format('YYYY-MM-DD')
        });
    }, [history, firstName, familyName, dateBirth, dateDeath, props]);

    useEffect(() => {
        handleUpdated()
        api
            .get(`/catalog/author/${props.match.params.id}`)
            .then(res => {
                setFirstName(res.data.author.first_name);
                setFamilyName(res.data.author.family_name);
                setDateBirth(res.data.author.date_of_birth);
                setDateDeath(res.data.author.date_of_death);
                setAuthorBooks(res.data.author_books);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [props, handleUpdated]);

    return (
        <Page title={`Author: ${familyName}, ${firstName}`} subtitle={formattedDate}>
            <Layout>
                <Layout.Section>
                    <Card sectioned title="Copies">
                        {authorBooks && !authorBooks.length ?
                            'This author has no books' :
                            <ResourceList
                                items={authorBooks}
                                renderItem={
                                    (item) => {
                                        return (
                                            <ResourceItem
                                                id={item._id}
                                                url={`/book/detail/${item._id}`}
                                            >
                                                <h3>
                                                    <TextStyle variation="strong">{item.title}</TextStyle>
                                                </h3>
                                                <p>
                                                    {item.summary}
                                                </p>
                                            </ResourceItem>
                                        )
                                    }
                                }
                            />
                        }
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <ButtonGroup>
                        <Button onClick={handleUpdate}>Update</Button>
                        <Button destructive onClick={handleToggleModal}>Delete</Button>
                    </ButtonGroup>
                </Layout.Section>
            </Layout>
            <Modal
                open={activeModal}
                onClose={handleToggleModal}
                primaryAction={{
                    content: 'Delete',
                    onAction: handleDelete,
                    destructive: true
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: handleToggleModal,
                    },
                ]}
            >
                <Modal.Section>
                    <TextContainer>
                        Do you really want to delete this author <TextStyle variation="strong">{`${firstName} ${familyName}`}</TextStyle>?
                    </TextContainer>
                </Modal.Section>
            </Modal>
            {toastUpdated}
        </Page>
    );
}

export default Detail;