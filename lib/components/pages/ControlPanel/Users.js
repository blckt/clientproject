import React, { PropTypes } from 'react';

class UsersView extends React.Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    data: PropTypes.any,
  }
  componentWillMount() {

  }

  render() {
    return (<div>
      Hello,Pisos!
    </div>);
  }
}

export default UsersView;
