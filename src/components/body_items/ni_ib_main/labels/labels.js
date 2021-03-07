import React from 'react';
import axios from 'axios';
import "./labels.scss";
import colors from './color.json';

class Labels extends React.Component{
    state = {
        labels :[]
    }
    constructor(props){
        super(props);
        this.getLabels();
    }

    /* 异步获取标签 */
    getLabels(){
        axios.get("/json/labels.json").then(
            res =>{
                console.log(res.data.labels)
                this.setState({
                    labels:res.data.labels
                })
            }
        )
    }

    render(){
        return (
            <div className= "labels">
                {this.state.labels.map(item =>{
                    return <div style={{backgroundColor: colors.colors[Math.floor(Math.random()*4)]}}>{item}</div>
                })}
            </div>
        )
    }
}


export default Labels;