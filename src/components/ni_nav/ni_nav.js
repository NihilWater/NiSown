import React from "react";
import "./index.scss";
import NavButton from "../svg_anime/nav_button/nav_button";


class NiNav extends React.Component {
    state ={
        isNavOpened : false
    }
    controlnav = () =>{
        console.log("asdadfadf")
        this.setState({
            isNavOpened : !this.state.isNavOpened
        })
    }
    render() {
        return [
            <div className="navigate">
                <div className={ this.state.isNavOpened? "navmainbody navopen":"navmainbody"}>
                    <ul className="navmain" >
                        <li><a href="#">HOME</a></li>
                        <li>
                            <a href="#">世空间</a>
                            <ol className="navsecond" id="xykj">
                                <li><a href="">杂文小记</a></li>
                                <li><a href="">世界好棒</a></li>
                            </ol>
                        </li>
                        <li>
                            <a href="#">代码仓库</a>
                            <ol className="navsecond" id="dmck">
                                <li><a href="">Web前端</a></li>
                                <li><a href="">花哨后端</a></li>
                                <li><a href="">数据结构</a></li>
                                <li><a href="">深度学习</a></li>
                                <li><a href="">操作系统</a></li>
                                <li><a href="">数学相关</a></li>
                                <li><a href="">小小程序</a></li>
                            </ol>
                        </li>
                        <li>
                            <a href="#">友情链接</a>
                        </li>
                        <li className="liblank"></li>
                        <li>
                            <a href="#">About me</a>
                        </li>
                        <li className="navsearch">
                            <form className="search-form">
                                <input name="keyword" type="text" className="search-input" placeholder="搜索-find" />
                                <button type="submit" className="search-submit">
                                <svg t="1613826371821" className="icon" viewBox="0 0 1109 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2147" width="1rem"><defs><style type="text/css"></style></defs><path d="M406.277148 812.545762A403.793968 403.793968 0 0 1 0.008533 406.36248 403.793968 403.793968 0 0 1 406.277148 0.008533a403.793968 403.793968 0 0 1 406.268614 406.268615 403.793968 403.793968 0 0 1-406.183282 406.268614z m0-696.484863a287.400272 287.400272 0 0 0-290.130916 290.216249c0 162.558645 127.657603 290.216248 290.130916 290.216248 162.558645 0 290.216248-127.657603 290.216248-290.130916 0-162.558645-127.657603-290.301581-290.130916-290.301581z m545.275456 890.701911L778.754044 834.561579a55.466204 55.466204 0 0 1 0-80.38333c23.039808-23.039808 57.59952-23.039808 80.639328 0l172.79856 172.286564a55.466204 55.466204 0 0 1 0 80.38333 55.807535 55.807535 0 0 1-80.639328 0z" p-id="2148" fill="#ffffff"></path></svg>
                                </button>
                            </form>
                        </li>
                    </ul>
                    <div className="nav_mask"></div>
                </div>
            </div>,
            <div className="navmobile navigate">
                <div className="nick">世幻空间</div>
                <div className="navkey">
                    <NavButton width="1.6rem" clickEvent={this.controlnav}  height="1.6rem" style={{ backgroundColor:"white"}}/>
                </div>
            </div>
        ]
    }
}


export default NiNav;