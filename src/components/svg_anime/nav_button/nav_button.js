import React from 'react';
import './index.css';

class NavButton extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <label style={{width:this.props.width, height:this.props.height}} id="nav_button">
                <input type="checkbox" onClick={this.props.clickEvent}/>
                <span> </span><span> </span><span> </span>
            </label>
        )
    }
}
export default NavButton;