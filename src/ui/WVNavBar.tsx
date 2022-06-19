import React, {useCallback, useContext, useRef} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

import {DataContext} from "../context/DataContext";

export const WVNavBar = () => {
    const {parseRawData} = useContext(DataContext);
    const navigate = useNavigate();
    const goHome = useCallback(() => {
        navigate('/');
    }, [navigate]);
    const goWeek = useCallback(() => {
        navigate('/week');
    }, [navigate]);

    const readFile = useCallback((file: File): void => {
        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            if (typeof e.target !== 'undefined' && e.target !== null && typeof e.target.result === 'string') {
                parseRawData(e.target.result);
            }
        });
        reader.addEventListener('error', (err) => {
            console.error(err, file);
        });
        reader.readAsText(file, 'utf8');
    }, [parseRawData]);

    const importRawData = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        if (event.target.files !== null && event.target.files.length === 1) {
            readFile(event.target.files[0])
        }
    }, [readFile]);

    return (<Navbar bg="dark" className='bg-gradient mb-4' expand="lg">
        <Container fluid>
            <Navbar.Brand>WorkView</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link onClick={goHome}>Home</Nav.Link>
                    <Nav.Link onClick={goWeek}>Week</Nav.Link>
                </Nav>
                <Nav>
                    <label htmlFor="importFile">Import</label>
                    <input type='file' onChange={importRawData} id="importFile" className='d-none'
                           accept="text/csv,*.csv"/>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
}