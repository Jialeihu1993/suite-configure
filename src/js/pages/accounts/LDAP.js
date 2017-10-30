import React, { Component } from 'react';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, Breadcrumb,Image } from 'react-bootstrap';
import validator from 'validator';
import Toggle from "../../components/Toggle/index";
import ContainerPanel from '../../components/ContainerPanel/index';
import { updateLDAPProperty, testLDAP, clearTestLDAPAction, ldapTestSuccess, ldapRevert} from '../../actions/accounts';
import { showError } from 'actions/message';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { changeCurrentNav } from '../../actions/changeNav';
import HomeApply from './../HomeApply';
import { Link } from 'react-router';
import { getRootPath,AES,TOKEN } from '../../constants/Constants';
import MessageDialog from '../../components/MessageDialog/index';
import { withRouter, browserHistory } from 'react-router';
import getImgPath from '../../util/images';
import {cipherPassword} from '../../util/cipher';
import LoadingPage from '../../components/LoadingPage/index';

let navConfirmed = false;

class LDAP extends Component {

  constructor(props) {
    super(props);
    this.state = {
      IpValidation: null,
      PortValidation: null,
      UserNameValidation: null,
      PasswordValidation: null,
      BaseDNValidation: null,
      UidNameValidation: null,
      showModal: false,
      showModalConfirm: false,
      applyStatus: false,
      isLoading: false,
      isChanged: false
    };
  }

  componentDidMount() {
    this.confirmIp.style.display = 'none';
    this.confirmPort.style.display = 'none';
    this.confirmIpNull.style.display = 'none';
    this.confirmPortNull.style.display = 'none';
    this.confirmUserNameNull.style.display = 'none';
    this.confirmPasswordNull.style.display = 'none';
    this.confirmBaseDNNull.style.display = 'none';
    this.confirmUidNameNull.style.display = 'none';
    this.props.dispatch(changeCurrentNav({
      propName: "currentNav",
      value: "LDAP"
    }));

    this.props.router.setRouteLeaveHook(this.props.route, nextLocation => {
      if (navConfirmed) {
        navConfirmed = false;
        return true;
      }

      if (!this.state.applyStatus && this.state.isChanged) {
        this.setState({ showModalConfirm: true, nextLocation: nextLocation });
        return false;
      } else {
        return true;
      }
    });


  }

  _onChange(event, fieldName) {
    // todo: need to involdate property change after focuse out of the field else there is too many events
    this.props.dispatch(updateLDAPProperty({
      propName: fieldName,
      value: event.target.value
    }));
    this.setState({ applyStatus: false ,isChanged:true});
  }

  _validate(event, obj) {
    var value = event.target.value;

    if (obj == 'port') {  // port validate
      this.confirmPortNull.style.display = 'none';
      if (validator.isInt(value,{min:1,max:65536})) {

        this.confirmPort.style.display = 'none';
        this.setState({ PortValidation: null });
      } else if (value != '') {

        this.confirmPort.style.display = 'block';
        this.confirmPort.style.color = "#FF454F";
        this.setState({ PortValidation: 'error' });

      } else {

        this.confirmPort.style.display = 'none';
        this.setState({ PortValidation: null });

      }
      
    }

    this._onChange(event, obj);

  }

  onBlurHander(event, obj) {
    if (validator.isEmpty(event.target.value)) {
      if (obj == 'confirmIpNull') {
        this.setValidatorStatus(this.confirmIpNull, true);
        this.setState({ IpValidation: 'error' });
      }
      if (obj == 'confirmPortNull') {
        this.setValidatorStatus(this.confirmPortNull, true);
        this.setState({ PortValidation: 'error' });
      }
      if (obj == 'confirmUserNameNull') {
        this.setValidatorStatus(this.confirmUserNameNull, true);
        this.setState({ UserNameValidation: 'error' });
      }
      if (obj == 'confirmPasswordNull') {
        this.setValidatorStatus(this.confirmPasswordNull, true);
        this.setState({ PasswordValidation: 'error' });
      }
      if (obj == 'confirmBaseDNNull') {
        this.setValidatorStatus(this.confirmBaseDNNull, true);
        this.setState({ BaseDNValidation: 'error' });
      }
      if (obj == 'confirmUidNameNull') {
        this.setValidatorStatus(this.confirmUidNameNull, true);
        this.setState({ UidNameValidation: 'error' });
      }

    } else {
      if (obj == 'confirmIpNull') {
        this.setValidatorStatus(this.confirmIpNull, false);
        this.setState({ IpValidation: null });
      }
      if (obj == 'confirmUserNameNull') {
        this.setValidatorStatus(this.confirmUserNameNull, false);
        this.setState({ UserNameValidation: null });
      }
      if (obj == 'confirmPasswordNull') {
        this.setValidatorStatus(this.confirmPasswordNull, false);
        this.setState({ PasswordValidation: null });
      }
      if (obj == 'confirmBaseDNNull') {
        this.setValidatorStatus(this.confirmBaseDNNull, false);
        this.setState({ BaseDNValidation: null });
      }
      if (obj == 'confirmUidNameNull') {
        this.setValidatorStatus(this.confirmUidNameNull, false);
        this.setState({ UidNameValidation: null });
      }
    }
  }

  _onToggleClickHandler(value, fieldName) {
    // todo: need to involdate property change after focuse out of the field else there is too many events
    this.props.dispatch(updateLDAPProperty({
      propName: fieldName,
      value: !value
    }));
  this.setState({ applyStatus: false ,isChanged:true});
  

  }

  // when modal click yes
  _warnYesHandler() {
    navConfirmed = true;
    this.props.dispatch(ldapRevert());
    this.setState({ showModalConfirm: false });
    browserHistory.push(this.state.nextLocation.pathname);
  }
  // when modal click no
  _warnNoHandler() {
    this.setState({ showModalConfirm: false });
  }

  _onTest(event) {
    this.setState({isLoading:true});
    this.props.dispatch(testLDAP(cipherPassword(AES, this.props.ldap, TOKEN)));
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isLoading == false){
        this.setState({isLoading:false});
    }
  }

  /**
   * Set validator element status(display or hidden)
   * @param element
   * @param status
   */
  setValidatorStatus(element, status) {
    if (status) {
      element.style.display = 'block';
      element.style.color = "#FF454F";
    } else {
      element.style.display = 'none';
    }
  }

  /**
   * render validator element in 'Col'
   * @param type
   * @param ref
   * @param message
   * @returns {XML}
   */
  renderValidatorCol(type, ref, message) {
    return (
      <Col className="pull-left">
        <span className="warnColor" ref={ref}>
          <FormattedMessage
            id={type}
            //defaultMessage="{name} is null!"
            defaultMessage="Please provide a value for this field"
            values={{ name: message }}
          />
        </span>
      </Col>
    );
  }

  buttonHandler() {
    return (
      this.state.IpValidation == null && this.state.PortValidation == null &&
      this.state.UserNameValidation == null && this.state.PasswordValidation == null &&
      this.state.BaseDNValidation == null && this.state.UidNameValidation == null
    );

  }

  closeModal(){
    this.props.dispatch(clearTestLDAPAction());
    if(this.props.ldap.testLDAPResult.code == "200"){
      this.props.dispatch(ldapTestSuccess());
    }
  }

  render() {
    // this.setState({ip:this.props.ip, port:this.props.port, userName:this.props.userName, baseDN:this.props.baseDN});
    let ldap = this.props.ldap;
    let status = this.props.status;
    let message = this.props.message;

    let isLoading = this.state.isLoading;

    let isDialogShow = false;
    let title = "";
    let content = "";     
    let buttons = "";
    if(this.props.ldap.testLDAPResult){
       isDialogShow = true;
       if(this.props.ldap.testLDAPResult.code == "200"){
          title = <div><Image  src={getImgPath('Ok_32px.png')} /><FormattedMessage id="test.succeeded" defaultMessage="Test successed!"/></div>;
          content = <FormattedMessage id='test.ldap.succeeded' defaultMessage='Test LDAP succeeded.' />;
              if(!this.state.applyStatus){
                   this.setState({ applyStatus: true });
              }
         // this.props.dispatch(ldapTestSuccess());

       }else{
          title = <div><Image  src={getImgPath('Error_32px.png')} /><FormattedMessage id="test.failed" defaultMessage="Test failed!"/></div>;
          content = <FormattedMessage id='test.ldap.failed' defaultMessage='Test LDAP failed.' />;
           if(this.state.applyStatus){
                this.setState({ applyStatus: false });
            }
       }
      buttons =  <Button onClick={(event)=>this.closeModal(event)} ><FormattedMessage id="ok" defaultMessage="OK"/> </Button>;
    }

    return (
      <div >
        <Breadcrumb className="breadcrumbCus">
          <Breadcrumb.Item href='/itsmaconfig'>
            <FormattedMessage id="breadcrumbs.configuration" defaultMessage="Configuration" />
              </Breadcrumb.Item>
          <Breadcrumb.Item href='#'>
            <FormattedMessage id="breadcrumbs.accounts" defaultMessage="Accounts" />
              </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <FormattedMessage id="breadcrumbs.ldap" defaultMessage="LDAP" />
              </Breadcrumb.Item>
        </Breadcrumb>
        <Col xs={12}>
          <Col xs={12}>
            <Col xs={12} >
              <Form horizontal>

                <FormGroup>
                  <Col xs={12} >
                    <Col xs={6} className="colFull"><span
                      className="titleBig"><FormattedMessage id="ldap.settings" defaultMessage="LDAP Configuration" /></span>
                    </Col>
                  </Col>
                  <Col xs={12} >
                    <hr />
                  </Col>
                </FormGroup>

                <FormGroup className="cusMargin30">
                  <Col xs={6} >
                    <FormGroup bsClass="cusMargin30" validationState={this.state.IpValidation}>
                      <Col xs={12} className='colFull cusMargin17'><span className="inputTitle"><FormattedMessage id="ldap.ip" defaultMessage="Hostname/IP Address" /></span><span className="manatory">*</span></Col>
                      <Col xs={12} className="colFull">
                        <FormControl   maxLength='128' maxLength='128' type="text" value={ldap.ip} bsStyle="success" className={this.state.IpValidation == 'error' ? 'input-cus' : ''}
                          onChange={(event) => this._validate(event, 'ip')} onBlur={(event) => this.onBlurHander(event, 'confirmIpNull')} />

                      </Col>
                      {this.renderValidatorCol('validation.match', (confirmIp) => this.confirmIp = confirmIp, <FormattedMessage id="ldap.ip" defaultMessage="Hostname/IP Address" />)}
                      {this.renderValidatorCol('validation.null', (confirmIpNull) => this.confirmIpNull = confirmIpNull, null)}
                      <Col className='pull-left' ><span >&nbsp;</span> </Col>
                    </FormGroup>
                  </Col>
                  <Col xs={6} >
                    <FormGroup bsClass="cusMargin30" validationState={this.state.PortValidation}>
                      <Col xs={12} className="colFull cusMargin17"><span className="inputTitle"><FormattedMessage id="ldap.port" defaultMessage="Port" /></span><span className="manatory">*</span></Col>
                      <Col xs={12} className="colFull">
                        <FormControl maxLength='128' maxLength='128' type="text" value={ldap.port} className={this.state.PortValidation == 'error' ? 'input-cus' : ''}
                          onChange={(event) => this._validate(event, 'port')} onBlur={(event) => this.onBlurHander(event, 'confirmPortNull')} />

                      </Col>
                      {this.renderValidatorCol('validation.port', (confirmPort) => this.confirmPort = confirmPort, null)}
                      {this.renderValidatorCol('validation.port', (confirmPortNull) => this.confirmPortNull = confirmPortNull, null)}
                    </FormGroup>
                  </Col>
                </FormGroup>

                <FormGroup className="cusMargin30">

                  <Col xs={6}>
                    <FormGroup bsClass="cusMargin30" validationState={this.state.UserNameValidation}>
                      <Col xs={12} className="colFull cusMargin17"><span className="inputTitle"><FormattedMessage id="ldap.userName" defaultMessage="User ID" /></span><span className="manatory">*</span></Col>
                      <Col xs={12} className="colFull">
                        <FormControl maxLength='128' maxLength='128' type="text" value={ldap.userName} className={this.state.UserNameValidation == 'error' ? 'input-cus' : ''}
                          onChange={(event) => this._onChange(event, 'userName')} onBlur={(event) => this.onBlurHander(event, 'confirmUserNameNull')} />

                      </Col>
                      {this.renderValidatorCol('validation.null', (confirmUserNameNull) => this.confirmUserNameNull = confirmUserNameNull, null)}
                      <Col className='pull-left' ><span >&nbsp;</span> </Col>
                    </FormGroup>
                  </Col>

                  <Col xs={6}>
                    <FormGroup bsClass="cusMargin30" validationState={this.state.PasswordValidation}>
                      <Col xs={12} className="colFull cusMargin17"><span className="inputTitle"><FormattedMessage id="ldap.password" defaultMessage="Password" /></span><span className="manatory">*</span></Col>
                      <Col xs={12} className="colFull">
                        <FormControl maxLength='128' maxLength='128' type="password" value={ldap.password} className={this.state.PasswordValidation == 'error' ? 'input-cus' : ''}
                          onChange={(event) => this._onChange(event, 'password')} onBlur={(event) => this.onBlurHander(event, 'confirmPasswordNull')}  />

                      </Col>
                      {this.renderValidatorCol('validation.null', (confirmPasswordNull) => this.confirmPasswordNull = confirmPasswordNull, null)}
                    </FormGroup>
                  </Col>

                </FormGroup>

                <FormGroup className="cusMargin30">

                  <Col xs={6}>
                    <FormGroup bsClass="cusMargin30" validationState={this.state.BaseDNValidation}>
                      <Col xs={12} className="colFull cusMargin17"><span className="inputTitle"><FormattedMessage id="ldap.baseDN" defaultMessage="Base DN" /></span><span className="manatory">*</span></Col>
                      <Col xs={12} className="colFull">
                        <FormControl maxLength='128' maxLength='128' type="text" value={ldap.baseDN} className={this.state.BaseDNValidation == 'error' ? 'input-cus' : ''}
                          onChange={(event) => this._onChange(event, 'baseDN')} onBlur={(event) => this.onBlurHander(event, 'confirmBaseDNNull')} />
                      </Col>
                      {this.renderValidatorCol('validation.null', (confirmBaseDNNull) => this.confirmBaseDNNull = confirmBaseDNNull, null)}
                      <Col className='pull-left' ><span >&nbsp;</span> </Col>
                    </FormGroup>
                  </Col>

                  <Col xs={6}>
                    <FormGroup bsClass="cusMargin30" validationState={this.state.UidNameValidation}>
                      <Col xs={12} className="colFull cusMargin17"><span className="inputTitle"><FormattedMessage id="ldap.uidName" defaultMessage="User Name Attribute" /></span><span className="manatory">*</span></Col>
                      <Col xs={12} className="colFull">
                        <FormControl maxLength='128' maxLength='128' type="text" value={ldap.uidName} className={this.state.UidNameValidation == 'error' ? 'input-cus' : ''}
                          onChange={(event) => this._onChange(event, 'uidName')} onBlur={(event) => this.onBlurHander(event, 'confirmUidNameNull')} />
                      </Col>
                      {this.renderValidatorCol('validation.null', (confirmUidNameNull) => this.confirmUidNameNull = confirmUidNameNull, null)}
                    </FormGroup>
                  </Col>

                </FormGroup>


                <FormGroup className="cusMargin30">
                  <Col xs={6} >
                    <Col className="pull-left"><span className="inputTitle"><FormattedMessage id="ldap.ssl" defaultMessage="Enable SSL" />:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    </Col>
                    <Col className="pull-left"><Toggle isToggleOn={ldap.ssl.toBoolean()}
                      onClickHandler={(value) => this._onToggleClickHandler(value, 'ssl')} /></Col>
                  </Col>

                </FormGroup>

                <FormGroup>
                  <Col xs={12} >
                    <hr />
                  </Col>
                </FormGroup>

                <FormGroup className="cusMargin30">
                  <Col xs={12} >
                    <Button disabled={!this.buttonHandler()} bsClass="btn pull-left" onClick={(event) => this._onTest(event)}><FormattedMessage id="test" defaultMessage="Test" /></Button>
                    <MessageDialog show={isDialogShow} type="error" title={title} buttons={buttons} >
                    {content}
                    </MessageDialog>
                    <MessageDialog show={this.state.showModalConfirm} type="warning" children={<FormattedMessage id='warning' defaultMessage='Are you sure you want to leave this page?  Your unsaved work will be lost. ' />} warnYesHandler={() => this._warnYesHandler()} warnNoHandler={() => this._warnNoHandler()} />
                    <HomeApply disabled={(!this.state.applyStatus)} />
                    <LoadingPage show={isLoading} />
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Col>
        </Col>

      </div>

    );
  }
}

let select = (state, props) => {
  return {
    ldap: state.accounts.ldap,
    isLoaded: state.accounts.isLoaded,
    isLoading: state.accounts.isLoading
  };
}

export default withRouter(connect(select)(LDAP));
