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

import api from '../../../services/api';

const List = (props) => {

    const [authors, setAuthors] = useState([]);
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
            .get('/catalog/authors')
            .then(res => {
                setAuthors(res.data.author_list);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [handleDeleted]);

    return (
        <Page title="Author list">
            <Layout>
                <Layout.Section>
                    <ResourceList
                        items={authors}
                        renderItem={
                            (item) => {
                                return (
                                    <ResourceItem
                                        id={item._id}
                                        url={`/author/detail/${item._id}`}
                                    >
                                        <TextContainer>
                                            <TextStyle variation="strong">
                                                <Link key={item._id} url={`/author/detail/${item._id}`}>
                                                    {`${item.first_name} ${item.family_name}`}
                                                </Link>
                                            </TextStyle>
                                        </TextContainer>
                                        <TextContainer>
                                            {item.date_of_birth ? <Moment format="LL">{item.date_of_birth}</Moment> : ''}
                                            {' - '}
                                            {item.date_of_death ? <Moment format="LL">{item.date_of_death}</Moment> : ''}
                                        </TextContainer>
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