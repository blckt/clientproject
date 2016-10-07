import React from 'react';
import { fetchUrl } from '../../../utils/fetchUrl';

import DataTable from './UserView/TableView.jsx';
import { withRouter } from 'react-router';

const DEFAULT_URL = process.env.API_URL ||'http://localhost:3000/';

class UsersView extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      data:null,
      onClick:null
    };
  }

  componentWillMount() {
    const { id } = this.props.params;
    if (id) {
      this.fetchGroup(id);
    } else {
      this.fetchGroups();
    }
  }
  componentWillReceiveProps(props) {
    const { id,userId } = props.params;
    if (!!id) {
      return   this.fetchGroup(id);
    }
    if (!!userId) {
      return this.fetchStudent(id);
    }
    this.fetchGroups();
  }
  fetchGroup(id) {
    fetchUrl(`${DEFAULT_URL}group/${id}`,'GET').then(result=>{
      return result.json();
    }).then(group=>{
      !!group.Students.length &&  this.mapGroupInfo(group);
    });
    fetchUrl(`${DEFAULT_URL}group/info/${id}`,'GET').then(result=>result.json())
    .then(groupInfo=>console.log(groupInfo));
  }
  fetchStudent(id) {
    return id;
  }
  mapGroupInfo(group) {
    group['Students'] = group['Students'].map(student=>{
      delete student['grpId'];
      delete student['GroupId'];
      student['createdAt'] = new Date(group.createdAt).toLocaleDateString();
      student['updatedAt'] = new Date(group.updatedAt).toLocaleDateString();
      student['GroupNumber']=group.Number;
      return student;
    });
    this.setState({
      data:group.Students,
      onClick:this.onStudentClick.bind(this)
    });

  }
  fetchGroups() {
    fetchUrl(`${DEFAULT_URL}groups`,'GET').then(result=>{
      return result.json();
    }).then(groups=>{
      !!groups.length  && this.mapGroupsInfo(groups);
    });
  }
  mapGroupsInfo(groups) {
    const mappedGroups = groups.map((group)=>{
      group['createdAt'] = new Date(group.createdAt).toLocaleDateString();
      group['updatedAt'] = new Date(group.updatedAt).toLocaleDateString();
      return group;
    });
    this.setState({
      data:mappedGroups,
      onClick:this.onGroupClick.bind(this)
    });
  }
  onGroupClick(id) {
    this.props.router.push('/dashboard/group/'+id);
  }
  onStudentClick(id) {
    this.props.router.push('/dashboard/student/'+id);
  }
  render() {
    return (<div>
     { this.state.data &&  <DataTable onClick={this.state.onClick} data={this.state.data}/> }
    </div>);
  }
}

export default withRouter(UsersView);
