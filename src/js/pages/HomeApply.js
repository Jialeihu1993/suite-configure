import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ApplyDialog from './apply/ApplyDialog';
import ApplyPropList from './apply/ApplyPropList';
import ApplyConfigList from './apply/ApplyConfig';
import ApplyRevertConfigList from './apply/ApplyRevertConfig';
import {cipher} from '../util/cipher';
import { PASSWORD_MASK, FIELD_TYPE_PASSWORD, ADMIN, SUCCESS, CONFIRM,CONFIRMED, REVERT, ERROR, RESTART, APPLY, CANCEL, REVERTED ,REVERT_ERROR,REVERT_CONFIRM,REVERT_SUCCESS,AES,TOKEN} from './../constants/Constants'
import { applyEntry, applyConfig, revertConfig, confirmApply,resetApply } from '../actions/applyConfig';

const iterateChangedData = (obj = {}, summary, objName) => {
    let result;
    for (let key in obj) {
        let object = obj[key];
        if (!object || typeof object != 'object' || object.constructor == Array) continue;

        if (object.isProperty && object.isProperty()) {
            if (object.isChanged && object.isChanged()) {
                if(objName.indexOf('_loglevel') > 0) {
                    objName = 'logLevel';
                }
                let isExist = false;
                let index;
				for(let i in summary) {
					if(summary[i].label == objName) {
						isExist = true;
                        index = i;
                        break;
					}
				}
				if(isExist) {
					summary[index].itemList.push({ label: objName == 'logLevel' ? key : objName + '.' + key, value: key && key == FIELD_TYPE_PASSWORD ? PASSWORD_MASK : object.currentVal });
				} else {
                    if(!result) {
                        result = { label:objName, itemList: []};
                    }
                    result.itemList.push({ label: objName == 'logLevel' ? key : objName + '.' + key, value: key && key == FIELD_TYPE_PASSWORD ? PASSWORD_MASK : object.currentVal });
                }
            }
        }
        else {
            iterateChangedData(obj[key], summary, key);
        }
    }

    // do not show admin(change password on apply page)
    if (result && result.label != ADMIN)
        summary.push(result);
};

String.prototype.trim=function()
{
     return this.replace(/(^\s*)|(\s*$)/g, '');
}

const iterateChangedDataForServer = (obj = {}, summary, objName) => {
    for (let key in obj) {
        let object = obj[key];
        if (!object || typeof object != 'object' || object.constructor == Array) continue;

        if (object.isProperty && object.isProperty()) {
            if (object.isChanged && object.isChanged()) {
                if(objName.indexOf('_loglevel') > 0) objName = 'logLevel';

                if (!summary[objName]) {
                    summary[objName] = {};
                }
                if(key ==  FIELD_TYPE_PASSWORD) {
                    summary[objName][key] =  cipher(AES,object.currentVal,TOKEN);
                } else {
                    summary[objName][key] =  typeof object.currentVal =='string'? object.currentVal.trim():object.currentVal;
                }
                
            }
        }
        else {
            iterateChangedDataForServer(obj[key], summary, key);
        }
    }
};

export class ApplyMainDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showModal: false, serverStatus: APPLY, message:null, errorMessage:{id:'common.error',defaultMessage:'Internal Server Error'}}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({showModal:nextProps.properties.apply.showModal, serverStatus: nextProps.properties.apply.serverStatus,errorMessage: nextProps.properties.apply.errorMessage });
    }

    close() {
        this.props.dispatch(resetApply());
    }

    closeAndReload() {
        this.props.dispatch(resetApply());
        window.location.reload();
    }

    open() {
        this.props.dispatch(applyEntry());
    }


    revert() {
        this.props.dispatch(revertConfig())
    }

    getChangedDataForSummary() {
        let summary = [];
        let properties = this.props.properties;

        for (let key in properties)
            if(key != 'message' && key != 'navStyle' && key != 'admin') {
                iterateChangedData(properties[key], summary, key);
            }

        return summary;
    }

    getChangedData() {
        let summary = {};
        let properties = this.props.properties;

        for (let key in properties)
            if(key != 'message' && key != 'navStyle' && key != 'admin') {
                iterateChangedDataForServer(properties[key], summary, key);
            }

        return summary;
    }

    confirm() {
        this.props.dispatch(applyConfig(this.getChangedData()));
    }

    confirmApply() {
        this.props.dispatch(resetApply());
        this.props.dispatch(confirmApply());
    }

    render() {
        let title = <FormattedMessage id='change.items' defaultMessage='Change Items' />;

        let buttons = [
            <Button key='1' bsClass='btn pull-left' onClick={this.confirm.bind(this)}><FormattedMessage id='confirm' defaultMessage='Confirm' /></Button>,
            <Button key='2' bsClass='btn pull-left' onClick={this.close.bind(this)}><FormattedMessage id='cancel' defaultMessage='Cancel' /></Button>
        ];

        let content = null;

        let message = null;

        switch (this.state.serverStatus) {
            case CONFIRM:
                title = <FormattedMessage id='change.services' defaultMessage='Services' />;
                buttons = [];
                content = (<ApplyConfigList></ApplyConfigList>);
                break;
            case REVERT:
                title = <FormattedMessage id='change.services' defaultMessage='Services' />;
                buttons = [
                    <Button key='2' bsClass='btn pull-left' onClick={this.revert.bind(this)}><FormattedMessage id='revert' defaultMessage='Revert' /></Button>
                ];
                content = (<ApplyConfigList></ApplyConfigList>);
                message = <FormattedMessage id='apply.revert' defaultMessage='Warning: The system failed to restart some of the services, and has to roll back to the previous state. Please click Revert to revert all changes that were just made.'/>;
                break;
            case SUCCESS:
                title = <FormattedMessage id='change.services' defaultMessage='Services' />;
                buttons = [
                    <Button key='2' bsClass='btn pull-left' onClick={this.confirmApply.bind(this)}><FormattedMessage id='ok' defaultMessage='OK' /></Button>
                ];
                content = (<ApplyConfigList></ApplyConfigList>);
                break;
            case ERROR:
                title = <FormattedMessage id='change.services' defaultMessage='Services' />;
                buttons = [
                    <Button key='2' bsClass='btn pull-left' onClick={this.close.bind(this)}><FormattedMessage id='close' defaultMessage='Close' /></Button>
                ];
                content = (<div className='apply-wating'><h2><FormattedMessage id={this.state.errorMessage.id} defaultMessage={this.state.  errorMessage.defaultMessage} /></h2></div>);
                break;
            case APPLY:
                buttons = [
                    <Button key='1' bsClass='btn pull-left' onClick={this.confirm.bind(this)}><FormattedMessage id='confirm' defaultMessage='Confirm' /></Button>,
                    <Button key='2' bsClass='btn pull-left' onClick={this.close.bind(this)}><FormattedMessage id='cancel' defaultMessage='Cancel' /></Button>
                ];
                content = (<ApplyPropList groupList={this.getChangedDataForSummary.bind(this)()}></ApplyPropList>);
                message = <FormattedMessage id='apply.confirmWarning' defaultMessage='Note: The configuration changes you made require a restart of the affected services. Click Confirm to apply the changes and restart the affected services immediately, or click Cancel to return to the configuration page.'/>;
                break;
           case RESTART:
                buttons = [
                    <Button key='1' bsClass='btn pull-left' onClick={this.close.bind(this)}><FormattedMessage id='close' defaultMessage='Close'/></Button>
                ];
                content = (<ApplyConfigList></ApplyConfigList>);
                message = <FormattedMessage id='apply.restart' defaultMessage='Warning: Cannot apply your changes because the system is still processing a previous configuration change. Please close the window or wait until the system has applied all previous changes.'/>;
                break;
            case CANCEL:
                content = null;
                break;
            case REVERTED:
                buttons = [];
                title = <FormattedMessage id='change.services' defaultMessage='Services' />;
                content = (<ApplyRevertConfigList ></ApplyRevertConfigList>);
                break;
            case REVERT_ERROR:
                title = <FormattedMessage id='change.services' defaultMessage='Services' />;
                buttons = [
                    <Button key='2' bsClass='btn pull-left' onClick={this.closeAndReload.bind(this)}><FormattedMessage id='close' defaultMessage='Close' /></Button>
                ];
                content = (<ApplyRevertConfigList ></ApplyRevertConfigList>);
                break;
            case REVERT_CONFIRM:
                title = <FormattedMessage id='change.services' defaultMessage='Services' />;
                buttons = [];
                content = (<ApplyRevertConfigList ></ApplyRevertConfigList>);
                break;
            case REVERT_SUCCESS:
                title = <FormattedMessage id='change.services' defaultMessage='Services' />;
                buttons = [
                    <Button key='2' bsClass='btn pull-left' onClick={this.confirmApply.bind(this)}><FormattedMessage id='ok' defaultMessage='OK' /></Button>
                ];
                content = (<ApplyRevertConfigList></ApplyRevertConfigList>);
                break;
            case CONFIRMED:
                buttons = [
                    <Button key='2' bsClass='btn pull-left' onClick={this.close.bind(this)}><FormattedMessage id='ok' defaultMessage='OK' /></Button>
                ];
                content = (<div className='apply-wating'><h2><FormattedMessage id='apply.confirmed' defaultMessage='Apply Configration Confirmed Successfully!' /></h2></div>);
                break; 
            default:
                buttons = [
                    <Button key='1' bsClass='btn pull-left' onClick={this.confirm.bind(this)}><FormattedMessage id='confirm' defaultMessage='Confirm' /></Button>,
                    <Button key='2' bsClass='btn pull-left' onClick={this.close.bind(this)}><FormattedMessage id='cancel' defaultMessage='Cancel' /></Button>
                ];
                content = (<ApplyPropList groupList={this.getChangedDataForSummary.bind(this)()}></ApplyPropList>);
        }
                             
        return (

            <div className='static-modal'>
                {
                   this.getChangedDataForSummary().length > 0 && !this.props.disabled ? <Button onClick={this.open.bind(this)}  bsClass='btn pull-left' ><FormattedMessage id='apply' defaultMessage='Apply' /></Button> :
                                         <Button onClick={this.open.bind(this)}  bsClass='btn pull-left' disabled><FormattedMessage id='apply' defaultMessage='Apply' /></Button>
                }
                
                <ApplyDialog show={this.state.showModal} buttons={buttons} title={title} message={message}>
                    {content}
                </ApplyDialog>
            </div>
        );
    }
}

let select = (state, props) => {
    return {
        properties: state,
        configList: state.configList,
        errorMessage : state.errorMessage
    };
}

export default connect(select)(ApplyMainDialog);
