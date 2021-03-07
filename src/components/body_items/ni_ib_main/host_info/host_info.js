import React from "react";
import "./host_info.scss";
import data from "./host_info.json";
import QqImg from './img/qq.jpg';
import WechatImg from './img/wechat.jpg';

class HostInfo extends React.Component {

    quickCodeMap = {
        'qq': QqImg,
        'wechat': WechatImg
    }
    
    render() {
        return(
            <div id="host_info">
                <div class="back">
                    <div class="head_img"></div>
                </div>
                <div class="info">
                    <div class="intro">
                        <h1>世幻水</h1>
                        生而为人 <br/>
                        我很抱歉 <br/>
                    </div>
                    <div class="contacts">
                        {data.contacts.map( item => <a className ={item.name + " contact"} href={item.url?item.url:"javascript:void(0);"} target={item.url?"blank":"_self"} rel="nofollow">
                            {item.qcode && <div style={{backgroundImage:`url(${this.quickCodeMap[item.name]})`}}></div>}
                        </a>)}
                    </div>
                </div>
            </div>
        )
    }
}


export default HostInfo;