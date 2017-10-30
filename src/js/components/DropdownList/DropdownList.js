import React, { Component } from 'react';
import './DropdownList.css';

class DropdownList extends React.Component{
    constructor(props) {
        super(props);
        this.state = {timestamp:new Date().getTime()};
    }

    handleDropDownClick = () => {
        document.getElementById('react_select_drop_down'+this.state.timestamp).style.display ="block";
        let dropDownHeight = document.getElementById('react_select_drop_down'+this.state.timestamp).clientHeight;
        if(dropDownHeight > 211){
          document.getElementById('react_select_drop_down'+this.state.timestamp).style.height= "211px";
        }
    }

    handleLiClick = (event) => {
      document.getElementById('react_select_drop_down'+this.state.timestamp).style.display ='none';
      let liValue = event.target.innerHTML;
      let liKey = event.target.getAttribute('data-value');
      document.getElementById('react_select_input'+this.state.timestamp).value = liValue;
      if(this.props.onChange){
        this.props.onChange(liKey, liValue);
      }
    }

    render(){
        const {value, options, onChange} = this.props;
        let timestamp = this.state.timestamp;
        let optionList = options.map((item) => {
          return <li data-value={item.key} onClick={this.handleLiClick}>{item.value}</li>
        });

        return (
          <div>
            <input id={"react_select_input"+timestamp} className="react_select_input" value={value} readOnly="true" type="text" onClick={this.handleDropDownClick} />
              <div id={"react_select_drop_down"+timestamp} className="react_select_drop_down">
                <ul>
                  {optionList}
                </ul>
              </div>
          </div>

      );
    }
}

DropdownList.defaultProps = {
    value: ''
}

DropdownList.propTypes = {
    value: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func.isRequired
}

export default DropdownList;
