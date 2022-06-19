import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Col, Container, Row, Spinner} from "react-bootstrap";

import type {DataContextParams} from "../../context/DataContext";
import {DataContext} from "../../context/DataContext";
import type {Handler, MessageEarningsList, Messages, RawObject, RequestData} from "../../types";
import {MessageParams, MessageTypes} from "../../types";

const isEarningsMessage = (message: Messages): message is MessageEarningsList => message[MessageParams.TYPE] === MessageTypes.EarningsListUpdate;

const TIME_4_WEEKS = 4 * 7 * 24 * 60 * 60 * 1000;
export const GeneralScreen = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<RawObject[]>([]);
    const {requestData, addListener, removeListener, ready} = useContext<DataContextParams>(DataContext);

    const loadData = useCallback<RequestData>((from: number, to: number) => {
        setLoading(true);
        requestData(from, to);
    }, [requestData, setLoading]);

    useEffect(() => {
        if (ready) {
            console.log('loading data');
            const NOW = Date.now();
            loadData(NOW - TIME_4_WEEKS, NOW);
        }
    }, [ready, loadData]);

    const updateTable = useCallback<Handler>((message) => {
        if (isEarningsMessage(message)) {
            setList(message[MessageParams.LIST].sort((a, b) => a.Date - b.Date));
            setLoading(false);
            console.log('ui message',);
        }

    }, [setList, setLoading]);

    useEffect(() => {
        addListener(MessageTypes.EarningsListUpdate, updateTable);
        return () => {
            removeListener(MessageTypes.EarningsListUpdate, updateTable);
        };
    }, [addListener, removeListener, loadData, updateTable])

    return (
        <Container fluid>
            {loading ? <Spinner animation="grow" variant="warning"/> : <Row>
                <Col>
                    {list.map((obj: RawObject, index: number) => <Row key={`${obj.Date}-${obj.Contract}`}>
                        <Col>{new Date(obj.Date).toISOString()}</Col>
                        <Col>{obj.Contract}</Col>
                        <Col>{obj.Minutes}</Col>
                        <Col>{obj.Amount}</Col>
                    </Row>)}
                </Col>
            </Row>}
        </Container>
    );
}