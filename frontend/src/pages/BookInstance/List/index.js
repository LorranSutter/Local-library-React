import React, { useState, useEffect, useCallback } from 'react';
import Moment from 'react-moment';
import {
    Page,
    Layout,
    Link,
    ResourceList,
    ResourceItem,
    TextContainer,
    TextStyle,
    Toast
} from '@shopify/polaris';

import StatusColor from '../../../components/StatusColor';
import api from '../../../services/api';

const List = (props) => {

    const [bookInstances, setBookInstances] = useState([]);
    const [deletedMsg, setDeletedMsg] = useState('');
    const [showDeletedToast, setShowDeletedToast] = useState(false);

    const toggleDeleted = useCallback(() => setShowDeletedToast((showDeletedToast) => !showDeletedToast), []);
    const toastDeleted = showDeletedToast ? (
        <Toast content={deletedMsg} onDismiss={toggleDeleted} />
    ) : null;

    const handleDeleted = useCallback(() => {
        if (props.history.location.state) {
            setDeletedMsg(props.history.location.state.deleted);
            toggleDeleted();
            props.history.replace({ state: undefined });
        }
    }, [props.history, toggleDeleted]);

    useEffect(() => {
        handleDeleted();
        api
            .get('/catalog/bookInstances')
            .then(res => {
                setBookInstances(res.data.bookinstance_list);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [handleDeleted]);

    return (
        <Page title="Book instance list">
            <Layout>
                <Layout.Section>
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
                                            <TextStyle variation="strong">Title: </TextStyle>
                                            <Link url={`/book/detail/${item.book._id}`}>{item.book.title}</Link>
                                        </TextContainer>
                                        <TextContainer>
                                            <TextStyle variation="strong">Imprint: </TextStyle>
                                            {item.imprint}
                                        </TextContainer>
                                        <TextContainer>
                                            <TextStyle variation="strong">Status: <StatusColor status={item.status} /></TextStyle>
                                        </TextContainer>
                                        {item.status === 'Available' ? null :
                                            <TextContainer>
                                                <TextStyle variation="strong">Due back: </TextStyle>
                                                <Moment format="LL">{item.due_back}</Moment>
                                            </TextContainer>
                                        }
                                    </ResourceItem>
                                )
                            }
                        }
                    />
                </Layout.Section>
                {toastDeleted}
            </Layout>
        </Page>
    );
}

export default List;