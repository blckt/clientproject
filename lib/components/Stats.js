import React from 'react';
import { findDOMNode } from 'react-dom';
import Highcharts from 'highcharts'; //eslint-disable-line
import drilldown from 'highcharts-drilldown';

class Stats extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    drilldown(Highcharts);
    this.chart = new Highcharts['Chart'](findDOMNode(this), this.props.configs);
  }

  componentWillUnmount () {
    this.chart.destroy();
  }

  render () {
    return (<div id={this.props.id||'chart'}></div>);
  }
}

module.exports = Stats;
