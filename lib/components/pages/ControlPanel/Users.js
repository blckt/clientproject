import React from 'react';
import 'whatwg-fetch';

import DataTable from './UserView/TableView.jsx';


const DEFAULT_URL='http://localhost:3000/';

class UsersView extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      data:null
    };
  }

  componentWillMount() {
    fetch(`${DEFAULT_URL}groups`,{
      method:'GET',
      headers: new Headers ({ 'Authorization': localStorage.token })
    }).then(result=>{
      return result.json();
    }).then(groups=>{
      this.mapGroupsInfo(groups);
    });
  }
  mapGroupsInfo(groups) {
    const mappedGroups = groups.map((group)=>{
      group['createdAt']= new Date(group.createdAt).toLocaleDateString();
      group['updatedAt'] = new Date(group.updatedAt).toLocaleDateString();
      return group;
    });
    this.setState({
      data:mappedGroups
    });
  }
  render() {
    return (<div>
     {this.state.data &&  <DataTable data={this.state.data}/>}
    </div>);
  }
}

export default UsersView;
