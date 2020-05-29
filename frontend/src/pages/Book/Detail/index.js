import React, { useState, useEffect } from 'react';
import { Page, Layout, Card, ResourceList, ResourceItem, TextContainer, TextStyle, Link } from '@shopify/polaris';

import api from '../../../services/api';

const Detail = ({ match }) => {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [summary, setSummary] = useState('');
    const [isbn, setIsbn] = useState('');
    const [genre, setGenre] = useState([]);
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
                                                    <TextStyle variation="strong">Status: {colorStatus(item.status)}</TextStyle>
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
            </Layout>
        </Page>
    );
}

export default Detail;