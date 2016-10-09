import React from 'react';
import { withRouter } from 'react-router';

import { fetchUrl } from '../../utils/fetchUrl';
import { Panel, Col, Row } from 'react-bootstrap';
import TextBlock from './components/textBlock';
import Stats from '../../components/Stats';
import DataTable from '../../components/pages/ControlPanel/UserView/TableView.jsx';
const styles = {
  infoRow    : {
    maxHeight: 250,
    margin   : 10
  },
  Row        : {
    margin: 10
  },
  GroupNumber: {
    box: {
      width          : '100%',
      height         : 150,
      textAlign      : 'center',
      fontSize       : 72,
      lineHeight     : 2,
      borderRadius   : '6%',
      backgroundColor: 'grey'
    }
  }
};
class GroupPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      group    : null,
      groupInfo: null,
    };
  }

  componentWillMount () {
    const { id } =this.props.params;
    id && this.fetchGroup(id);
  }

  generateConfig () {
    const {
      groupInfo:{
        sessions:groupInfo
      }
    } = this.state;
    let configs = {};
    const Student = groupInfo[0].Sessions[0];
    const { exams } =Student;
    const years = { startYear: Student.startYear, endYear: Student.endYear };
    configs.xAxis = {
      categories: exams.map(exam=> {
        if (exam.Type && exam.Type.toLowerCase().indexOf('екз') > -1) {
          return exam.ExamName;
        }
      }).filter(examName=>!!examName)
    };
    const {
      xAxis:{
        categories
      }
    } = configs;
    configs.chart = {
      type: 'column'
    };
    configs.series = [
      {
        data: categories.map(cat=> {
          return {
            y        : +(groupInfo.reduce((prev, curr)=> {
              let value = 0;
              curr.Sessions[curr.Sessions.length - 1].exams.forEach(exam=> {
                if (exam.Type && exam.Type.toLowerCase().indexOf('екз') > -1 && exam.ExamName === cat) {
                  value = +exam.Balone;
                }
              });
              return prev + value;
            }, 0)/groupInfo.length).toString().substring(0, 4),
            name     : cat,
            drilldown: cat
          };
        })
      }
    ];
    configs.drilldown = {};
    configs.drilldown.series = categories.map(cat=> {
      return {
        id          : cat,
        colorByPoint: true,
        data        : groupInfo.map(student=> {
          let value = 0;
          student.Sessions[student.Sessions.length - 1].exams.forEach(exam=> {
            if (exam.Type && exam.Type.toLowerCase().indexOf('екз') > -1 && exam.ExamName === cat) {

              value = +exam.Balone;

            }
          });
          return {
            name: student.Name,
            y   : value
          };
        })
      };
    });
    configs = Object.assign({}, configs, {
      chart  : {
        type: 'column'
      },
      credits: {
        enabled: false
      },
      legend : {
        enabled: false
      },
      title  : {
        text: `Результаты сессии ${years.startYear}-${years.endYear} годов`
      },
      xAxis  : {
        type: 'category'
      }
    });
    this.setState({ configs });
  }

  componentWillReceiveProps (props) {
    const { id } =props;
    id && !this.state.data && this.fetchGroup(id);
  }

  fetchGroup (id) {
    fetchUrl(`group/${id}`, 'GET').then(result=> {
      return result.json();
    }).then(group=> {
      !!group.Students.length && this.mapGroupInfo(group);
    });
    fetchUrl(`group/info/${id}`, 'GET').then(result=>result.json())
      .then(groupInfo=> {
        this.setState({
          groupInfo
        });
        this.generateConfig();
      });
  }

  mapGroupInfo (group) {
    group['Students'] = group['Students'].map(student=> {
      delete student['grpId'];
      delete student['GroupId'];
      student['createdAt'] = new Date(group.createdAt).toLocaleDateString();
      student['updatedAt'] = new Date(group.updatedAt).toLocaleDateString();
      student['GroupNumber'] = group.Number;
      return student;
    });
    this.setState({
      data: group
      // onClick:this.onStudentClick.bind(this)
    });

  }

  onStudentClick (id) {
    this.props.router.push('/dashboard/student/' + id);
  }

  render () {
    const { data:group, groupInfo } = this.state;
    let avg = groupInfo ? groupInfo.group.reduce((prevValue, student,)=> {
      if (typeof prevValue === 'object') {
        prevValue = 0;
      }
      return prevValue + (+student.Sessions[0].avg);
    })/groupInfo.group.length : 0;
    avg = avg.toString().substring(0, 4);
    const spinner = (<div>loading</div>);
    const groupPanel = group ? (<Panel header={`Группа номер ${group && group.Number}`}>
      <Row style={styles.Row}>
        <Col md={3} sm={3} style={styles.infoRow}>
          <div style={styles.GroupNumber.box}><span>{group.Number}</span></div>
        </Col>
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
      <Row>{this.state.configs && <Stats configs={this.state.configs}/>}</Row>
    </Panel>) : '';
    return (
      <Row>
        {this.state.data ? groupPanel : spinner}
      </Row>
    );
  }
}
module.exports = withRouter(GroupPage);
