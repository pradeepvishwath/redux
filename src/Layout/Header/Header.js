import "./Header.css";

import React from "react";
// import download from "../Assets/Imgs/download.png";
import NavDropdown from "react-bootstrap/NavDropdown";
// import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from 'react-router-dom';

export function Header() {
  return (

<div>
      <nav className="navbar navbar-bg navbar-expand-lg bg-warning text-dark p-3">
        <div className="container-fluid">
         <div className="d-flex">
           <NavLink to="/" className="navbar-brand text-light fs-2 text-dark ">
            <b>Crud operation</b>
          </NavLink>
          
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Hooks with API" id="basic-nav-dropdown">
                <NavDropdown.Item href="/Use state">Use State</NavDropdown.Item>
                <NavDropdown.Item href="/ReducerApiList">
                  Use Reducer
                </NavDropdown.Item>
                <NavDropdown.Item   href="/usecontextform" to="usecontextform">
                  Use Context
                </NavDropdown.Item>
                {/* <NavDropdown.Item   href="/Reduxtable" to="Reduxtable">
                  Redux
                </NavDropdown.Item>
                <NavDropdown.Item   href="/sagalist" to="sagalist">
                  Saga Api
                </NavDropdown.Item> */}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
              <ul className="nav-item d-flex">
           
              <li className="nav-item">
                <NavLink
                  className="nav nav-link mt-2 fs-5 text-dark pe-4 ps-2 dek"
                  to="/reduxform"
                >
                  Redux
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav nav-link mt-2 fs-5 text-dark dek"
                  to="/Sagaform"
                >
                  Saga
                </NavLink>
              </li>
              </ul>
          </div>
        </div>
      </nav>
    




      
      {/* <Navbar expand="lg" className="shadow bg-warning fixed-top navbar">
      <h1>CRUD OPERATION</h1>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Hooks with API" id="basic-nav-dropdown">
                <NavDropdown.Item href="/Use state">Use State</NavDropdown.Item>
                <NavDropdown.Item href="/ReducerApiList">
                  Use Reducer
                </NavDropdown.Item>
                <NavDropdown.Item   href="/usecontextform" to="usecontextform">
                  Use Context
                </NavDropdown.Item>
                <NavDropdown.Item   href="/Reduxtable" to="Reduxtable">
                  Redux
                </NavDropdown.Item>
                <NavDropdown.Item   href="/sagalist" to="sagalist">
                  Saga Api
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar> */}
    </div>
  );
}

// export default Header;
