import React from 'react';
import {
  Navbar,
} from 'react-bootstrap';
import { Link } from 'react-router';
import { connect } from 'react-redux';

const menuItems = [
  { text: 'Account', to: '/account', icon: 'fa fa-user' },
  { text: 'Dashboard', to: '/dashboard', icon: 'fa fa-wpforms' }
];

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      user:props.application.user
    };
  }
  componentWillReceiveProps(props) {
    const { application:{
      user
    } } = props;
    if (user && user.login) {
      this.setState({
        user
      });
    }
  }
  render() {
    return (<Navbar fluid bsStyle="inverse">
    <Navbar.Header>
      <Navbar.Brand>
        <Link to='/'>Scheduler</Link>
      </Navbar.Brand>

    </Navbar.Header>
    <Navbar.Toggle/>
    {this.state.user && this.state.user.login && <Navbar.Collapse>
      { menuItems.map(( item, index ) => {
        const { text, ...rest } = item;
        return <Navbar.Text key={index}><Link key={index}{...rest}>{item.text}</Link></Navbar.Text>;
      }) }
      <Navbar.Text pullRight>
        Signed in as: <Navbar.Link href="#">{this.state.user.login || ''}</Navbar.Link>
      </Navbar.Text>
      <Navbar.Text pullRight>
        Welcome!
      </Navbar.Text>
    </Navbar.Collapse>}
  </Navbar>);
  }
}
export default connect(({ application })=>({ application }))(Header);
