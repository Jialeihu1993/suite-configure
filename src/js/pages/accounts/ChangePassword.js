import React, { Component } from 'react';
import { Form, FormGroup, FormControl, Col, Button, Breadcrumb, InputGroup, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { updateAdminProperty, changePassword, updateAdminPropertyOld, clearChangePassResult } from '../../actions/accounts';
import { changeCurrentNav } from '../../actions/changeNav';
import MessageDialog from '../../components/MessageDialog/index';
import {browserHistory } from 'react-router';
import getImgPath from '../../util/images';
import {cipher} from '../../util/cipher';
import {AES,TOKEN} from '../../constants/Constants';
import LoadingPage from '../../components/LoadingPage/index';

let navConfirmed = false;
const regexP = /(?=.*[\x30-\x39])(?=.*[\x41-\x5a])(?=.*[\x61-\x7a])(?=.*[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e])[\x21-\x7e]{10,30}/;

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oPValidation: null,
      nPValidation: null,
      nPStatu: false,
      cNPValidation: null,
      cNPStatu: false,
      disabled: true,
      showModalConfirm: false
    };
  }

  componentDidMount() {
    // todo: add validation
    // load initial data here
    this.checkPNotice.style.display = 'none';
    this.confirmPNotice.style.display = 'none';
    this.confirmOpNull.style.display = 'none';
    this.confirmNpNull.style.display = 'none';
    this.confirmCpNull.style.display = 'none';

    this.props.dispatch(changeCurrentNav({
      propName: 'currentNav',
      value: 'Admin'
    }));
    this.checkPNotice.style.color = '#cccccc';
    this.checkPNotice.style.display = 'block';
    this.props.router.setRouteLeaveHook(this.props.route, nextLocation => {
      if (navConfirmed) {
        navConfirmed = false;
        return true;
      }

      if (!(this.state.oPValidation == null && this.state.nPValidation == null && this.state.cNPValidation == null)) {
        this.setState({ showModalConfirm: true, nextLocation: nextLocation });
        return false;
      } else {
        return true;
      }
    });

  }

  buttonHander() {
    return (
      this.state.oPValidation == null && this.state.nPValidation == null && this.state.cNPValidation == null && !this.state.disabled
    );
  }

  _checkPasswordHandler(event) {
    var targetValue = event.target.value;
    if (targetValue.search(regexP) != -1) {
      this.checkPNotice.style.display = 'none';
      this.setState({ nPValidation: null, nPStatu: true });

    } else {
      //  first  display confirmNpNull
      this.confirmNpNull.style.display = 'none';
      this.checkPNotice.style.display = 'block';
      this.setState({ nPValidation: 'error', nPStatu: false });
    }

    var cPValue = this.checkPasswordConfirm.value;
    if (cPValue.search(regexP) != -1 && cPValue == targetValue) {
      this.confirmPNotice.style.display = 'none';
      this.setState({ cNPValidation: null, disabled: false, cNPStatu: true });
    } else {
      this.confirmCpNull.style.display = 'none';
      this.confirmPNotice.style.display = 'block';
      this.confirmPNotice.style.color = '#FF454F';
      this.setState({ cNPValidation: 'error', cNPStatu: false });
    }

  }

  _saveOldPasswordHandler(event) {

    this.props.dispatch(updateAdminPropertyOld({
      propName: 'password', // todo: remove hard code
      value: event.target.value
    }));

  }

  _confirmPasswordHandler(event) {
    var cPValue = event.target.value;
    var nPValue = this.checkPassword.value;

    if (cPValue.search(regexP) != -1 && cPValue == nPValue) {
      this.confirmPNotice.style.display = 'none';

      this.setState({ cNPValidation: null, disabled: false, cNPStatu: true });

      this.props.dispatch(updateAdminProperty({
        propName: 'password', // todo: remove hard code
        value: event.target.value
      }));

    } else {
      this.confirmCpNull.style.display = 'none';
      this.confirmPNotice.style.display = 'block';
      this.confirmPNotice.style.color = '#FF454F';
      this.setState({ cNPValidation: 'error', cNPStatu: false });

    }
  }


  onBlurHander(event, obj) {
    if (event.target.value == '') {
      if (obj == 'confirmOpNull') {
        this.confirmOpNull.style.display = 'block';
        this.confirmOpNull.style.color = '#FF454F';
        this.setState({ oPValidation: 'error' });
      }

      if (obj == 'confirmNpNull') {
        this.checkPNotice.style.display = 'none';
        this.confirmNpNull.style.display = 'block';
        this.confirmNpNull.style.color = "#FF454F";
        this.setState({ nPValidation: 'error' });
      }

      if (obj == 'confirmCpNull') {
        this.confirmPNotice.style.display = 'none';
        this.confirmCpNull.style.display = 'block';
        this.confirmCpNull.style.color = "#FF454F";
        this.setState({ cNPValidation: 'error' });
      }

    } else {
      if (obj == 'confirmOpNull') {
        this.confirmOpNull.style.display = 'none';
        this.setState({ oPValidation: null });
      }
    }
  }
  _savePassword() {
    this.setState({isLoading:true});
    if (this.state.cNPValidation != 'error' && this.state.nPValidation != 'error') {
      this.props.dispatch(changePassword(cipher(AES,this.oldPassword.value,TOKEN), cipher(AES,this.checkPassword.value,TOKEN)));
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isLoading == false){
        this.setState({isLoading:false});
    }
  }

  // when modal click yes
  _warnYesHandler() {
    navConfirmed = true;
    this.setState({ showModalConfirm: false });
    browserHistory.push(this.state.nextLocation.pathname);
  }
  // when modal click no
  _warnNoHandler() {
    this.setState({ showModalConfirm: false });
  }

  closeModal(){
    this.props.dispatch(clearChangePassResult());
  }

  render() {
    let admin = this.props.admin;
    let Addon = InputGroup.Addon;

    let isLoading = this.state.isLoading;

    let isDialogShow = false;
    let title = "";
    let content = "";
    let buttons = "";
    let changeResult = this.props.admin.changePasswordResult;
    if(changeResult){
      isDialogShow = true;
      if(changeResult.idm && changeResult.sm){
        if(changeResult.idm.code == "200" && changeResult.sm.code == "200"){
          title = <div><Image  src={getImgPath('Ok_32px.png')} /><FormattedMessage id="update.succeeded" defaultMessage="Update successed!"/></div>;
          content = <FormattedMessage id="change.password.succeeded" defaultMessage="Change password succeeded." />;
        }else{
          title = <div><Image  src={getImgPath('Error_32px.png')} /><FormattedMessage id="update.failed" defaultMessage="Update failed!"/></div>;
          content = <FormattedMessage id="change.password.failed" defaultMessage="Change password failed." />;
        }
      }else{
          title = <div><Image  src={getImgPath('Error_32px.png')} /><FormattedMessage id="update.failed" defaultMessage="Update failed!"/></div>;
          content = <FormattedMessage id="change.password.failed" defaultMessage="Change password failed." />;
        }
    buttons =  <Button onClick={(event)=>this.closeModal(event)} ><FormattedMessage id="ok" defaultMessage="OK"/> </Button>;
    }

    return (
      <div>
         <Breadcrumb className="breadcrumbCus">
              <Breadcrumb.Item href='/itsmaconfig'>
                <FormattedMessage id="breadcrumbs.operation" defaultMessage='Operation' />
              </Breadcrumb.Item>
              <Breadcrumb.Item active>
                <FormattedMessage id="breadcrumbs.changePassword" defaultMessage='Change Password' />
              </Breadcrumb.Item>
        </Breadcrumb>
       <Col xs={12}>
        <Col xs={12} >
      <Form horizontal>
            <FormGroup>
              <Col xs={12}>
                <Col xs={6}><span
                  className="titleBig"><FormattedMessage id="admin.changePassword" defaultMessage='Change Password for "sysadmin"' /></span>
                </Col>
              </Col>
              <Col xs={12}>
                <hr />
              </Col>

              <Col xs={12}>
                <Col xs={12} >
                  <span><FormattedMessage id="admin.showInfo" defaultMessage="Change password for the out-of-box user named sysadmin,which has full administrator privileges." /></span>
                </Col>
              </Col>
              
            </FormGroup>

            <Col xs={12} className='colFullLeft'  style={{minHeight:'160px'}}>
              <Col xs={6} className='colFullLeft'>
                <FormGroup className='cusMargin30' validationState={this.state.oPValidation}>
                  <Col xs={12}>
                    <Col xs={12} className="cusMargin17"><span className="inputTitle"><FormattedMessage id="admin.oldPassword" defaultMessage="Old Password" /></span><span className="manatory">*</span></Col>
                    <Col xs={12} >
                      <FormControl inputRef={oldPassword => {this.oldPassword = oldPassword}}  maxLength='128' maxLength='128' onChange={(event) => this._saveOldPasswordHandler(event)} type="password" onBlur={(event) => this.onBlurHander(event, 'confirmOpNull')} className={this.state.oPValidation == 'error' ? 'input-cus' : ''} />
                    </Col>
                    <Col md={12} className="pull-right" ><span className="warnColor" ref={(confirmOpNull) => this.confirmOpNull = confirmOpNull}><FormattedMessage id='validation.null' defaultMessage='Please provide a value for this field' /></span> </Col>
                  </Col>

                </FormGroup>

              </Col>

              <Col xs={6} >
                <FormGroup className="cusMargin30"  validationState={this.state.nPValidation}>
                  <Col xs={12} className="colFullRight" >
                    <Col xs={12} className="cusMargin17"><span className="inputTitle"><FormattedMessage id="admin.password" defaultMessage="New Password" /></span><span className="manatory">*</span></Col>
                    <Col xs={12}>

                      <FormControl  maxLength='128' maxLength='128' type="password" id="new"
                        inputRef={checkPassword => { this.checkPassword = checkPassword; }} className={this.state.nPStatu ? 'input-ok' : this.state.nPValidation == 'error' ? 'input-cus' : ''}
                        onChange={(event) => this._checkPasswordHandler(event)} onBlur={(event) => this.onBlurHander(event, 'confirmNpNull')} />
                    </Col>

                    <Col xs={12} className="pull-right" ><span className="warnColor" ref={(confirmNpNull) => this.confirmNpNull = confirmNpNull}><FormattedMessage id='validation.null' defaultMessage='Please provide a value for this field' /></span> </Col>

                    <Col xs={12} >
                      <span  ref={(checkPNotice) => { this.checkPNotice = checkPNotice }}>
                          <FormattedMessage id="admin.newPasswordCheckInfo" defaultMessage="The password must be 10 to 30 characters in length and contain all of the following characters: uppercase letters, lower case letters, numbers, and special characters." /></span>
                    </Col>
                  </Col>
                </FormGroup>
              </Col>

            </Col>

            <Col xs={12} className="colFullLeft" style={{minHeight:'115px'}}>
              <Col xs={6} className="colFullLeft">
                <FormGroup className="cusMargin30" validationState={this.state.cNPValidation}>
                  <Col xs={12}>
                    <Col xs={12} className="cusMargin17"><span className="inputTitle"><FormattedMessage id="admin.confirmPassword" defaultMessage="Confirm New Password" /></span><span className="manatory">*</span></Col>
                    <Col xs={12}>
                      <FormControl  maxLength='128' maxLength='128' maxLength='128' type="password" id="confirm" className={this.state.cNPStatu ? 'input-ok' : this.state.cNPValidation == 'error' ? "input-cus" : ""}
                     inputRef={checkPasswordConfirm => { this.checkPasswordConfirm = checkPasswordConfirm; }}      onChange={(event) => this._confirmPasswordHandler(event)} onBlur={(event) => this.onBlurHander(event, 'confirmCpNull')} />
                    </Col>

                    <Col xs={12} className="pull-right" ><span className="warnColor" ref={(confirmCpNull) => this.confirmCpNull = confirmCpNull}><FormattedMessage id='validation.null' defaultMessage='Please provide a value for this field' /></span> </Col>

                    <Col xs={12} >
                      <span className="warnColor" ref={(confirmPNotice) => this.confirmPNotice = confirmPNotice}><FormattedMessage id="admin.password.notMatch" defaultMessage="Passwords don't match!" /></span>
                    </Col>
                  </Col>
                </FormGroup>
              </Col>
            </Col>

            <FormGroup className="cusMargin30">
              <Col xs={12}>
                <Col xs={12} >
                  {this.buttonHander() ? <Button bsClass="btn pull-left" onClick={() => this._savePassword()} ><FormattedMessage id="save" defaultMessage="Update" /></Button> :
                    <Button bsClass="btn pull-left" onClick={() => this._savePassword()} disabled><FormattedMessage id="save" defaultMessage="Update" /></Button>
                  }
                  <MessageDialog show={isDialogShow} type="error" title={title} buttons={buttons} >
                  {content}
                  </MessageDialog>
                  <MessageDialog show={this.state.showModalConfirm} type="warning"  children={<FormattedMessage id='warning' defaultMessage='Are you sure you want to leave this page?  Your unsaved work will be lost. ' />} warnYesHandler={() => this._warnYesHandler()} warnNoHandler={() => this._warnNoHandler()} />
                  <LoadingPage show={isLoading} />
                </Col>
              </Col>
            </FormGroup>
          </Form>
          </Col>
        </Col>
      </div>
    );
  }
}

let select = (state, props) => {
  return {
    admin: state.accounts.admin,
    isLoading: state.accounts.isLoading
  };
}

export default connect(select)(ChangePassword);