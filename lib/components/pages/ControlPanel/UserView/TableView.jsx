import React, { PropTypes } from 'react';
import {
  Table, Column, Cell
}
from 'fixed-data-table';
import { Grid,Row,FormGroup,ControlLabel,FormControl } from 'react-bootstrap';

const CLOSEST_SELECTOR= '.fixedDataTableCellGroupLayout_cellGroup';
const HOVER_CLASSNAME='row-hovered';

class TableView extends React.Component {
  constructor(props) {
    super(props);
    this.data=props.data;

    this.state={
      filteredList:this.data,
      searchValue:''
    };
    this._onFilterChange=this._onFilterChange.bind(this);
  }

  static propTypes = {
    data:PropTypes.arrayOf(PropTypes.any),
    onClick:PropTypes.func.isRequired
  };
  componentWillReceiveProps(props) {
    this.setState({
      filteredList:props.data
    });
  }

  _onFilterChange(e) {
    if (!e.target.value) {
      return this.setState({
        filteredList:this.data,
        searchValue:e.target.value
      });
    }
    let filterBy = e.target.value.toLowerCase();
    let filteredList = this.data.filter(item=>
    Object.keys(item)
    .some(key=>item[key].toString().toLowerCase().indexOf(filterBy)!==-1));
    filteredList=!!filteredList.length?filteredList:null;
    this.setState({
      filteredList,
      searchValue:e.target.value
    });
  }
   getValidationState() {
     const length = this.state.filteredList?this.state.filteredList.length:0;
     if (length > 10) return 'success';
     if (length === 0) return 'error';
   }
   tableOnRowMouseEnter(e) {
     const node = e.target.closest(CLOSEST_SELECTOR);
     node.classList.add(HOVER_CLASSNAME);
   }
    tableOnRowMouseLeave(e) {
      const node = e.target.closest(CLOSEST_SELECTOR);
      node.classList.remove(HOVER_CLASSNAME);
    }
  tableOnClick(e) {
    this.props.onClick(e.target.closest(CLOSEST_SELECTOR).firstChild.textContent);
  }
  render() {
    const  { filteredList:data }  = this.state;
    const columnsCount=!!data?Object.keys(data[0]).length:1;
    const MAX_WIDTH=750;
    const MAGIC_NUMBER=2;
    const columnWidth=MAX_WIDTH/columnsCount-MAGIC_NUMBER;
    let columns =data?Object.keys(data[0]).map((key,index)=>{
      if (key==='id') {
        return (<Column
              key={index}
              header={<Cell style={{ display:'none' }} >{key}</Cell>}
              flexGrow={1}
              style={{ display:'none' }}
              width={0}
              cell={cellProps=>(<Cell style={{ display:'none' }} {...cellProps}>{data[cellProps.rowIndex][key]}</Cell>)}
            />);
      }
      return (<Column
              key={index}
              header={key}
              flexGrow={1}
              width={Math.round(columnWidth)}
              cell={cellProps=>(<Cell {...cellProps}>{data[cellProps.rowIndex][key]}</Cell>)}
            />);
    }):null;
    return (<Grid>
    <Row>
    <FormGroup controlId={"search"} style={{ width:MAX_WIDTH }} validationState={this.getValidationState()}>
      <ControlLabel>Search field...</ControlLabel>
      <FormControl type="text" value={this.state.searchValue} placeholder="Search..." onChange={this._onFilterChange}/>
    </FormGroup>
    </Row>
    <Row>
      {
        !!data && <Table
          height={350}
          width={MAX_WIDTH}
          rowHeight={50}
          headerHeight={50}
          onRowMouseEnter={this.tableOnRowMouseEnter.bind(this)}
          onRowMouseLeave={this.tableOnRowMouseLeave.bind(this)}
          onRowClick={this.tableOnClick.bind(this)}
          rowsCount={data.length}>
          {
            columns
          }
        </Table>
      }</Row>
    </Grid>);
  }
}
export default TableView;
