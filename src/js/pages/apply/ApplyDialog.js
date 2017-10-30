import React, { PropTypes } from 'react'
import { Modal } from 'react-bootstrap';
import ApplyScrollBar from './ApplyScrollBar'


const ApplyDialog = ({ show, title, buttons, message, children }) => (
    <div className="static-modal">
        <Modal show={show}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ApplyScrollBar styles={{ height: 300}}>
                    {children}
                </ApplyScrollBar>
            </Modal.Body>
            <Modal.Footer>
                <div>
                    <div className="apply-warning">
                    {message}
                    </div>
                    {buttons}
                </div>
            </Modal.Footer>
        </Modal>
    </div>
);

ApplyDialog.propTypes = {
    show: PropTypes.bool.isRequired
}

export default ApplyDialog
