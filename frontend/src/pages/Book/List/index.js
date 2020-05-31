import React, { useState, useEffect, useCallback } from 'react';
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

    const [books, setBooks] = useState([]);
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
            .get('/catalog/books')
            .then(res => {
                setBooks(res.data.book_list);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [handleDeleted]);

    return (
        <Page title="Book list">
            <Layout>
                <Layout.Section>
                    <ResourceList
                        items={books}
                        renderItem={
                            (item) => {
                                return (
                                    <ResourceItem
                                        id={item._id}
                                        url={`/book/detail/${item._id}`}
                                    >
                                        <TextContainer>
                                            <TextStyle variation="strong">
                                                <Link key={item._id} url={`/book/detail/${item._id}`}>{item.title}</Link>
                                            </TextStyle>
                                        </TextContainer>
                                        <TextContainer>
                                            {item.author ? `${item.author.family_name}, ${item.author.first_name}` : ''}
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