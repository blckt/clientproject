import React from 'react';
import { withRouter } from 'react-router';

//import { fetchUrl } from '../../utils/fetchUrl';
import { Row } from 'react-bootstrap';
class AdminPanel extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    const spinner = (<div>loading</div>);
    return (
      <Row>
        {this.state.data ? spinner:''}
      </Row>
    );
  }
}
module.exports = withRouter(AdminPanel);
