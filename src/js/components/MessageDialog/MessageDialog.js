import React from 'react'
import { Modal, Button,Image } from 'react-bootstrap';
import {FormattedMessage} from 'react-intl';
import './MessageDialog.scss';
import getImgPath from '../../util/images'
const Dialog = ({ show, title, buttons, children , onExist}) => (
    <div className="static-modal ">
        <Modal show={show}  onExit={onExist}  className="MessageDialog">
            <Modal.Header>
                
                <Modal.Title> {title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {children}
            </Modal.Body>
            <Modal.Footer>
                {buttons}
            </Modal.Footer>
        </Modal>
    </div>
);

class MessageDialog extends React.Component{
    constructor(props) {
        super(props);
        this.state={show:true};
    }
    closeModal = (event) => {
        if(this.props.eventClick){ this.props.eventClick(event); }
    }

    _warnYesHandler =() =>{
        if(this.props.warnYesHandler){this.props.warnYesHandler();}

    }

    _warnNoHandler =() =>{
        this.setState({show:false});
        if(this.props.warnNoHandler){this.props.warnNoHandler();}
    }
    
    _existHandler =() =>{
        this.setState({show:true});
    }
    

    render(){
        if(this.props.type == 'error' || this.props.type == 'success'){
                   return(
                       <Dialog show={this.props.show} children={this.props.children} buttons={this.props.buttons} title={this.props.title} ></Dialog>
                       )
        }else{                                             
             let title_waring = <div> <Image  src={getImgPath('Warning_32px.png')} /> <FormattedMessage id='test.warning' defaultMessage='Warning'/></div>;
             let buttons =  buttons = [
                    <Button key="1" bsClass='btn pull-left' style={{minWidth:'145px'}} onClick={()=>this._warnYesHandler()}><FormattedMessage id="yes" defaultMessage="Stay on this page" /></Button>,
                    <Button key="2"  bsClass='btn pull-left' style={{minWidth:'145px'}} onClick={()=>this._warnNoHandler()}><FormattedMessage id="no" defaultMessage="Leave this page" /></Button>
                ];

              return(
                      <Dialog show={this.props.show&&this.state.show}  children={this.props.children} buttons={buttons} title={title_waring}  onExist={this._existHandler.bind(this)}>
                      </Dialog>
                     )
        }
    }
}
/*
MessageDialog.defaultProps = {
    content: {code:'400'}
}
*/

export default MessageDialog;
