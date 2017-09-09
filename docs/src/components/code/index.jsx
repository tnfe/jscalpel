import React, { Component } from 'react';
import Highlight from 'react-highlight';

class JscalpelCode extends Component {
    render () {
        return (<Highlight  className='js'>
            {'Jscalpel({\n target:data})'}
        </Highlight>);
    }
} 

export default JscalpelCode;