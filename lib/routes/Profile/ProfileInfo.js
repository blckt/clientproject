import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchProfile } from '../../actions/application';
import { bindActionCreators } from 'redux';

import ViewInfo from './components/ViewInfo';

const mapDispatchToProps=dispatch=>({ actions:bindActionCreators({ fetchProfile },dispatch) });

class ProfileInfo extends React.Component {
    constructor(props) {
      super(props);
      this.state={
        studentProfile:null
      };
    }
    componentWillMount() {
      const urlUser=`student/${this.props.params.userId}`;
      const statsUrl=`student/${this.props.params.userId}/info`;
      this.props.actions.fetchProfile(urlUser);
      this.props.actions.fetchProfile(statsUrl);

    }
    componentWillReceiveProps(props) {
      const { studentProfile } = props.application;
      if (studentProfile) {
        this.setState({
          studentProfile
        });
      }
    }
    render() {
      return (<div>{this.state.studentProfile && <ViewInfo profile={this.state.studentProfile}/>}</div>);
    }
}

module.exports = connect(({ application })=>({ application }),mapDispatchToProps)(withRouter(ProfileInfo));
