import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Page, Layout, Card, ResourceList, ResourceItem, TextContainer, TextStyle, Link, ButtonGroup, Button, Modal } from '@shopify/polaris';

import StatusColor from '../../../components/StatusColor';
import api from '../../../services/api';

const Detail = ({ match }) => {

    const history = useHistory();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [summary, setSummary] = useState('');
    const [isbn, setIsbn] = useState('');
    const [genre, setGenre] = useState([]);
    const [bookInstances, setBookInstances] = useState([]);
    const [activeModal, setActiveModal] = useState(false);

    const handleToggleModal = useCallback(() => setActiveModal(!activeModal), [activeModal]);

    const handleDelete = useCallback(() => {
        try {
            api
                .delete(`/catalog/book/${match.params.id}`)
                .then((res) => {
                    if (res.status === 200) {
                        history.push('/books', { 'deleted': `Book ${title} deleted successfully` });
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                    // TODO handle api error
                })
        } catch (error) {

        }
    }, [match.params.id, history, title]);

    useEffect(() => {
        api
            .get(`/catalog/book/${match.params.id}`)
            .then(res => {
                setTitle(res.data.book.title);
                setAuthor(res.data.book.author);
                setSummary(res.data.book.summary);
                setIsbn(res.data.book.isbn);
                setGenre(res.data.book.genre);
                setBookInstances(res.data.book_instances);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [match]);

    return (
        <Page title={title}>
            <Layout>
                <Layout.Section>
                    {/* TODO Format spacing */}
                    <Card sectioned title="Info">
                        <TextContainer>
                            <TextStyle variation="strong">Author: </TextStyle>
                            <Link url={`/author/detail/${author._id}`}>{`${author.family_name}, ${author.first_name}`}</Link>
                        </TextContainer>
                        <TextContainer>
                            <TextStyle variation="strong">Summary: </TextStyle>
                            {summary}
                        </TextContainer>
                        <TextContainer>
                            <TextStyle variation="strong">ISBN: </TextStyle>
                            {isbn}
                        </TextContainer>
                        <TextContainer>
                            <TextStyle variation="strong">Genre: </TextStyle>
                            {genre.map((item) => <Link key={item._id} url={`/genre/detail/${item._id}`}>{item.name} </Link>)}
                        </TextContainer>
                    </Card>

                    <Card sectioned title="Copies">
                        {bookInstances && !bookInstances.length ?
                            'This book has no copies' :
                            <ResourceList
                                items={bookInstances}
                                renderItem={
                                    (item) => {
                                        return (
                                            <ResourceItem
                                                id={item._id}
                                                url={`/bookinstance/detail/${item._id}`}
                                            >
                                                <TextContainer>
                                                    <TextStyle variation="strong">Status: <StatusColor status={item.status} /></TextStyle>
                                                </TextContainer>
                                                <TextContainer>
                                                    <TextStyle variation="strong">Imprint: </TextStyle>
                                                    {item.imprint}
                                                </TextContainer>
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
                        Do you really want to delete this book instance?
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </Page>
    );
}

export default Detail;