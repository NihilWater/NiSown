import React from 'react';

import IdxMain from './img/idx_main.png';
import './index.scss';
import IdxBack from './img/idx_back.jpg';
import Logo_wt from './img/nw_wt.png';
import {snows_stop, Sownback} from '../snowback/index';

class NiIndexHead extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            newposition: '0 0',
            sownposition: '0, 0' ,
            p1_position: [20, 5],
            bg_position: [50, 50],
            bg_blur:5
        };
    }


    // 改变图片位置关系
    anime1 = () =>{
        let e = window.event;
        this.setState({
            newposition: '-' + e.pageY / 20 + "px -" + e.pageX / 10 + "px" ,
            sownposition: '-' + e.pageX / 20 + "px, " + 0 + "px" ,
            p1_position: [20-e.pageX/1000, 5 +e.pageY/300],
            bg_position: [50-e.pageX/40, 50+e.pageY/400]
        })
    }

    // 改变背景的模糊程度
    anime2 = () => {
        this.setState({
            bg_blur : 0
        });
    }
    anime2_1 = () => {
        this.setState({
            bg_blur : 10
        });
    }
    anime2_2 = () => {
        this.setState({
            bg_blur : 5
        });
    }

    // 控制雪花下落暂停
    key_snow = () => {
        snows_stop.key = !snows_stop.key;
    }
    down = (e) =>{
        if(e.deltaY>0 && document.body.clientWidth>888){
            document.getElementById("ni_index_head_after").style.height=0;
            snows_stop.key = true;
        }
    }
    

    render = () => {
        return [
            <div id="ni_index_head">
                <div className="dynamic_img" onClick={this.key_snow} onMouseMove={this.anime1} onWheel={this.down}>
                    <div className="back_img" style={{
                        backgroundImage : "url(" + IdxBack + ")",
                        backgroundPosition: "" + this.state.bg_position[0]+ "% " + this.state.bg_position[1] + "%",
                        filter:"blur(" + this.state.bg_blur +"px)"
                    }}>
                    </div>
                    <div id="back_snow_box" style={{width:"100%", height:"100%", transform: "translate("+this.state.sownposition+")"}}>
                        <Sownback id="back_snow" style={{width:"100%", height:"100%"}} size="4"/>
                    </div>
                    <img className="p1 hover_vivid" onMouseOver={this.anime2_2} onMouseLeave={this.anime2} src={IdxMain} alt='p1' style={{right :'-'+this.state.p1_position[0]+"%", top:'-'+this.state.p1_position[1]+"%"}}/>
                    <div id="motto">
                        <p className="hover_vivid hover_show" onMouseOver={this.anime2_1} onMouseLeave={this.anime2} style={{margin: this.state.newposition}}> 我曾预料过天，曾预料过地，却没能预料自己。走过街，走过巷，才发现又到了原地。</p>
                    </div>
                    <div>
                        <img id="logo_img" className="hover_show" src={Logo_wt} alt='logo' />
                    </div>
                </div>
                <Sownback style={{width:"100%", height:"100vh"}} id="fount_snow"/>
                <div className="main">nadjio</div>
            </div>,
            <div id="ni_index_head_after" ></div>
        ]
    }
}

export default NiIndexHead;