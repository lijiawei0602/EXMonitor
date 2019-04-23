import React from 'react';
class Test extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        }
    }
    render () {
        console.log(this.props);
        return (
            <div>test</div>
        )
    }
}

export default Test;