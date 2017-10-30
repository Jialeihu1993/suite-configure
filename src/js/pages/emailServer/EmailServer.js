import React, { Component } from 'react';
import validator from 'validator';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, Breadcrumb, Image } from 'react-bootstrap';
import { PAGES, AES, TOKEN } from '../../constants/Constants';
import Toggle from "../../components/Toggle/index";
import { updateProperty, loadEmail, testSMTPServer, clearTestSMTPAction, smtpTestSuccess, smtpRevert} from '../../actions/email';
import { connect } from 'react-redux';
import HomeApply from './../HomeApply';
import { FormattedMessage } from 'react-intl';
import { changeCurrentNav } from '../../actions/changeNav';
import MessageDialog from '../../components/MessageDialog/index';
import { browserHistory } from 'react-router';
import getImgPath from '../../util/images';
import {cipherPassword} from '../../util/cipher';
import LoadingPage from '../../components/LoadingPage/index';

let navConfirmed = false;


const page = PAGES.EMAILSERVER;

class EmailServer extends Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            HostValidation: null,
            PortValidation: null,
            UserNameValidation: null,
            PasswordValidation: null,
            showModal: false,
            showModalConfirm: false,
            applyStatus: false,
            isLoading:false,
            testStatus:false,
            isChange:false
        };
    }

    componentDidMount() {
        if(!this.props.isLoaded){
            this.props.dispatch(loadEmail());
        }
        this.confirmPort.style.display = 'none';
        this.confirmUserName.style.display = 'none';
        this.confirmHostNull.style.display = 'none';
        this.confirmPortNull.style.display = 'none';
        this.confirmUserNameNull.style.display = 'none';
        this.confirmPasswordNull.style.display = 'none';
        this.props.dispatch(changeCurrentNav({
            propName: 'currentNav',
            value: 'Email Server'
        }));
        this.props.router.setRouteLeaveHook(this.props.route, nextLocation => {
            if (navConfirmed) {
                navConfirmed = false;
                return true;
            }

            if ((!this.state.applyStatus) && this.state.isChange) {
                this.setState({ showModalConfirm: true, nextLocation: nextLocation });
                return false;
            } else {
                return true;
            }
        });

        if(this.host.value!=''&& this.port.value!=''){
            this.setState({testStatus:true});
        }
    }

    _onChange(event, name) {
        this.props.dispatch(updateProperty({
            page: page,
            propName: name,
            value: event.target.value
        }));
         if(this.host.value!=''&& this.port.value!=''){
             this.setState({ applyStatus: false ,testStatus:true, isChange:true});
         }else{
             this.setState({ applyStatus: false , isChange:true});
         }
    }

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

    _onTest() {
        this.setState({isLoading:true});
        this.props.dispatch(testSMTPServer(cipherPassword(AES, this.props.email, TOKEN)));
    }
    componentWillReceiveProps(nextProps){
       if(nextProps.isLoading == false){
           this.setState({isLoading:false});
       }
    }

    _onToggleClickHandler(value, fieldName) {
        this.props.dispatch(updateProperty({
            page: page,
            propName: fieldName,
            value: !value
        }));

        this.setState({ applyStatus: false ,testStatus:true, isChange:true});
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
                this.confirmPort.style.color = '#FF454F';
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
            if (obj == 'confirmHostNull') {
                this.confirmHostNull.style.display = 'block';
                this.confirmHostNull.style.color = '#FF454F';
                this.setState({ HostValidation: 'error' });
            }
            if (obj == 'confirmPortNull') {
                this.confirmPortNull.style.display = 'block';
                this.confirmPortNull.style.color = '#FF454F';
                this.setState({ PortValidation: 'error' });
            }  
        } else {
            if (obj == 'confirmHostNull') {
                this.confirmHostNull.style.display = 'none';
                this.setState({ HostValidation: null });
            }
          
        }
    }

    // when modal click yes
    _warnYesHandler() {
        navConfirmed = true;
        this.props.dispatch(smtpRevert());
        this.setState({ showModalConfirm: false });
        browserHistory.push(this.state.nextLocation.pathname);
    }
    // when modal click no
    _warnNoHandler() {
        this.setState({ showModalConfirm: false });
    }

    buttonHander() {
        return (
            this.state.HostValidation == null && this.state.PortValidation == null && this.state.testStatus
        );
    }

  closeModal(){
      if(this.props.email.testSMTPResult.code == "200"){
          this.props.dispatch(smtpTestSuccess());
      }
       this.props.dispatch(clearTestSMTPAction());
  }

    render() {
        let email = this.props.email;
        let isLoading = this.state.isLoading;

        let isDialogShow = false;
        let title = "";
        let content = "";
        let buttons = "";
        if(this.props.email.testSMTPResult){
            isDialogShow = true;
            if(this.props.email.testSMTPResult.code == "200"){
                title = <div><Image  src={getImgPath('Ok_32px.png')} /><FormattedMessage id="test.succeeded" defaultMessage="Test successed!"/></div>;
                content = <FormattedMessage id='test.email.succeeded' defaultMessage='Test SMTP Server succeeded.' />;
                if(!this.state.applyStatus){
                     this.setState({ applyStatus: true });
                }
            }else{
                title = <div><Image  src={getImgPath('Error_32px.png')} /><FormattedMessage id="test.failed" defaultMessage="Test failed!"/></div>;
                content =<FormattedMessage id='test.email.failed' defaultMessage='Test SMTP Server failed.' />;
                if(this.state.applyStatus){
                     this.setState({ applyStatus: false });
                }
            }
            buttons =  <Button onClick={(event)=>this.closeModal(event)} ><FormattedMessage id="ok" defaultMessage="OK"/> </Button>;
        }
        
        return (
            <div >
                <Breadcrumb className='breadcrumbCus'>
                    <Breadcrumb.Item href='/itsmaconfig'>
                        <FormattedMessage id="breadcrumbs.configuration" defaultMessage="Configuration" />
                </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        <FormattedMessage id="breadcrumbs.email" defaultMessage="Email Server" />
                </Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12}>
                    <Col xs={12}>
                        <Form horizontal>
                            <Col xs={12}>
                                <FormGroup>
                                    <Col xs={12} >
                                        <Col xs={6} className='colFull'><span
                                            className='titleBig'><FormattedMessage id='email' defaultMessage='Email Service' /></span>
                                        </Col>
                                    </Col>
                                    <Col xs={12} >
                                        <hr />
                                    </Col>
                                </FormGroup>

                                <FormGroup className='cusMargin30'>

                                    <Col xs={6} >
                                        <FormGroup validationState={this.state.HostValidation}>
                                            <Col xs={12} className='cusMargin17'><span className="inputTitle"><FormattedMessage id='email.host' defaultMessage='SMTP Server Host' /></span><span className='manatory'>*</span></Col>

                                            <Col xs={12}>
                                                <FormControl  maxLength='128' maxLength='128' type='text' value={email.host} bsStyle='success'  className={this.state.HostValidation == 'error' ? 'input-cus' : ''}
                                                  inputRef={(host)=>this.host=host}  onChange={(event) => this._validate(event, 'host')} onBlur={(event) => this.onBlurHander(event, 'confirmHostNull')} />
                                                <Col className='pull-left' ><span className='warnColor' ref={(confirmHostNull) => this.confirmHostNull = confirmHostNull}><FormattedMessage id='validation.null' defaultMessage='Please provide a value for this field.' /></span></Col>
                                                <Col className='pull-left' ><span >&nbsp;</span> </Col>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={6}>
                                        <FormGroup validationState={this.state.PortValidation}>
                                            <Col xs={12} className='cusMargin17'><span className="inputTitle"><FormattedMessage id='email.port' defaultMessage='SMTP Server Port' /></span><span className='manatory'>*</span></Col>
                                            <Col xs={12} >
                                                <FormControl  maxLength='128' maxLength='128' type='text' value={email.port} bsStyle='success' className={this.state.PortValidation == 'error' ? 'input-cus' : ''}
                                                  inputRef={(port)=>this.port = port}  onChange={(event) => this._validate(event, 'port')} onBlur={(event) => this.onBlurHander(event, 'confirmPortNull')} />

                                            </Col>
                                            <Col xs={12} >
                                                <Col className='pull-left' ><span className='warnColor' ref={(confirmPortNull) => this.confirmPortNull = confirmPortNull}><FormattedMessage id='validation.port' defaultMessage='Please provide a numeric value for this field.' /> </span> </Col>
                                                <Col className='pull-left' ><span className='warnColor' ref={(confirmPort) => this.confirmPort = confirmPort}><FormattedMessage id="validation.port" defaultMessage='Please provide a numeric value for this field.' /></span> </Col>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>

                                <FormGroup className='cusMargin30'>
                                    <Col xs={6}>
                                        <FormGroup validationState={this.state.UserNameValidation}>
                                            <Col xs={12} className='cusMargin17'><span className="inputTitle"><FormattedMessage id='email.username' defaultMessage='User Name' /></span></Col>
                                            <Col xs={12} >

                                                <FormControl maxLength='128' maxLength='128' type='text' value={email.username} bsStyle='success'  className={this.state.UserNameValidation == 'error' ? 'input-cus' : ''}
                                                    onChange={(event) => this._validate(event, 'username')} onBlur={(event) => this.onBlurHander(event, 'confirmUserNameNull')} />
                                                <Col className='pull-left' ><span className='warnColor' ref={(confirmUserNameNull) => this.confirmUserNameNull = confirmUserNameNull}><FormattedMessage id='validation.port' defaultMessage='Please provide a value for this field.' /></span> </Col>
                                                {this.renderValidatorCol('validation.match', (confirmUserName) => this.confirmUserName = confirmUserName, <FormattedMessage id="email.username" defaultMessage="User Name" />)}
                                                <Col className='pull-left' ><span >&nbsp;</span> </Col>
                                            </Col>

                                        </FormGroup>
                                    </Col>

                                    <Col xs={6}>
                                        <FormGroup validationState={this.state.PasswordValidation} >
                                            <Col xs={12} className='cusMargin17'><span className="inputTitle"><FormattedMessage id='email.password' defaultMessage='Password' /></span></Col>
                                            <Col xs={12} >
                                                <FormControl onPaste={() => { return false }} maxLength='128' maxLength='128' type='password' value={email.password}  className={this.state.PasswordValidation == 'error' ? 'input-cus' : ''}
                                                    onChange={(event) => this._onChange(event, 'password')} onBlur={(event) => this.onBlurHander(event, 'confirmPasswordNull')} />
                                                <Col className='pull-left' ><span className='warnColor' ref={(confirmPasswordNull) => this.confirmPasswordNull = confirmPasswordNull}><FormattedMessage id='validation.port' defaultMessage='Please provide a value for this field.' /></span> </Col>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>

                                <FormGroup className='cusMargin30'>
                                    <Col xs={6}>
                                        <FormGroup >
                                            <Col xs={12} className=' cusMargin17'><span className="inputTitle"><FormattedMessage id='email.from' defaultMessage='Mail From' /></span></Col>
                                            <Col xs={12} >
                                                <FormControl maxLength='128' maxLength='128' type='text' value={email.from}  onChange={(event) => this._onChange(event, 'from')} />
                                            </Col>
                                        </FormGroup>

                                    </Col>
                                    <Col xs={6}>
                                        <FormGroup >
                                            <Col xs={12}>
                                                <Col className='pull-left'><span className="inputTitle"
                                                ><FormattedMessage id='email.ssl' defaultMessage='Enable SSL&TLS' />:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                                </Col>
                                                <Col className='toggleWidth pull-left'><Toggle isToggleOn={email.ssl.toBoolean()}
                                                    onClickHandler={(value) => this._onToggleClickHandler(value, 'ssl')} /></Col>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>
                            </Col>
                            <FormGroup className='cusMargin30'>
                                <Col xs={12}>
                                    <Col xs={12}>
                                        <Button bsClass='btn pull-left' onClick={(event) => this._onTest()} disabled={!this.buttonHander()}><FormattedMessage id='test' defaultMessage='Test' /></Button>
                                        <MessageDialog show={isDialogShow} type="error" title={title} buttons={buttons} >
                                            {content}
                                        </MessageDialog>
                                        <MessageDialog show={this.state.showModalConfirm} type='warning'    children={<FormattedMessage id='warning' defaultMessage='Are you sure you want to leave this page?  Your unsaved work will be lost. ' />}  warnYesHandler={() => this._warnYesHandler()} warnNoHandler={() => this._warnNoHandler()} />
                                        <HomeApply disabled={(!this.state.applyStatus)}></HomeApply>
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
        email: state.email,
        isLoaded: state.email.isLoaded,
        isLoading: state.email.isLoading
    };
}

export default connect(select)(EmailServer);
