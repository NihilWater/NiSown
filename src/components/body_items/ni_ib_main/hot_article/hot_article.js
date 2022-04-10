import React from 'react';
import axios from 'axios';
import "./hot_article.scss";
import colors from './color.json';

class HotArtical extends React.Component{
    state = {
        articles :[]
    }
    constructor(props){
        super(props);
        this.getArticals();
    }

    /* 异步获取标签 */
    getArticals(){
        axios.get("/json/hot_articles.json").then(
            res =>{
                console.log(res.data.articles)
                this.setState({
                    articles:res.data.articles
                })
            }
        )
    }

    render(){
        return (
            <section className= "hot_articles">
                <ul >
                    {this.state.articles.map((item, idx) => <li style={{backgroundColor: colors.colors[Math.floor(Math.random()*4)]}}>
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