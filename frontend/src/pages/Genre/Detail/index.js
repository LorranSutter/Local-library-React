import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Page,
    Layout,
    Card,
    ResourceList,
    ResourceItem,
    TextContainer,
    TextStyle,
    ButtonGroup,
    Button,
    Modal,
    Toast
} from '@shopify/polaris';

import api from '../../../services/api';

const Detail = (props) => {

    const history = useHistory();

    const [name, setName] = useState('')
    const [genreBooks, setGenreBooks] = useState([]);
    const [activeModal, setActiveModal] = useState(false);
    const [updatedMsg, setUpdatedMsg] = useState('');
    const [showUpdatedToast, setShowUpdatedToast] = useState(false);

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
                .delete(`/catalog/genre/${props.match.params.id}`)
                .then((res) => {
                    if (res.status === 200) {
                        history.push('/genres', { 'deleted': `Genre ${name} deleted successfully` });
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                })
        } catch (error) {
            throw new Error(error);
        }
    }, [props, history, name]);

    const handleUpdate = useCallback(() => {
        history.push('/genre/create', { 'id': props.match.params.id, 'name': name });
    }, [history, name, props]);

    useEffect(() => {
        handleUpdated();
        try {
            api
                .get(`/catalog/genre/${props.match.params.id}`)
                .then(res => {
                    setName(res.data.genre.name);
                    setGenreBooks(res.data.genre_books);
                })
                .catch(err => {
                    throw new Error(err);
                });
        } catch (error) {
            throw new Error(error);
        }

    }, [props, handleUpdated]);

    return (
        <Page title={`Genre: ${name}`}>
            <Layout>
                <Layout.Section>
                    <Card sectioned title="Copies">
                        {genreBooks && !genreBooks.length ?
                            'This genre has no books' :
                            <ResourceList
                                items={genreBooks}
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
                        Do you really want to delete this genre <TextStyle variation="strong">{name}</TextStyle>?
                    </TextContainer>
                </Modal.Section>
            </Modal>
            {toastUpdated}
        </Page>
    );
}

export default Detail;