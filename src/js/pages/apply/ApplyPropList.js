import React, { PropTypes } from 'react';
import {FormattedMessage} from 'react-intl';
import ApplyProp from './ApplyProp';

const ApplyPropList = ({groupList}) => (
  <div>
    {groupList.map((item, i) => (
    <ul key={i} className="box-content">
      <li className="service-item"><FormattedMessage id={item.label} defaultMessage={item.label}/></li>
      <li><ApplyProp itemList = {item.itemList}></ApplyProp></li>
    </ul>
    ))}
  </div>
)

ApplyPropList.propTypes = {
  groupList: PropTypes.any.isRequired
}

export default ApplyPropList

