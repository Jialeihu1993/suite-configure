import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Col, Breadcrumb,Collapse } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Iframe from 'react-iframe';
import {changeCurrentNav} from '../../actions/changeNav';
import {BASE_NAME} from 'constants/ServiceConfig';
class SmartAnalyticsOperation extends Component {

constructor(props) {
    super(props);
    this.state = {
      openCGS:true
    };

  }


 componentDidMount() {
        this.props.dispatch(changeCurrentNav({
            propName: "currentNav",
            value: "Smart Analytics"
        }));
    }

 iconStatus() {
   if(this.state.openCGS){
     return "glyphicon glyphicon-menu-up"
   }else {
     return "glyphicon glyphicon-menu-down"
   }
 }

_hideHandler(){
  let openCGS = !this.state.openCGS;
  this.setState({openCGS:openCGS});
}


  render() {
    var oprUrl = BASE_NAME+'/operation-smarta.html';
    return (

      <div >
                <Breadcrumb className="breadcrumbCus">
                    <Breadcrumb.Item href='/itsmaconfig'>
                     <FormattedMessage id="breadcrumbs.operation" defaultMessage='Operation' />
                </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                    <FormattedMessage id="breadcrumbs.smart" defaultMessage='Smart Analytics' />
                </Breadcrumb.Item>
                </Breadcrumb>
            <Col xs={12}>
               <Col xs={12}>
                <Form horizontal>
                    <Col xs={12}>
                        <FormGroup >
                            <Col xs={12} >
                                <Col xs={6} className='colFull'><span
                                    className='titleBig'><FormattedMessage id='sma' defaultMessage=" Smart Analytics" /></span>
                                </Col>
                            </Col>
                            <Col xs={12} >
                                <hr />
                            </Col>

                            <Col xs={12} style={{marginTop:'20'}}>

                             <span className={this.iconStatus()} style={{fontSize:'14px',lineHeight:'36px',color:'#cccccc',cursor:'pointer'}} onClick={()=>this._hideHandler()}></span>
                             <span className='titleMed' style={{marginLeft:'10',cursor:'pointer'}} onClick={()=>this._hideHandler()}>
                               <FormattedMessage id="smarta.scaling" defaultMessage="Content Group Scaling" />
                             </span>

                            </Col>

                            <Collapse in={this.state.openCGS} >

                                 <Iframe url={oprUrl} position='relative' width='100%' height='900px'></Iframe>

                            </Collapse>
                        </FormGroup>
                     </Col>




                  </Form>
                </Col>
              </Col>


        </div>
    );
  }
}

//SmartAnalyticsOperation.propTypes = {
//  dispatch: PropTypes.func.isRequired
//};

export default connect()(SmartAnalyticsOperation);
