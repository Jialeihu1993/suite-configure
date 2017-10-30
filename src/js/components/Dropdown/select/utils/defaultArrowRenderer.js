import React from 'react';

export default function arrowRenderer ({ onMouseDown }) {
	// className = "glyphicon glyphicon-menu-down" style={{fontFamily: 'Glyphicons Halflings'}}
	return (
		<span
			className="Select-arrow"
			onMouseDown={onMouseDown}
		/>

	);
}
