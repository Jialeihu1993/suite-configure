import React, { PropTypes } from 'react';
import {FormattedMessage} from 'react-intl';

const ApplyProp = ({itemList}) => (
  <ul>
    {itemList.map((item, i) =>

      <li key={i}><span className="subItem-field"><FormattedMessage id={item.label} defaultMessage={item.label}/>:</span><span className="subItem-value">{item.value === true? 'True' : item.value === false ? 'False' : item.value}</span></li>

    )}
  </ul>
)

ApplyProp.propTypes = {
  itemList: PropTypes.any.isRequired
}

export default ApplyProp
