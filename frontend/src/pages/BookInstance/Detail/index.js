import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import { Page, Layout, Card, TextContainer, TextStyle, Link } from '@shopify/polaris';

import api from '../../../services/api';

const Detail = ({ match }) => {

    const [id, setId] = useState('')
    const [bookInstance, setBookInstance] = useState([]);
    const [book, setBook] = useState([]);

    const colorStatus = (status) => {
        let color = '#50B83C';

        if (status === 'Maintenance') color = '#C4CDD5';
        else if (status === 'Loaned') color = '#DE3618';
        else if (status === 'Reserved') color = '#F49342';

        return <span style={{ color: color }}>{status}</span>
    }

    useEffect(() => {
        api
            .get(`/catalog/bookinstance/${match.params.id}`)
            .then(res => {
                setId(res.data.bookinstance._id);
                setBookInstance(res.data.bookinstance);
                setBook(res.data.bookinstance.book);
            })
            .catch(err => {
                console.log(err)
                // TODO handle api error
            });

    }, [match]);

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
                            <TextStyle variation="strong">Status: {colorStatus(bookInstance.status)}</TextStyle>
                        </TextContainer>
                        <TextContainer>
                            <TextStyle variation="strong">Due back: </TextStyle>
                            <Moment format="LL">{bookInstance.due_back}</Moment>
                        </TextContainer>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

export default Detail;