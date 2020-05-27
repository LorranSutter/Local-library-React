import React, { useState, useEffect } from 'react';
import { Page, Layout, ResourceList, ResourceItem } from '@shopify/polaris';

import api from '../../services/api';

const AuthorList = () => {

    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        api
            .get('/catalog/authors')
            .then(res => {
                setAuthors(res.data.author_list);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, []);

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
                                        url={`/catalog/author/${item._id}`}
                                    >
                                        {`${item.first_name} ${item.family_name} `}
                                        {/* {`${item.date_of_birth} ${item.date_of_death}`} */}
                                    </ResourceItem>
                                )
                            }
                        }
                    />
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default AuthorList;