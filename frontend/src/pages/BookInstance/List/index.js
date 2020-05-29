import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { Page, Layout, Link, ResourceList, ResourceItem, TextContainer, TextStyle } from '@shopify/polaris';

import api from '../../../services/api';

const List = () => {

    const [bookInstances, setBookInstances] = useState([]);

    const colorStatus = (status) => {
        let color = '#50B83C';

        if (status === 'Maintenance') color = '#C4CDD5';
        else if (status === 'Loaned') color = '#DE3618';
        else if (status === 'Reserved') color = '#F49342';

        return <span style={{ color: color }}>{status}</span>
    }

    useEffect(() => {
        api
            .get('/catalog/bookInstances')
            .then(res => {
                setBookInstances(res.data.bookinstance_list);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, []);

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
                                            <TextStyle variation="strong">Status: {colorStatus(item.status)}</TextStyle>
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
            </Layout>
        </Page>
    );
}

export default List;