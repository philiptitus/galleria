import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div>
      <Row className='justify-content-center'>
        <Col xs='auto'>
          <h4 style={{ fontSize: '7px' }}>
             &copy;{' '}
            <Link
              to='https://mrphilip.pythonanywhere.com/'
              style={{
                fontWeight: 'bolder',
                color: 'red'
              }}
            >
              Philip Titus
            </Link>{' '}
            All Rights Reserved
          </h4>
        </Col>
      </Row>
    </div>
  );
}

export default Footer;
