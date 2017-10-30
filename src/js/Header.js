import React from 'react';
import {Navbar, Nav, NavDropdown, MenuItem, Col} from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import cookies from 'js-cookie';

class Header extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.navigatorUpdate();

  }

  render() {
    return (
      <Col xs={12} className="colFull">
      <Navbar
        staticTop
        componentClass="header"
        className="bs-docs-nav noMarginBottom colFull navbar-header-cus"
        role="banner"
        fluid>
     <Col xs={1} className='colFull' style={{minWidth:'300px'}}>
         <Navbar.Header>
          <a href='/main'>
           <Navbar.Brand>
               <FormattedMessage id="appTitle" defaultMessage="ITSMA SUITE"/>
           </Navbar.Brand>
          </a>
         </Navbar.Header>

      </Col> 
        <Col  className="nav-cus" >
            <Nav pullRight>
              <NavDropdown eventKey={1} title={cookies.get('user') || 'DEV'} id="basic-nav-dropdown">
                  <MenuItem eventKey={1.1} href="/sma-auth/goodbye.jsp"><FormattedMessage id="logout" defaultMessage="Logout"/></MenuItem>
              </NavDropdown>
          </Nav>
       </Col>
      </Navbar>

      </Col>
    );
  }
}

Header.defaultProps = {};

export default Header;
