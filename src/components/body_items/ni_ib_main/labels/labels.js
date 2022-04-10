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
        axios.get("/data/lables.json").then(
            res =>{
                console.log(res.data.labels)
                this.setState({
                    labels:res.data.labels
                })
            }
        )
    }

    /* 跳转方法 */
    goSpecial = (href)=>{
        this.props.history.push(`/special/${href}/0/0`)
    }

    render(){
        return (
            <div className= "labels">
                {this.state.labels.map(item =>{
                    return <div style={{backgroundColor: colors.colors[Math.floor(Math.random()*4)]}} onClick={()=>this.goSpecial(item.href)}>{item.label}</div>
                })}
            </div>
        )
    }
}


export default Labels;