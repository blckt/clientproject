import React,{ PropTypes } from 'react';
import { Panel,Image,Col,Row } from 'react-bootstrap';
import { Link } from 'react-router';
const DEFAULT_IMAGE=`http://cdnstatic.visualizeus.com/thumbs/91/b3/avatar,darthvader,face,icon,
illustration,starwars-91b3be01fedd96d9b84045f8a5f0a4ba_h.jpg`;

const styles={
  panel:{
    minHeight:'250px'
  },
  avatarImage:{ maxWidth:'100%' },
  label:{
    color:'#828282'
  },
  labeled:{
    color:'#2a5885'
  },
  labelContainer:{
    float:'left',
    width:'50%'
  }
};
class Info extends React.Component {
    constructor(props) {
      super(props);
      console.log(Text);
    }
    static propTypes={
      profile:PropTypes.object
    }
    render() {
      const { profile } = this.props;
      const OkIcon=(<span className="glyphicon glyphicon-ok"></span>);
      const FalseIcon=(<span className="glyphicon glyphicon-remove"></span>);
      const createdAt=new Date(profile.createdAt).toLocaleDateString();
      const updatedAt=new Date(profile.updatedAt).toLocaleDateString();
      const linkText =`Группа ${this.props.profile.group.Number}`;
      return (<Panel style={styles.panel}
      header={<Link to={`/dashboard/group/${profile.group.id}`}>{linkText}</Link>}  bsStyle="info">
        <Row>
        <Col sm={3} md={3}>
        <Image src={DEFAULT_IMAGE} style={styles.avatarImage} rounded responsive/>
        </Col>
        <Col sm={9} md={9}>
        <Panel header={profile.Name}>
            <div style={styles.labelContainer}>
            <span style={styles.label}>Форма обучение :</span>
            <span style={styles.labeled}>{profile.StudyType}</span>
            </div>
            <div style={styles.labelContainer}>
            <span style={styles.label}>Стипендия :</span>
             <span style={styles.labeled}>{profile.isGrant?OkIcon:FalseIcon}</span>
             </div>
            <div style={styles.labelContainer}>
            <span style={styles.label}>Зарегистрирован :</span>
            <span style={styles.labeled}>{createdAt}</span>
            </div>
              <div style={styles.labelContainer}>
            <span style={styles.label}>Обновлен :</span>
            <span style={styles.labeled}>{updatedAt}</span>
            </div>
        </Panel>
      </Col>
        </Row>
      </Panel>);
    }
}

module.exports = Info;
