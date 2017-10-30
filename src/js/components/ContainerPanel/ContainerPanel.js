import React, { Component} from 'react';
import { Panel, Label} from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';

import './containerPanel.css';

const PanelState = {
  Expand : {
    expanded : true,
    sign : '-',
    style : 'custom-sign-minus'
  },
  Collapse : {
    expanded : false,
    sign : '+',
    style : 'custom-sign-plus'
  }
};

bootstrapUtils.addStyle(Panel, 'custom-panel');
bootstrapUtils.addStyle(Label, 'custom-label');
bootstrapUtils.addStyle(Label, 'custom-sign-plus');
bootstrapUtils.addStyle(Label, 'custom-sign-minus');

class ContainerPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {panelState:PanelState.Expand};

    this._handleClick = this._handleClick.bind(this);
  }

  // set default as expanded
 componentDidMount() {
   this.setState({panelState:this.props.expanded ? PanelState.Expand : PanelState.Collapse});
 }

  _handleClick() {
    this.setState({panelState:this.state.panelState.expanded ? PanelState.Collapse : PanelState.Expand});
    if(this.props.onClick)
    this.props.onClick(); // inform container components
  }

  render() {
    return (
      <div>
	    	<Label bsStyle="custom-label">{this.props.title}</Label>
        <span  onClick={this._handleClick}>
	    	    <Label bsStyle={this.state.panelState.style}>{this.state.panelState.sign}</Label>
        </span>

	    	<Panel collapsible expanded={this.state.panelState.expanded} bsStyle="custom-panel">
	          {this.props.children}
	      </Panel>
	      </div>
	    );
	  }
}

ContainerPanel.propTypes = {
  expanded : React.PropTypes.bool,
  onClick : React.PropTypes.func
};

export default ContainerPanel;
