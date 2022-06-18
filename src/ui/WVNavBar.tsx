import React, {useCallback, useRef} from "react";
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export const WVNavBar = () => {
    const navigate = useNavigate();
    const goHome = useCallback(() => {
        navigate('/');
    }, [navigate]);
    const goWeek = useCallback(() => {
        navigate('/week');
    }, [navigate]);
    const inputRef = useRef();

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
                    <input type='file' id="importFile" className='d-none' accept="text/csv,*.csv"/>
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
}