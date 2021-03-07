import React from 'react';
import axios from 'axios';
import "./ni_carousel.scss";

class NiCarousel extends React.Component {

        componentDidMount(){
            this.generateCarousel(this.props.id);
        }
        state={}

        /* 切换轮播图方法 */
        changeCarouselTo(carouseId, to_idx) {
            let that = this;
            // console.log(this.state[carouseId +'RealItems'])
            // console.log(this.state[carouseId + 'Current'])
            // console.log(that.state[carouseId + "Size"])
            // 设置当前的轮播图透明度为0, 导航栏的透明度为0.6
            this.state[carouseId +'RealItems'][that.state[carouseId + 'Current']].style.opacity = 0;
            this.state[carouseId +'RealItems']
                [that.state[carouseId + "Size"]]
                        .childNodes[that.state[carouseId + 'Current']].style.opacity = 0.6;
            
            // 设置新的轮播图的透明度为1, 导航栏的透明度为1
            this.state[carouseId +'RealItems'][to_idx].style.opacity = 1;
            this.state[carouseId +'RealItems']
                [that.state[carouseId + "Size"]]
                        .childNodes[to_idx].style.opacity = 1;
    
            // // 记录新的的轮播图
            this.setState({
                [carouseId + 'Current']: to_idx,
            })
        }
    
        /* 获取轮播图内容 */
        generateCarousel(id){
            let that = this;
            axios({
                method:"GET",
                url: "/json/news.json",
                async:"/"
            }).then(res => {
                // 初始化数据
                that.setState({
                    /* 将结结果为以格式
                        <div id="Carousel1"> </div>  (轮播图元素)
                        <div id="Carousel2"> </div>
                        <div id="Carousel3"> </div>
                        <ul>   (控件)
                            <li target="Carousel1"> </li>
                            <li target="Carousel2"> </li>
                            <li target="Carousel3"> </li>
                        </ul>
                    */
                    [id +'Items']: 
                        res.data.map((item, idx) => 
                            <div id={id + "_" + idx} style={{backgroundImage: "url(" + item.url + ")", opacity:idx===0?"1":"0"}}>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.des}</p>
                                </div>
                            </div>
                        ).concat([
                            <ul style={{width: + res.data.length *10 + "%"}}>
                                {res.data.map((_, idx) => <li style={{opacity:idx===0?"1":"0.6"}} onClick={() => this.changeCarouselTo(id, idx)}> </li>)}
                            </ul>
                        ]),
                    [id + "Size"]: res.data.length,      // 轮播图元素数目
                    [id + 'Current']: 0           // 当前显示的轮图
                })
                // 将列表里的虚拟dom换成真的，方便之后的dom 操作
                setTimeout(() =>{
                    that.state[id +'RealItems'] = document.getElementById(id + "_0").parentNode.childNodes;
                    console.log(that.state[id +'RealItems']);
                }, 1000);
    
                // 设置自动切换
                setInterval(()=>{
                    // 让轮播图往后走一页，如果到里最后一页就从头开始
                    let carouselTemp;
                    if (this.state[id + 'Current'] >= this.state[id + "Size"] - 1){
                        carouselTemp = 0;
                    }else{
                        carouselTemp = this.state[id + 'Current'] + 1
                    }
                    // 调用切换轮播图算法
                    that.changeCarouselTo(id, carouselTemp);
                }, 3000)
            })
        }
        
        render() {
            return (
                <div className={this.props.className}>  
                    {this.state[this.props.id+"Items"]}
                </div>
            )
        }
}


export default NiCarousel;