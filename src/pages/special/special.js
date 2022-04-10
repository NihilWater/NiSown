import React from "react";
import { withRouter } from 'react-router-dom';
import './special.scss';
import '../../components/body_items/markdown/markdown.scss';
import NiNav from '../../components/ni_nav/ni_nav';
import "../../components/ni_index_body/body_horizontal_layout.scss";
import HostInfo from "../../components/body_items/ni_ib_main/host_info/host_info";
import Labels from '../../components/body_items/ni_ib_main/labels/labels';
import HotArtical from '../../components/body_items/ni_ib_main/hot_article/hot_article';
import axios from 'axios';

class SpecialPage extends React.Component {



    state = {
        html: '<h2>404,抱歉未找到你要的文章</h2>',
        currentPage: 1,
        href: '/',
        subtitle: {}
    }


    /* 获取数据 */
    componentDidMount() {
        let path = this.props.location.pathname;
        this.doPathhandle(path);
    }


    componentWillReceiveProps(newProps) {
        let path = this.props.history.location.pathname;
        if (path !== this.state.href) {
            this.doPathhandle(path);
        }
    }

    /* 路由方法过滤器，将0/0 自动过滤成第一篇文章 */
    doPathhandle = (path)=>{
        let that = this;
        path = path.substr('/special/'.length);
        let topic = path.split('/')[0];
        if(path.endsWith("0/0")){
            this.getSubTitles(topic, ()=>{
                for(let k in that.state.subtitle){
                    this.readArtical(that.state.subtitle[k][0].href)
                    break
                }
            })
        }else{
            this.getSubTitles(topic)
            this.readArtical(path)
        }
    }


    /* 点击查看某一片文章时发生的回调方法 */
    readArtical = (path) => {
        let that = this;
        axios({
            method: "GET",
            url: `/data/${path}.html`,
            contentType: "text/html; charset=utf-8", //请求的媒体类型
        }).then(res => {
            // 初始化数据
            that.setState({
                html: res.data,
                href: path
            })
        }).catch(err=>{
            that.setState({
                html: '<h2>404,抱歉未找到你要的文章</h2>',
                href: path
            })
        })
    }

    /* 获取一个专栏下的所有子标题 */
    getSubTitles = (topic, callback) => {
        let that = this;
        axios({
            method: "GET",
            url: `/data/${topic}.json`,
            contentType: "text/html; charset=utf-8", //请求的媒体类型
        }).then(res => {
            // 初始化数据
            console.log(res)
            that.setState({
                subtitle: res.data
            }, callback)
        })
    }

    /* 生产抽屉数据 */
    getLeftData = () => {
        let that = this;
        return Object.keys(this.state.subtitle).map(key => {
            return <div class="subtitle" >
                <input class="drawer-k" type="checkbox" id={key} />
                <label className="drawer-k2" for={key} ></label>
                <label className="drawer-p" for={key}>{key}</label>
                {that.state.subtitle[key].map(el =>
                    <div className="drawer-c" title={el.title} onClick={(e) => { 
                        this.props.history.push(`/special/${el.href}`)
                    }}>{el.title}</div>)
                }
                
            </div>
        })
    }

    render = () => {
        return <div id="ni_special" className="body_horizontal_layout">
            <NiNav />
            <div className="container">
                <div style={{ width: '100%', height: '4rem' }}></div>
                <div class="ni_ib_main">
                    <div class="ni_ib_main_left">
                        {this.getLeftData()}
                    </div>
                    <div className='markdown' dangerouslySetInnerHTML={{ __html: this.state.html }}></div>
                    <div class="ni_ib_main_right">
                        <HostInfo />
                        <Labels history={this.props.history}/>
                        <HotArtical />
                    </div>
                </div>
            </div>
        </div>
    }
}

export default withRouter(SpecialPage);