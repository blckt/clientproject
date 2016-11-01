import React from 'react';

import { Panel,ListGroup,ListGroupItem } from 'react-bootstrap';

module.exports = function(result) {
  if (result.Result) {
    return (<Panel header="Success!" bsStyle="success">
            {result.Result}
        </Panel>);
  }
    else {
    return (
            <Panel header="Errors!" bsStyle="danger">
                {(()=>(<ListGroup>
                  {result.Errors.map((item,index)=>
                      <ListGroupItem>{`${index+1}.
                       "${item.ErrorText}" at line:
                       ${item.Line} column:${item.Column}`
                    }</ListGroupItem>)}
                    </ListGroup>))()}
            </Panel>
        );
  }
};

//<ul></li>)</ul>
