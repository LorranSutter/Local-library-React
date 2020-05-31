import React, { useState, useEffect, useCallback } from 'react';
import {
    Page,
    Layout,
    Link,
    ResourceList,
    ResourceItem,
    Toast
} from '@shopify/polaris';

import api from '../../../services/api';

const List = (props) => {

    const [genres, setGenres] = useState([]);
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
            .get('/catalog/genres')
            .then(res => {
                setGenres(res.data.genre_list);
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
                // TODO handle api error
            });

    }, [handleDeleted]);

    return (
        <Page title="Genre list">
            <Layout>
                <Layout.Section>
                    <ResourceList
                        items={genres}
                        renderItem={
                            (item) => {
                                return (
                                    <ResourceItem
                                        id={item._id}
                                        url={`/genre/detail/${item._id}`}
                                    >
                                        <Link key={item._id} url={`/genre/detail/${item._id}`}>{item.name}</Link>
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