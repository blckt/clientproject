import React, { PropTypes } from 'react';
import {
  Table, Column, Cell
}
from 'fixed-data-table';

class TableView extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    data:PropTypes.arrayOf(PropTypes.any).isRequired
  }

  render() {
    const { data } = this.props;
    return (<Table>
      <Column height={350}
        width={452}
        rowHeight={50}
        headerHeight={50}
        rowsCount={data.length}/>
    </Table>);
  }
}
export default TableView;
