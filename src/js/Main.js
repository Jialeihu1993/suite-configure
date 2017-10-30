import React from 'react';
import {Modal, ProgressBar,Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import {FormattedMessage} from 'react-intl';
import { loadData } from './actions/accounts';
import { clearMessage } from './actions/message';
import Header from './Header';
import Navigator from './Navigator';
import {changeNavMode} from './actions/changeNav';

const NAVIGATOR_WIDE = 300;
const NAVIGATOR_NARROW = 50;
const HEADERHEIGHT = 45;


class Main extends React.Component {
  constructor(props) {
    super(props);
    this._onDismiss = this._onDismiss.bind(this);
    this.state={contentContainer:'0px',navigatorContainer:'0px',currentNavMode:2, contentHeight:'0px'};
  }

  componentDidMount() {
    // todo: add validation
    // load initial data here
    this.props.dispatch(loadData(this.props.isLoaded));

    this.props.dispatch(changeNavMode({
      propName: 'navMode',
      value: 2
    }));
  
    
    window.onresize= ()=>{
      if(this.wholePage){
         this.resize();
       }
    }
    //console.log("didMount:    "+this.wholePage.clientWidth);
    let pageWidthMount = this.wholePage.clientWidth;
    if(window.ActiveXObject){
         this.resize();
       }else{
           let contentHeight = window.innerHeight-HEADERHEIGHT;
           let wholeWidth = 0;
           if(this.wholePage.clientWidth <= 1280){
               wholeWidth = 1280;
            
           }else{
               wholeWidth = pageWidthMount;

           } 
           let navigatorContainer = NAVIGATOR_WIDE;
           let contentContainer = wholeWidth-NAVIGATOR_WIDE;
           this.setState({contentContainer:contentContainer+'px',navigatorContainer:navigatorContainer+'px',currentNavMode:this.props.nav.navMode,contentHeight:contentHeight+'px'});
        }

    document.onpaste = function (event){  
     if(window.event){  
          event = window.event;  
       }try{  
            var the = event.srcElement;  
             if (the.tagName == "INPUT" && the.type.toLowerCase() == "password"){  
                return false;  
              }  
            return true;  
         }catch (e){  
           return false;  
          }  
      } 

}

  _onDismiss() {
    this.props.dispatch(clearMessage());
  }

  resize(){
   
    let contentHeight = window.innerHeight-HEADERHEIGHT;
    let wholeWidth = Math.floor(this.wholePage.clientWidth); 
    let navigatorContainer = this.props.nav.navMode == 2?NAVIGATOR_WIDE:NAVIGATOR_NARROW;
    let contentContainer = this.props.nav.navMode == 2? wholeWidth-NAVIGATOR_WIDE:wholeWidth-NAVIGATOR_NARROW;
    this.setState({contentContainer:contentContainer+'px',navigatorContainer:navigatorContainer+'px',currentNavMode:this.props.nav.navMode,contentHeight:contentHeight+'px'});
  }

  componentDidUpdate(){
    if(this.state.currentNavMode != this.props.nav.navMode){
        this.resize();
    }
  }

  /**
   * Specify navMode to make cloumn size for navigator and main content
   * @param navMode
   * @returns {XML}
   * @private
   */
  _mainStatus(navMode) {
    return (
        <div id='container' className='container-fluid colFull'  ref={(wholePage)=>this.wholePage = wholePage}>

           <Modal show={!this.props.isLoaded} className="progressBarcus">
            <Modal.Body>
              <h4><FormattedMessage id='dataLoading' defaultMessage='Initialize Data Loading...'/></h4>
              <ProgressBar active now={100}/>
            </Modal.Body>
          </Modal>

          {
            this.props.isLoaded &&
              <div>
              <Header />
              <Col xs={12} className="colFull" >
                <Col   className='colFull'  style={{maxWidth:this.state.navigatorContainer,minHeight:this.state.contentHeight,float:'left'}} id='navigatorContainer'  role='main'>
                  <Navigator navigatorWidth={this.state.navigatorContainer} />

                </Col>

                <Col className='colFull' style={{width:this.state.contentContainer,float:'right',maxHeight:this.state.contentHeight,overflow:'auto'}} id='contentContainer' className='bs-docs-sidebar-holder'>
                                
                  {this.props.children}                
                </Col>
              </Col>
            </div>
          }
        </div>
      
    );
  }

  render() {
    return (
        this._mainStatus(this.props.nav.navMode)
    );
  }
}

let select = (state, props) => {
  return {
    message: state.message,
    isLoaded: state.accounts.isLoaded,
    //isLoaded: true,
    nav: state.navStyle.nav
  };
}

export default connect(select)(Main);