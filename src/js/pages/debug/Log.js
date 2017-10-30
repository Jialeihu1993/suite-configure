import React, { Component } from 'react';
import { Form, FormGroup, FormControl, Col, Button, Breadcrumb } from 'react-bootstrap';
import { connect } from 'react-redux';
import Dropdown from '../../components/Dropdown/index';
import HomeApply from './../HomeApply';
import { changeCurrentNav } from '../../actions/changeNav';
import { updateProperty } from '../../actions/logLevel';
import { loadLogLevel, getLogLevelParamValue } from '../../actions/logLevel';
import { FormattedMessage } from 'react-intl';


class Log extends Component {
  constructor(props) {
    super(props);
    this.tabStatus = ['active', 'inactive', 'inactive', 'inactive']
    this.state = {
      currentTab: 0,
      textareaIsChanged: '',
      sm_paramater: '',
      sm_logLevel: '',
      sm_logLevel_options: [],
      smw_paramater: '',
      smw_logLevel: '',
      smw_logLevel_options: [],
      ud_modual: '',
      ud_logLevel: '',
      ud_logLevel_options: [],
      uds_modual: '',
      uds_logLevel: '',
      uds_logLevel_options: [],
      udb_modual: '',
      udb_logLevel: '',
      udb_logLevel_options: [],
      smarta_loglevel: '',
      smarta_logLevel_options: [],
      propel_loglevel: '',
      propel_logLevel_options: [],
      idm_paramater: '',
      idm_logLevel: '',
      idm_logLevel_options: []
    };
  }

  componentDidMount() {
    this.props.dispatch(loadLogLevel(this.props.isLoaded));
    this.props.dispatch(changeCurrentNav({
      propName: 'currentNav',
      value: 'Log Level'
    }));

  }

  _onChange(value, name) {
    this.props.dispatch(updateProperty({
      propName: name,
      value: value
    }));
  }


  _onClickAdd(option) {
    //copy  props
    let fieldName;
    let key;
    let value;
    let newState = this.state;
    if (option == 'sm_add') {
      fieldName = 'sm_server_loglevel';
      key = this.state.sm_paramater;
      value = this.state.sm_logLevel;
    }
    if (option == 'smw_add') {
      fieldName = 'sm_webtier_loglevel';
      key = this.state.smw_paramater;
      value = this.state.smw_logLevel;
    }
    if (option == 'ud_add') {
      fieldName = 'cmdb_ud_loglevel';
      key = this.state.ud_modual;
      value = this.state.ud_logLevel;
    }
    if (option == 'uds_add') {
      fieldName = 'cmdb_server_loglevel';
      key = this.state.uds_modual;
      value = this.state.uds_logLevel;
    }
    if (option == 'udb_add') {
      fieldName = 'cmdb_browser_loglevel';
      key = this.state.udb_modual;
      value = this.state.udb_logLevel;
    }

    if (option == 'idm_add') {
      fieldName = 'idm_loglevel';
      key = this.state.idm_paramater;
      value = this.state.idm_logLevel;
    }
    // change state of textareaIsChanged for render
    newState['textareaIsChanged'] = 'yes';
    this.setState(newState);
    // change store at last
    this._onChange('\"' + key + '\":\"' + value + '\"', fieldName);
    // this._onChange(log[fieldName], fieldName);
  }

  _onClickHandler(number) {
    let newState = this.state;
    newState['currentTab'] = number;
    let paramValue;
    if (number == 2) {
      let obj = 'smarta_loglevel';
      getLogLevelParamValue(obj).then((response) => {
        paramValue = response;
        let key = obj.substring(0, obj.indexOf('_')) + '_logLevel_options';
        newState[key] = paramValue;
        this.setState(newState);
      }).catch((error) => {
        throw error.response;
      });

    } else if (number == 3) {
      let obj = 'propel_loglevel';
      getLogLevelParamValue(obj).then((response) => {
        paramValue = response;
        let key = obj.substring(0, obj.indexOf('_')) + '_logLevel_options';
        newState[key] = paramValue;
        this.setState(newState);
      }).catch((error) => {
        throw error.response;
      });

    } else {
      this.setState(newState);
    }


    for (var i = 0; i < 5; i++) {
      if (i == number) {
        this.tabStatus[i] = 'active';
      } else {
        this.tabStatus[i] = 'inactive';
      }
    }

  }

  parseTextareaToStr(option) {
    let logUnit = this.props.log[option];
    var result = '';
    var arrayObj = new Array();
    for (var paramKey in logUnit) {
      arrayObj.push(paramKey)
    }
    arrayObj.sort();
    for (var index in arrayObj) {
      var key = arrayObj[index];
      result = result + '\"' + key + '\":\"' + logUnit[key] + '\"\n';
    }
    result = result.substring(0, result.length - 1);
    return result;
  }

  sortOptions(options) {
    var arrayObj = new Array();
    for (var index in options) {
      arrayObj.push(options[index].label)
    }
    arrayObj.sort();
    var jsonArray = [];
    for (var i = 0; i < arrayObj.length; i++) {
      var jsonObject = {};
      jsonObject['label'] = arrayObj[i];
      jsonObject['value'] = arrayObj[i];
      jsonArray.push(jsonObject);
    }
    return jsonArray;
  }

  changeDropDownState(value, obj) {
    let param = '';
    let newState = this.state;
    newState[obj] = value;
    if (obj.indexOf('_log') < 0) {
      getLogLevelParamValue(value).then((response) => {
        param = response;
        let key = obj.substring(0, obj.indexOf('_')) + '_logLevel_options';
        let logValue = obj.substring(0, obj.indexOf('_')) + '_logLevel';
        if (param.length > 0) {
          newState[key] = param;
          newState[logValue] = param[0].value;
          this.setState(newState);
        }
      }).catch((error) => {
        throw error.response;
      });
    }
    this.setState(newState);
    if (obj == 'smarta_loglevel' || obj == 'propel_loglevel') {
      this._onChange('\"' + obj + '\":\"' + value + '\"', obj);
    }
  }



  sm_options = [{ label: 'sqllimit', value: 'sqllimit' },
  { label: 'debugdbquery', value: 'debugdbquery' },
  //{ label: 'queryhashcode', value: 'queryhashcode' },
  //{ label: 'dashboard_export_path', value: 'dashboard_export_path' },
  //{ label: 'report.export', value: 'report.export' },
  { label: 'cache_clean_interval', value: 'cache_clean_interval' },
  { label: 'webservices_sessiontimeout', value: 'webservices_sessiontimeout' },
  { label: 'connectionTimeout', value: 'connectionTimeout' },
  { label: 'smartemailTimeout', value: 'smartemailTimeout' },
  { label: 'sqldebug', value: 'sqldebug' },
  { label: 'debughttp', value: 'debughttp' },
  { label: 'debugjavascript', value: 'debugjavascript' },
  { label: 'debugrest', value: 'debugrest' },
  { label: 'logdebuglevel', value: 'logdebuglevel' },
  { label: 'debugjni', value: 'debugjni' },
  { label: 'log4jDebug', value: 'log4jDebug' },
  { label: 'enablecoredump', value: 'enablecoredump' },
  { label: 'rtm', value: 'rtm' },
  { label: 'maxlogsize', value: 'maxlogsize' },
  { label: 'numberoflogfiles', value: 'numberoflogfiles' }];

  final_sm_option = this.sortOptions(this.sm_options);

  smw_options = [{ label: 'session-timeout', value: 'session-timeout' },
  { label: 'viewrecordlist', value: 'viewrecordlist' },
  //{ label: 'customize-folder', value: 'customize-folder' },
  { label: 'querysecurity', value: 'querysecurity' },
  { label: 'jsDebug', value: 'jsDebug' }];

  final_smw_options = this.sortOptions(this.smw_options);

  ud_options = [{ label: 'discovery.framework', value: 'discovery.framework' },
  { label: 'discovery.library', value: 'discovery.library' },
  { label: 'discovery.probe.agents', value: 'discovery.probe.agents' },
  { label: 'discovery.library.results.resultprocess', value: 'discovery.library.results.resultprocess' },
  { label: 'discovery.library.dal', value: 'discovery.library.dal' },
  { label: 'discovery.probe.agents.probemgr.workflow', value: 'discovery.probe.agents.probemgr.workflow' }];

  final_ud_options = this.sortOptions(this.ud_options);

  udb_options = [{ label: 'ucmdb_browser.level', value: 'ucmdb_browser.level' },
  { label: 'ucmdb_browser_search.level', value: 'ucmdb_browser_search.level' },
  { label: 'jvm_stats.level', value: 'jvm_stats.level' },
  { label: 'statistics.level', value: 'statistics.level' },
  { label: 'rpcCalls.level', value: 'rpcCalls.level' }];

  final_udb_options = this.sortOptions(this.udb_options);

  uds_options = [{ label: 'ucmdb-api.properties.loglevel', value: 'ucmdb-api.properties.loglevel' },
  { label: 'mam.properties.loglevel', value: 'mam.properties.loglevel' },
  { label: 'security.properties.loglevel', value: 'security.properties.loglevel' },
  { label: 'cmdb-framework.properties.loglevel', value: 'cmdb-framework.properties.loglevel' },
  { label: 'cmdb.properties.cla.loglevel', value: 'cmdb.properties.cla.loglevel' },
  { label: 'cmdb.properties.loglevel', value: 'cmdb.properties.loglevel' },
  {
    label: 'logstash.statistics.properties.loglevel.history',
    value: 'logstash.statistics.properties.loglevel.history'
  },
  { label: 'cmdb.properties.notification.loglevel', value: 'cmdb.properties.notification.loglevel' },
  { label: 'reconciliation.properties.loglevel', value: 'reconciliation.properties.loglevel' },
  { label: 'cmdb.properties.tqlscheduler.loglevel', value: 'cmdb.properties.tqlscheduler.loglevel' },
  { label: 'cmdb-framework.properties.urmLogLevel', value: 'cmdb-framework.properties.urmLogLevel' },
  { label: 'cmdb_soaapi.properties.loglevel', value: 'cmdb_soaapi.properties.loglevel' },
  { label: 'security.properties.loglevel.cm', value: 'security.properties.loglevel.cm' },
  { label: 'security.properties.loglevel.lwsso', value: 'security.properties.loglevel.lwsso' },
  { label: 'ui-server.properties.loglevel', value: 'ui-server.properties.loglevel' },
  { label: 'security.properties.loglevel.authorization', value: 'security.properties.loglevel.authorization' },
  { label: 'mam.web.properties.loglevel', value: 'mam.web.properties.loglevel' },
  { label: 'cmdb.properties.search.loglevel', value: 'cmdb.properties.search.loglevel' },
  { label: 'fcmdb.properties.loglevel', value: 'fcmdb.properties.loglevel' },
  { label: 'cmdb.properties.downgrade.loglevel', value: 'cmdb.properties.downgrade.loglevel' },
  { label: 'cmdb.properties.quota.loglevel', value: 'cmdb.properties.quota.loglevel' },
  {
    label: 'logstash.statistics.properties.loglevel.datain',
    value: 'logstash.statistics.properties.loglevel.datain'
  },
  { label: 'fcmdb.gdba.properties.loglevel', value: 'fcmdb.gdba.properties.loglevel' },
  { label: 'fcmdb.push.properties.loglevel', value: 'fcmdb.push.properties.loglevel' },
  { label: 'mam.properties.loglevel.monitoring', value: 'mam.properties.loglevel.monitoring' },
  { label: 'multiple.cmdb.properties.loglevel', value: 'multiple.cmdb.properties.loglevel' },
  { label: 'security.properties.loglevel.wink', value: 'security.properties.loglevel.wink' },
  { label: 'ui-server.properties.spring', value: 'ui-server.properties.spring' },
  {
    label: 'logstash.statistics.properties.loglevel.search',
    value: 'logstash.statistics.properties.loglevel.search'
  },
  {
    label: 'logstash.statistics.properties.loglevel.tql',
    value: 'logstash.statistics.properties.loglevel.tql'
  }];

  final_uds_options = this.sortOptions(this.uds_options);

  idm_options = [{ label: 'idm_auth_debug', value: 'idm_auth_debug' },
  { label: 'idm_debug', value: 'idm_debug' }];

  final_idm_options = this.sortOptions(this.idm_options);

  contentShow(number) {
    let log = this.props.log;
    switch (number) {
      case 0:
        return (
          <div>
            <FormGroup >
              <Col xs={12}>
                <span className="pull-left collapseTitle">Server</span>
              </Col>

              <Col xs={12} className="collapseGroup">
                <hr />
              </Col>

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel.Paramater" defaultMessage="Paramater" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.final_sm_option} value={this.state.sm_paramater}
                    onChange={(item) => this.changeDropDownState(item.value, 'sm_paramater')} />
                </Col>
              </Col>


              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel.Value" defaultMessage="Value" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.state.sm_logLevel_options} value={this.state.sm_logLevel}
                    onChange={(item) => this.changeDropDownState(item.value, 'sm_logLevel')} />
                </Col>
              </Col>
              <Col xs={2} className="colFullLeft cusMarginTop25 buttonLogCus">
                <Button className="pull-right" onClick={() => this._onClickAdd('sm_add')}><FormattedMessage id="logLevel.update" defaultMessage="Update" /></Button>
              </Col>

              <Col xs={12}>
                <FormControl componentClass="textarea" placeholder="textarea"
                  value={this.parseTextareaToStr('sm_server_loglevel')}
                  onChange={(event) => this._onChange(event.target.value, 'sm_server_loglevel')} />
              </Col>
            </FormGroup>


            <FormGroup className="cusMargin30">
              <Col xs={6}>
                <span className="pull-left collapseTitle">Webtier</span>
              </Col>

              <Col xs={12} className="collapseGroup">
                <hr />
              </Col>

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel.Paramater" defaultMessage="Paramater" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.final_smw_options} value={this.state.smw_paramater}
                    onChange={(item) => this.changeDropDownState(item.value, 'smw_paramater')} />
                </Col>
              </Col>

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel.Value" defaultMessage="Value" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.state.smw_logLevel_options} value={this.state.smw_logLevel}
                    onChange={(item) => this.changeDropDownState(item.value, 'smw_logLevel')} />

                </Col>

              </Col>
              <Col xs={2} className="colFullLeft cusMarginTop25 buttonLogCus">
                <Button className="pull-right" onClick={() => this._onClickAdd('smw_add')}><FormattedMessage id="logLevel.update" defaultMessage="Update" /></Button>
              </Col>

              <Col xs={12}>
                <FormControl componentClass="textarea" placeholder="textarea"
                  value={this.parseTextareaToStr('sm_webtier_loglevel')}
                  onChange={(event) => this._onChange(event.target.value, 'sm_webtier_loglevel')} />
              </Col>
            </FormGroup>

          </div>
        );

      case 1:
        return (
          <div>
            <FormGroup >
              <Col xs={6}>
                <span className="pull-left collapseTitle">UD</span>

              </Col>

              <Col xs={12} className="collapseGroup">
                <hr />
              </Col>

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel.Module" defaultMessage="Module" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.final_ud_options} value={this.state.ud_modual}
                    onChange={(item) => this.changeDropDownState(item.value, 'ud_modual')} />
                </Col>
              </Col>

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel" defaultMessage="Log Level" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.state.ud_logLevel_options} value={this.state.ud_logLevel}
                    onChange={(item) => this.changeDropDownState(item.value, 'ud_logLevel')} />
                </Col>

              </Col>
              <Col xs={2} className="colFullLeft cusMarginTop25 buttonLogCus">
                <Button className="pull-right" onClick={() => this._onClickAdd('ud_add')}><FormattedMessage id="logLevel.update" defaultMessage="Update" /></Button>
              </Col>


              <Col xs={12}>
                <FormControl componentClass="textarea" placeholder="textarea"
                  value={this.parseTextareaToStr('cmdb_ud_loglevel')}
                  onChange={(event) => this._onChange(event.target.value, 'cmdb_ud_loglevel')} />
              </Col>

            </FormGroup>


            <FormGroup >
              <Col xs={6}>
                <span className="pull-left collapseTitle">Server</span>
              </Col>
              <Col xs={12} className="collapseGroup">
                <hr />
              </Col>


              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel.Module" defaultMessage="Module" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.final_uds_options} value={this.state.uds_modual}
                    onChange={(item) => this.changeDropDownState(item.value, 'uds_modual')} />
                </Col>
              </Col>

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel" defaultMessage="Log Level" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.state.uds_logLevel_options} value={this.state.uds_logLevel}
                    onChange={(item) => this.changeDropDownState(item.value, 'uds_logLevel')} />
                </Col>

              </Col>
              <Col xs={2} className="colFullLeft cusMarginTop25 buttonLogCus">
                <Button className="pull-right" onClick={() => this._onClickAdd('uds_add')}><FormattedMessage id="logLevel.update" defaultMessage="Update" /></Button>
              </Col>


              <Col xs={12}>
                <FormControl componentClass="textarea" placeholder="textarea"
                  value={this.parseTextareaToStr('cmdb_server_loglevel')}
                  onChange={(event) => this._onChange(event.target.value, 'cmdb_server_loglevel')} />
              </Col>


            </FormGroup>


            <FormGroup className="cusMargin30">
              <Col xs={6}>
                <span className="pull-left collapseTitle">Browser</span>

              </Col>
              <Col xs={12} className="collapseGroup">
                <hr />
              </Col>

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel.Module" defaultMessage="Module" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.final_udb_options} value={this.state.udb_modual}
                    onChange={(item) => this.changeDropDownState(item.value, 'udb_modual')} />
                </Col>
              </Col>

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel" defaultMessage="Log Level" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.state.udb_logLevel_options} value={this.state.udb_logLevel}
                    onChange={(item) => this.changeDropDownState(item.value, 'udb_logLevel')} />
                </Col>

              </Col>
              <Col xs={2} className="colFullLeft cusMarginTop25 buttonLogCus">
                <Button className="pull-right" onClick={() => this._onClickAdd('udb_add')}><FormattedMessage id="logLevel.update" defaultMessage="Update" /></Button>
              </Col>


              <Col xs={12}>
                <FormControl componentClass="textarea" placeholder="textarea"
                  value={this.parseTextareaToStr('cmdb_browser_loglevel')}
                  onChange={(event) => this._onChange(event.target.value, 'cmdb_browser_loglevel')} />
              </Col>
            </FormGroup>
          </div>

        );

      case 2:
        return (
          <div style={{height:'150px'}}>
            <FormGroup>
              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel" defaultMessage="Log Level" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown value={log.smarta_loglevel.smarta_loglevel} options={this.state.smarta_logLevel_options}
                    onChange={(item) => this.changeDropDownState(item.value, 'smarta_loglevel')} />
                </Col>
              </Col>
            </FormGroup>
          </div>

        );

      case 3:
        return (
          <div style={{height:'150px'}}>
            <FormGroup>
              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel" defaultMessage="Log Level" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown value={log.propel_loglevel.propel_loglevel} options={this.state.propel_logLevel_options}
                    onChange={(item) => this.changeDropDownState(item.value, 'propel_loglevel')} />

                </Col>
              </Col>

            </FormGroup>
          </div>
        );

      case 4:
        return (
          <div>
            <FormGroup >

              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel.Paramater" defaultMessage="Paramater" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.final_idm_options} value={this.state.idm_paramater}
                    onChange={(item) => this.changeDropDownState(item.value, 'idm_paramater')} />
                </Col>
              </Col>


              <Col xs={5}>
                <Col xs={12} className="colFull cusMargin17"><span><FormattedMessage id="logLevel" defaultMessage="Log Level" /></span></Col>
                <Col xs={12} className="colFull cusMargin30">
                  <Dropdown options={this.state.idm_logLevel_options} value={this.state.idm_logLevel}
                    onChange={(item) => this.changeDropDownState(item.value, 'idm_logLevel')} />
                </Col>
              </Col>
              <Col xs={2} className="colFullLeft cusMarginTop25 buttonLogCus">
                <Button className="pull-right" onClick={() => this._onClickAdd('idm_add')}><FormattedMessage id="logLevel.update" defaultMessage="Update" /></Button>
              </Col>

              <Col xs={12}>
                <FormControl componentClass="textarea" placeholder="textarea"
                  value={this.parseTextareaToStr('idm_loglevel')}
                  onChange={(event) => this._onChange(event.target.value, 'idm_loglevel')} />
              </Col>
            </FormGroup>

          </div>
        );

    }
  }

  render() {
    return (

      <div>
        <Breadcrumb className="breadcrumbCus">
          <Breadcrumb.Item href='/itsmaconfig'>
            <FormattedMessage id="breadcrumbs.configuration" defaultMessage="Configuration" />
          </Breadcrumb.Item>
          <Breadcrumb.Item href='#'>
            <FormattedMessage id="breadcrumbs.debug" defaultMessage="Debug" />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <FormattedMessage id="breadcrumbs.logLevel" defaultMessage="Log Level" />
          </Breadcrumb.Item>
        </Breadcrumb>

        <Col xs={12}>
          <Col xs={12}>
            <Col xs={12}>
              <Form horizontal>

                <FormGroup>

                  <Col xs={12}><span className="titleBig"><FormattedMessage id="logLevel" defaultMessage="Log Level" /></span></Col>

                  <Col xs={12}>
                    <hr />
                  </Col>
                </FormGroup>

                <FormGroup className="group groupCus">
                  <Col xs={12}>
                    <Col style={{ width: '20%', float: 'left' }} className="colFull start sbutton " onClick={() => this._onClickHandler(0)}><span
                      className={this.tabStatus[0]}>Service Management</span></Col>
                    <Col style={{ width: '20%', float: 'left' }} className="colFull start sbutton " onClick={() => this._onClickHandler(1)}><span
                      className={this.tabStatus[1]}>CMDB</span> </Col>
                    <Col style={{ width: '20%', float: 'left' }} className="colFull start sbutton " onClick={() => this._onClickHandler(2)}><span
                      className={this.tabStatus[2]}>Smart Analytics</span></Col>
                    <Col style={{ width: '20%', float: 'left' }} className="colFull end sbutton " onClick={() => this._onClickHandler(3)}><span
                      className={this.tabStatus[3]}>Service Portal</span> </Col>
                    <Col style={{ width: '20%', float: 'left' }} className="colFull end sbutton " onClick={() => this._onClickHandler(4)}><span
                      className={this.tabStatus[4]}>IDM</span> </Col>
                  </Col>
                </FormGroup>

                {this.contentShow(this.state.currentTab)}

                <FormGroup className="cusMargin30">
                  <Col xs={12}>
                    <HomeApply />
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
    log: state.logLevel,
    isLoaded: state.logLevel.isLoaded
  };
}
export default connect(select)(Log);
