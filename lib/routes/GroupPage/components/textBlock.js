import React from 'react';
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
export default function ({ text,value }) {
  return ( <div style={styles.labelContainer}>
            <span style={styles.label}>{text} :</span>
            <span style={styles.labeled}>{value}</span>
            </div>);
}
