import React from 'react';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import {Col, Collapse} from 'react-bootstrap';
import { changeNavMode, changeCurrentNav } from './actions/changeNav';
import { BASE_NAME } from 'constants/ServiceConfig';
import { connect } from 'react-redux';

class Navigator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      'openFolder': {
        'config': true,
        'account': true,
        'debug': true,
        'operation': false
      }
    };
    this.linkRefs = [];
  }

  componentDidMount(){
     //this.navigatorUpdate();
  }

  componentDidUpdate() {
     this.navigatorUpdate();
  }

  navigatorUpdate(){
       // Maintain menu style when reducing navigation
    let name = this.props.nav.currentNav;
    let navMode = this.props.nav.navMode;
    if (name == 'LDAP' && navMode == 2) {
      this._onClickLinkHandler(0);
    }
    if (name == 'Email Server' && navMode == 2) {
      this._onClickLinkHandler(3);
    }
    if (name == 'Log Level' && navMode == 2) {
      this._onClickLinkHandler(2);
    }
    if (name == 'Admin' && navMode == 2) {
      this._onClickLinkHandler(1);
    }
    if (name == 'Smart Analytics' && navMode == 2) {
      this._onClickLinkHandler(4);
    }
  }

  _onClickHandler(name) {
    let openState = this.state.openFolder;
    openState[name] = !openState[name];
    if (openState[name]) {
      this[name].style.color = '#01A982';
    } else {
      this[name].style.color = '#333333';
    }

    this.setState({ openFolder: openState });
  }

  _onClickTitleHandler(name) {
    let openState = this.state.openFolder;
    if(name == 'config'){
      openState['operation'] = false;
    }else{
      openState['config'] = false;
    }
    openState[name] = !openState[name];
    this.setState({ openFolder: openState });
  }

  highLightStatus(name) {
    if (this.state.openFolder[name]) {
      return 'colFull mainTitle highLight';
    } else {
      return 'colFull mainTitle';
    }
  }

  dropDownStatus(name) {
    if (this.state.openFolder[name]) {
      this[name].firstChild.style.color = '#01A982';
    } else {
      this[name].firstChild.style.color = '#333333';
    }
  }


  _onClickBackIconHandler() {
    this.props.dispatch(changeNavMode({
      propName: 'navMode',
      value: 1
    }));
  }


  _returnWideMode() {
    this.props.dispatch(changeNavMode({
      propName: 'navMode',
      value: 2
    }));
  }

  _currentNavUpdate(name) {
    this.props.dispatch(changeCurrentNav({
      propName: 'currentNav',
      value: name
    }));
  }

  _onClickLinkHandler(position) {
    for (var i = 0; i < this.linkRefs.length; i++) {
      if (i == position) {
        this.linkRefs[i].firstChild.style.color = '#01A982';
      } else {
        this.linkRefs[i].firstChild.style.color = '#333333';
      }
    }
  }

  renderNav() {
    return (
        <Col style={{minWidth:this.props.navigatorWidth}} className="colFull newNav">

          <Col xs={12} className="colFull navCol">
            <Col xs={3}> </Col>
            <Col xs={7}></Col>
            <Col xs={2} className="colFull navBack"><span></span><span
                onClick={()=>this._onClickBackIconHandler()}></span></Col>
          </Col>

          <Col xs={12} className={this.highLightStatus('config')}>
            <Col xs={2}><span className="glyphicon glyphicon-triangle-bottom icon"
                             onClick={() => this._onClickTitleHandler('config')} > </span></Col>
            <Col xs={10} className="colFull"><span className="title" onClick={() => this._onClickTitleHandler('config')} ><FormattedMessage id="configuration"
                                                                                      defaultMessage="CONFIGURATION"/></span></Col>
          </Col>

          <Collapse in={this.state.openFolder['config']}>
            <div>
              <Col xs={12} className="itemTitle">
                
                <Col xs={3}><span className="glyphicon glyphicon-triangle-bottom icon"
                                  onClick={() => this._onClickHandler('account')}> </span></Col>
                <Col xs={9} onClick={() => this._onClickHandler('account')} className="colFull"><span
                    className="subTitle" ref={(account) => this.account = account}><FormattedMessage id="accounts"
                                                                                                     defaultMessage="Accounts"/></span></Col>
              </Col>
              <Collapse in={this.state.openFolder['account']}>
                <div>
                  <Col xs={12} className="colFull subItemTitle">
                    <Col xs={3}></Col>
                    <Col xs={9}><Link style={{ textDecoration: 'none' }} to={BASE_NAME + '/itsma/ldap'}><span
                        ref={(ldap) => this.linkRefs[0] = ldap}><FormattedMessage id="ldap"
                                                                                  defaultMessage="LDAP"/></span></Link></Col>
                  </Col>
                </div>
              </Collapse>
              <Col xs={12} className="itemTitle">
                <Col xs={3}><span className="glyphicon glyphicon-triangle-bottom icon"
                                  onClick={() => this._onClickHandler('debug')}> </span></Col>
                <Col xs={9} onClick={() => this._onClickHandler('debug')} className="colFull"><span className="subTitle"
                                                                                                    ref={(debug) => this.debug = debug}><FormattedMessage
                    id="debug" defaultMessage="Debug"/></span></Col>
                

              </Col>


              <Collapse in={this.state.openFolder['debug']}>
                <div>
                  <Col xs={12} className="colFull subItemTitle">
                    <Col xs={3}></Col>
                    <Col xs={9}> <Link style={{ textDecoration: 'none' }} to={BASE_NAME + '/debug/log'}><span
                        ref={(logLevel) => this.linkRefs[2] = logLevel}><FormattedMessage id="logLevel"
                                                                                          defaultMessage="Log Level"/></span></Link></Col>
                  </Col>
                </div>
              </Collapse>

              <Col xs={12} className="itemTitle">
                <Col xs={3}> </Col>
                <Col xs={9} className="colFull"><Link style={{ textDecoration: 'none' }}
                                                      to={BASE_NAME + '/itsma/email'}><span
                    ref={(emailServer) => this.linkRefs[3] = emailServer}><FormattedMessage id="email"
                                                                                            defaultMessage="Email Service"/></span></Link></Col>
              </Col>
            </div>
          </Collapse>
          <Col xs={12} className={this.highLightStatus('operation')}>
            <Col xs={2}><span className="glyphicon glyphicon-triangle-bottom icon"
                              onClick={() => this._onClickTitleHandler('operation')}> </span></Col>
            <Col xs={10} className="colFull"><span className="title"
                                                  onClick={() => this._onClickTitleHandler('operation')}><FormattedMessage
                id="operation" defaultMessage="OPERATION"/></span></Col>
          </Col>
          <Collapse in={this.state.openFolder['operation']}>
            <div>

              <Col xs={12} className="itemTitle">
                <Col xs={3}></Col>
                <Col xs={9} className="colFull"><Link style={{ textDecoration: 'none' }}
                                                      to={BASE_NAME + '/itsma/password'}><span
                    ref={(admin) => this.linkRefs[1] = admin}><FormattedMessage id="admin"  defaultMessage="Admin"/></span></Link></Col>
              </Col>

              <Col xs={12} className="itemTitle">
                <Col xs={3}></Col>
                <Col xs={9} className="colFull"><Link style={{ textDecoration: 'none' }}
                                                      to={BASE_NAME + '/operation/smarta'}><span
                    ref={(smartAnalytics) => this.linkRefs[4] = smartAnalytics}><FormattedMessage id="sma"
                                                                                                  defaultMessage="Smart Analytics"/></span></Link></Col>
              </Col>

            </div>
          </Collapse>

        </Col>

    );
  }

  renderNarrowMode() {
    return (
        <div className="NarrowMode">
          <Col style={{maxWidth:this.props.navigatorWidth}} className="colFull newNav">
            <Col xs={12} className="colFull navCol navForward">
              <span></span><span onClick={() => this._returnWideMode()}></span>
            </Col>
            <Col xsOffset={1} xs={10} className="seperator cusMarginBottom">
            </Col>
            <Col xs={12}>
              <span className="vertical"> <FormattedMessage id='menu' defaultMessage='Menu'  /> </span>
            </Col>
          </Col>
        </div>
    );
  }

  render() {
    const navMode = this.props.nav.navMode;
    return (
        navMode == 2 ? this.renderNav(): this.renderNarrowMode()
    );
  }
}

let select = (state) => {
  return {
    nav: state.navStyle.nav
  };
}

export default connect(select)(Navigator);