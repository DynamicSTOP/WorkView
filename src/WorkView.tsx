import React from 'react'
import {Container, Row} from "react-bootstrap";
import {HashRouter, Route, Routes} from "react-router-dom";

import {DataWrapper} from "./ui/DataWrapper";
import {GeneralScreen} from "./ui/screens/GeneralScreen";
import {RawDataScreen} from "./ui/screens/RawDataScreen";
import {WVNavBar} from "./ui/WVNavBar";

export const WorkView = () => (
    <DataWrapper>
        <HashRouter>
            <Container fluid>
                <Row><WVNavBar/></Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<GeneralScreen/>}/>
                        <Route path="/raw" element={<RawDataScreen/>}/>
                    </Routes>
                </Row>
            </Container>
        </HashRouter>
    </DataWrapper>
)
