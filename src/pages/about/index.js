import React from 'react';
import {Link} from 'react-router-dom';
import Data from '../../data';

class About extends React.Component {

    constructor(props){
        super(props);
        if(!Data.islogin){
            this.props.history.push("login");
        }
        console.log(this.props.num);
    }

    render = () =>{
        return <>
            <h1>this is about page!!</h1>
            <Link to="/">首页</Link>
            <p>{this.props.num}</p>
        </>;
    }
}
export default About;