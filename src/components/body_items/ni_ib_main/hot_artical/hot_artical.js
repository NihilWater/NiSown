import React from 'react';
import axios from 'axios';
import "./hot_artical.scss";
import colors from './color.json';

class HotArtical extends React.Component{
    state = {
        articals :[]
    }
    constructor(props){
        super(props);
        this.getArticals();
    }

    /* 异步获取标签 */
    getArticals(){
        axios.get("/json/hot_articals.json").then(
            res =>{
                console.log(res.data.articals)
                this.setState({
                    articals:res.data.articals
                })
            }
        )
    }

    render(){
        return (
            <section className= "hot_articals">
                <ul >
                    {this.state.articals.map((item, idx) => <li style={{backgroundColor: colors.colors[Math.floor(Math.random()*4)]}}>
                                <h3>{idx + 1}:</h3>
                                <span>{item.title}</span>
                            </li>
                    )}
                </ul>
            </section>
        )
    }
}


export default HotArtical;