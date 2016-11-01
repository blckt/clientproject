import React from 'react';

import { withRouter } from 'react-router';
import { findDOMNode } from 'react-dom';

import { fetchUrl } from '../../../utils/fetchUrl';
import { Col, Row, Button, ButtonToolbar } from 'react-bootstrap';

import Notifications from './Notification';
import brace from 'brace'; //eslint-disable-line
import Ace from 'react-ace';

import 'brace/mode/csharp';
import 'brace/theme/github';

class Ide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    const { id } = this.props.params;
    this.setState({ taskId: id });
    fetchUrl(`task/${id}`, 'GET', null)
      .then(data => data.json())
      .then(task => this.initEvents.call(this, task));
  }

  componentDidMount() {

  }
  initEvents(task) {
    this.setState({ task, code:task.Template });
    const sumbitBtn = findDOMNode(this.refs.submit_btn);
    const updateTask = findDOMNode(this.refs.updateTask_btn);
    console.log(sumbitBtn);
    sumbitBtn.addEventListener('click', () => {
      fetchUrl(`task/${this.state.taskId}/verify`, 'POST', JSON.stringify({ code: this.state.code }))
        .then(data => data.json())
        .then(result=>this.setState({ result }));
    });
    updateTask.addEventListener('click', () => {
      let {task} = this.state;
      task.Template = this.state.code;
      fetchUrl(`task/${this.state.taskId}/update`, 'POST', JSON.stringify(task))
      
    });
  }
  codeChange(code) {
    this.setState({
      code
    });
  }
  render() {
    return (
      <Row>
        {(() => {
          if (this.state.task) {
            return (<div>
              <Row>
                <Col sm={12} xs={12} lg={8}>
                  <Ace
                    className="editor"
                    width="100%"
                    height="450px"
                    mode="csharp"
                    theme="github"
                    value={this.state.code}
                    onChange={this.codeChange.bind(this)}
                    />
                </Col>
                <Col sm={12} lg={4}>
                 {this.state.result &&  <Notifications {...this.state.result}/>}
        </Col>
              </Row>
              <Row style={{ margin: '10px 0' }}>
                <Col sm={4}>
                  <ButtonToolbar>
                    <Button bsStyle="info" ref="submit_btn"> Submit </Button>
                    <Button bsStyle="danger" ref="updateTask_btn"> Update</Button>
                  </ButtonToolbar>
                </Col>
              </Row></div>);
          }
        })()}
      </Row>
    );
  }
}

module.exports = withRouter(Ide);
