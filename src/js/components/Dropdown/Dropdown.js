import React, { Component } from 'react'
import './select.css';

import Select from './select/Select'

class Dropdown extends Component {
	constructor(props) {
		super(props)
			this.value = props.value.toString();
	}

	componentWillReceiveProps(newProps) {
			this.value = newProps.value.toString();
	}

	onChange(newValue) {
		if (this.props.onChange) {
			this.props.onChange({ value: newValue });
		}
	}

	render() {
		return (<Select placeholder='' noResultsText='' scrollMenuIntoView={true} menuRenderer={this.selectMenuRenderer} options={this.props.options} simpleValue clearable={false} disabled={false} value={this.value} onChange={this.onChange.bind(this)} searchable={true} />)
	}
}

Dropdown.defaultProps = {
	options: React.PropTypes.array,             // array of options
	clearable: React.PropTypes.bool,            // should it be possible to reset value
	disabled: React.PropTypes.bool,             // whether the Select is disabled or not
	onChange: React.PropTypes.func,             // onChange handler: function (newValue) {}
	value: React.PropTypes.any               // initial field value
}

export default Dropdown
