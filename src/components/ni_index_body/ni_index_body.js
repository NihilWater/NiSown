import React from 'react';
import "./index.scss";
import 'highlight.js/styles/nord.css';
import axios from 'axios';
import HostInfo from "../body_items/ni_ib_main/host_info/host_info";
import Articals from "../body_items/articals/articals";
import PageKeys from '../body_items/page_keys/page_keys';
import NiCarousel from '../ni_carousel/ni_carousel';
import Labels from '../body_items/ni_ib_main/labels/labels';
import HotArtical from '../body_items/ni_ib_main/hot_artical/hot_artical';

class NiIndexBody extends React.Component {

    state = {
        // carouselItems:[],    // 轮播图序列
        articals: [],        // 文章列表数据
        isMarkdown: false,
        html: <></>,
        currentPage:1
    }

    /* 获取数据 */
    componentDidMount() {
        this.getArticalList(1);
    }

    /* 获取文章数据方法 */
    getArticalList = (pageNumber) => {
        let that = this;
        axios({
            method: "GET",
            url: "/json/artical" + pageNumber + ".json",
            async: "/"
        }).then(res => {
            // 初始化数据
            console.log(res)
            that.setState({
                currentPage: pageNumber,
                articals: res.data.articals
            })
        })
    }

    /* 点击查看某一片文章时发生的回调方法 */
    readArtical = (path) => {
        console.log("124")
        let that = this;
        axios({
            method: "GET",
            url: `/data/${path}.html`,
            contentType: "text/html; charset=utf-8", //请求的媒体类型
        }).then(res => {
            // 初始化数据
            console.log(res)
            that.setState({
                isMarkdown: true,
                html: res.data
            })
        })
    }

    /* 返回到主页 */
    backArticals = ()=>{
        this.setState({
            isMarkdown: false
        })
    }

    render() {

        return (
            <div id="ni_index_body">
                <section id="ni_index_body_s">
                    <div className="container">
                        <div style={{ width: '100%', height: '4rem' }}></div>
                        <div id="ni_news">
                            <h1 style={{ fontSize: '3rem', textAlign: 'center' }}>置顶文章</h1>
                            <div className="pic-text">
                                <NiCarousel className="carousel" id="carousel1" />
                                <div className="news-card">
                                    <div className="card-item"></div>
                                    <div className="card-item"></div>
                                    <div className="card-item"></div>
                                    <div className="card-item"></div>
                                    <div className="card-item"></div>
                                    <div className="card-item"></div>
                                </div>
                            </div>
                        </div>
                        <div class="ni_ib_main">
                            <div style={{ width: '100%' }}>
                                {this.state.isMarkdown && <div class="goback" onClick={this.backArticals}>&lt;&lt;&lt;返回</div>}
                                {this.state.isMarkdown ? <div className='markdown' dangerouslySetInnerHTML={{ __html: this.state.html }}></div>
                                    : <div class="artical"><Articals data={this.state.articals} callback={this.readArtical} /></div>}
                                {!this.state.isMarkdown && <PageKeys currentPage={this.state.currentPage} maxPage="50" callback={this.getArticalList} />}
                            </div>
                            <div class="ni_ib_main_right">
                                <HostInfo />
                                <Labels />
                                <HotArtical />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}

export default NiIndexBody;
