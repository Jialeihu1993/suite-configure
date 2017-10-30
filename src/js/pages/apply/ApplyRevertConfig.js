import React,{Component} from 'react';
import {FormattedMessage} from 'react-intl';
import {getRevertStatus} from '../../actions/applyConfig';
import {connect} from 'react-redux';
import './ApplyConfig.css';
import {REVERT_ERROR, REVERT_SUCCESS} from './../../constants/Constants'

function getIcon(status) {
    if(status=='change-item-ok') {
        return 'glyphicon glyphicon-ok-circle change-item-ok';
    }else if(status=='change-item-warnning') {
        return 'glyphicon glyphicon-remove-circle change-item-warnning';
    }else if(status=='change-item-loading') {
        return 'fa fa-spinner fa-pulse fa-fw change-item-loading';
    }else if(status=='change-item-waiting') {
        return 'glyphicon glyphicon-ok-circle change-item-waiting';
    }
}

class ApplyRevertConfigList extends Component {
    constructor(props) {
      super(props);
      this.state = {configStateList: []};
    }

    componentDidMount = function() {
      let _dispatch = this.props.dispatch;
      this.countdown = setInterval(this.timer, 30000,_dispatch,getRevertStatus);
    }

    componentWillUnmount = function() {
        clearInterval(this.countdown);
    }

    timer = function(loadingserver,args) {
       if(loadingserver) {
         loadingserver(args());
       }
    }
    componentWillReceiveProps(nextProps) {
      this.setState({ configStateList: nextProps.configList });
      if(nextProps.serverStatus == REVERT_ERROR || nextProps.serverStatus == REVERT_SUCCESS) {
        clearInterval(this.countdown);
      }
    }

   render() {

      if(this.state.configStateList && this.state.configStateList.length > 0) {
        return (
        <div>
          {this.state.configStateList.map((item, i) => (
          <div key={i} className={item.status}><i className={getIcon(item.status)}></i><span className='change-item-default'>{item.name}</span>
            {item['itemList'].map((item,i) => (
              <div key={i} className={item.status}><i className={getIcon(item.status)}></i><span className='change-item-default-child'>{item.name}</span></div>
            ))}
          </div>
          ))}
        </div>
        )
      } else {
        return (
          <div className="apply-wating"><i className="fa fa-spinner fa-pulse fa-fw"></i><FormattedMessage id="apply.reverting" defaultMessage="Revert Configuration"/></div>
        )
      }
   }
}

let select = (state, props) => {
  return {
      configList: state.apply.configList,
      serverStatus : state.apply.serverStatus
 };
}

export default connect(select)(ApplyRevertConfigList);
