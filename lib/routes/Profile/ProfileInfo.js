import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchProfile } from '../../actions/application';
import { bindActionCreators } from 'redux';

const mapDispatchToProps=dispatch=>({ actions:bindActionCreators({ fetchProfile },dispatch) });
class ProfileInfo extends React.Component {
    constructor(props) {
      super(props);
      console.log(props);
    }
    componentWillMount() {
      const url=`student/${this.props.params.userId}`;
      this.props.actions.fetchProfile(url);
    }
    render() {
      return (<div>My ProfileInfo</div>);
    }
}

module.exports = connect(({ application })=>({ application }),mapDispatchToProps)(withRouter(ProfileInfo));
