import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import {
    Page,
    Layout,
    Card,
    TextContainer,
    TextStyle,
    Link,
    ButtonGroup,
    Button,
    Modal,
    Toast
} from '@shopify/polaris';

import StatusColor from '../../../components/StatusColor';
import api from '../../../services/api';

const Detail = (props) => {

    const history = useHistory();

    const [id, setId] = useState('')
    const [bookInstance, setBookInstance] = useState([]);
    const [status, setStatus] = useState('');
    const [book, setBook] = useState([]);
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
                .delete(`/catalog/bookinstance/${props.match.params.id}`)
                .then((res) => {
                    if (res.status === 200) {
                        history.push('/bookinstances', { 'deleted': `Book Instance deleted successfully` });
                    }
                })
                .catch((err) => {
                    throw new Error(err);
                })
        } catch (error) {
            throw new Error(error);
        }
    }, [props, history]);

    const handleUpdate = useCallback(() => {
        history.push('/bookinstance/create', {
            'id': props.match.params.id,
            'book': book,
            'bookinstance': bookInstance
        });
    }, [history, book, bookInstance, props]);

    useEffect(() => {
        handleUpdated();
        try {
            api
                .get(`/catalog/bookinstance/${props.match.params.id}`)
                .then(res => {
                    setId(res.data.bookinstance._id);
                    setStatus(res.data.bookinstance.status.name);
                    setBookInstance(res.data.bookinstance);
                    setBook(res.data.bookinstance.book);
                })
                .catch(err => {
                    throw new Error(err);
                });
        } catch (error) {
            throw new Error(error);
        }

    }, [props, handleUpdated]);

    return (
        <Page title={`Id: ${id}`}>
            <Layout>
                <Layout.Section>
                    <Card sectioned title="Info">
                        <TextContainer>
                            <TextStyle variation="strong">Title: </TextStyle>
                            <Link url={`/book/detail/${book._id}`}>{book.title}</Link>
                        </TextContainer>
                        <TextContainer>
                            <TextStyle variation="strong">Imprint: </TextStyle>
                            {bookInstance.imprint}
                        </TextContainer>
                        <TextContainer>
                            <TextStyle variation="strong">Status: <StatusColor status={status} /></TextStyle>
                        </TextContainer>
                        <TextContainer>
                            <TextStyle variation="strong">Due back: </TextStyle>
                            <Moment format="LL">{bookInstance.due_back}</Moment>
                        </TextContainer>
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
                        Do you really want to delete this book instance?
                    </TextContainer>
                </Modal.Section>
            </Modal>
            {toastUpdated}
        </Page>
    );
}

export default Detail;