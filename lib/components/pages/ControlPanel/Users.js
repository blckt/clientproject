import React from 'react';
import { fetchUrl } from '../../../utils/fetchUrl';

import DataTable from './UserView/TableView.jsx';
import { withRouter } from 'react-router';

const DEFAULT_URL='http://localhost:3000/';

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
      !!group.length &&  this.mapGroupInfo(group);
    });
  }
  fetchStudent(id) {
    return id;
  }
  mapGroupInfo(group) {
    const mappedGroup = group.map(student=>{
      student['createdAt']= new Date(student.createdAt).toLocaleDateString();
      student['updatedAt'] = new Date(student.updatedAt).toLocaleDateString();
      delete student.StudentsInGroups;
      return student;
    });
    this.setState({
      data:mappedGroup,
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
