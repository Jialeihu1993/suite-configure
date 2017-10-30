import React, { Component } from 'react';
import './toggle.css';

class Toggle extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: this.props.isToggleOn ? this.props.isToggleOn:false};
	}
/*
  componentDidUpdate(){
	 this.setState({isToggleOn:this.props.isToggleOn});
  }
*/

 componentWillReceiveProps(nextProps){
	  this.setState({isToggleOn:nextProps.isToggleOn});
 }

	btnClick = () => {

		console.log(this.state.isToggleOn);
	    this.setState({
	        isToggleOn: !this.state.isToggleOn
	    });
    this.props.onClickHandler(this.state.isToggleOn);

	}


   render() {
        return (

								<div onClick={this.btnClick}>
                   
                    <input  type="checkbox"  className="toggle_input" checked={this.state.isToggleOn}/>
                    
                    <label className="toggle_label" htmlFor="toggle_input"></label>
								</div>
        );
    }
}

export default Toggle;