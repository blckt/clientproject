import React from 'react';
import { withRouter } from 'react-router';

import { fetchUrl } from '../../utils/fetchUrl';
import { Panel,Col,Row } from 'react-bootstrap';
import TextBlock from './components/textBlock';
import DataTable from '../../components/pages/ControlPanel/UserView/TableView.jsx';
const styles={
  infoRow:{
    maxHeight:250,
    margin:10
  },
  Row:{
    margin:10
  },
  GroupNumber:{
    box:{
      width:'100%',
      height:150,
      textAlign:'center',
      fontSize: 72,
      lineHeight:2,
      borderRadius:'6%',
      backgroundColor:'grey'
    }
  }
};
class GroupPage extends React.Component {
    constructor(props) {
      super(props);
      this.state={
        group:null,
        groupInfo:null,
      };
    }
    componentWillMount() {
      console.log(this.props);
      const { id } =this.props.params;
      id && this.fetchGroup(id);
    }
    componentWillReceiveProps(props) {
      const { id } =props;
      id && !this.state.data && this.fetchGroup(id);
    }
    fetchGroup(id) {
      fetchUrl(`group/${id}`,'GET').then(result=>{
        return result.json();
      }).then(group=>{
        !!group.Students.length &&  this.mapGroupInfo(group);
      });
      fetchUrl(`group/info/${id}`,'GET').then(result=>result.json())
    .then(groupInfo=>this.setState({
      groupInfo
    }));
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
          data:group
        // onClick:this.onStudentClick.bind(this)
        });

      }
       onStudentClick(id) {
         this.props.router.push('/dashboard/student/'+id);
       }
render() {
  const { data:group,groupInfo } = this.state;
  let avg = groupInfo?groupInfo.reduce((prevValue,student,)=>{
    if (typeof prevValue==='object') {
      prevValue=0;
    }
    return prevValue+(+student.Sessions[0].avg);
  })/groupInfo.length:0;
  avg=avg.toString().substring(0,4);
  const spinner=(<div>loading</div>);
  const groupPanel=group?(<Panel header={`Группа номер ${group && group.Number}`}>
        <Row style={styles.Row}>
        <Col md={3} sm={3} style={styles.infoRow}>
        <div style={styles.GroupNumber.box}><span>{group.Number}</span></div></Col>
        <Col md={8} sm={8}>
        <TextBlock text="Количество студентов" value={group.Students.length}/>
         <TextBlock text="Средний балл группы" value={avg}/>
                <TextBlock text="Создана" value={new Date(group.createdAt).toLocaleDateString()}/>
        <TextBlock text="Обновлена" value={new Date(group.updatedAt).toLocaleDateString()}/>
        </Col>
        </Row>
        <Row style={styles.Row}>
        <DataTable onClick={this.onStudentClick.bind(this)}
        data={this.state.data.Students}/>
        </Row>
  </Panel>):'';
  return (
  <Row>
    {this.state.data?groupPanel:spinner}
  </Row>
  );
}
}
module.exports = withRouter(GroupPage);
