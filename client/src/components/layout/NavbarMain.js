import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav
} from 'reactstrap';

class NavbarMain extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {

    return (
      <Navbar color="light" light expand="md" className="mb-3">
        
        <Link to="/" className="navbar-brand">Quantum Web</Link>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>

          <Nav className="ml-auto" navbar>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default connect(null)(NavbarMain);