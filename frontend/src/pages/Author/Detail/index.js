import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Page, Layout, Card, ResourceList, ResourceItem, TextContainer, TextStyle, ButtonGroup, Button, Modal } from '@shopify/polaris';

import api from '../../../services/api';

const Detail = ({ match }) => {

    const history = useHistory();

    const [name, setName] = useState('')
    const [authorBooks, setAuthorBooks] = useState([]);
    const [activeModal, setActiveModal] = useState(false);

    const handleToggleModal = useCallback(() => setActiveModal(!activeModal), [activeModal]);

    const handleDelete = useCallback(() => {
        try {
            api
                .delete(`/catalog/author/${match.params.id}`)
                .then((res) => {
                    if (res.status === 200) {
                        history.push('/authors', { 'deleted': `Author ${name} deleted successfully` });
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                    // TODO handle api error
                })
        } catch (error) {

        }
    }, [match.params.id, history, name]);

    useEffect(() => {
        api
            .get(`/catalog/author/${match.params.id}`)
            .then(res => {
                setName(`${res.data.author.family_name}, ${res.data.author.first_name}`);
                setAuthorBooks(res.data.author_books);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [match]);

    return (
        <Page title={`Author: ${name}`}>
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
                        <Button>Update</Button>
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
                        Do you really want to delete this author <TextStyle variation="strong">{name}</TextStyle>?
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </Page>
    );
}

export default Detail;