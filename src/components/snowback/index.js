import React from 'react';
import Snow_img from "./img/ParticleSmoke.png";

export var snows_stop = {key:true};

export class Sownback extends React.Component {
    constructor(props){
        super(props);
    }
    componentDidMount = () =>{
        var that = this;
        // 雪花大小基准
        let size = that.props.size?parseInt(that.props.size):10
        // 获取canvas画布
        var a = document.getElementById(this.props.id),
        c = a.getContext("2d"),
        e = [];
        // 雪花产生间隔 ( generate interval) ,gii 用于计数 
        let gi = 2, gii = 0;
        var bg=document.getElementById("ParticleSmoke");
        a.style.pointerEvents = "none";
        a.style.position = "absolute";
        a.style.top = 0;
        a.style.left = 0;
        a.style.width = this.props.style.width;
        a.style.height = this.props.style.height;
        a.style.transform = this.props.style.transform;
        a.height = a.offsetHeight;
        a.width = a.offsetWidth;
        window.addEventListener("resize",  function() {
            a.height = a.offsetHeight;
            a.width = a.offsetWidth
        });
        var d = Math;

        /* 向画布创建一个雪花 */
        let createSonw = () =>{
            var f = d.random(),
            g = .05 + .95 * f;
            let flake = {};
            flake.x = 1.5 * a.width * d.random() - .5 * a.width;
            flake.y = -9;
            flake.b = 2 * g * (d.random() / 2 + .5);
            flake.c = (4 + 2 * d.random()) * g;
            flake.a = d.pow(5 * f, 2) / 5;
            flake.update = function() {
                this.x += this.b;
                this.y += this.c;
                c.drawImage(bg, this.x, this.y, this.a*size, this.a*size);
            };
            e.push(flake);
        } 
        /* 初始化屏幕中的雪花 */
        for(let i=0; i<49; i++){
            createSonw();
            for (let b = 0; b < e.length; b++) e[b].y > a.height ? e.splice(b, 1) : e[b].y += 3 * e[b].c;
        }
        /* 将所有雪花绘制一遍 */
        let show = () => {for (let b = 0; b < e.length; b++) e[b].y > a.height ? e.splice(b, 1) : e[b].update()}; 
        setTimeout(show, 100);
        setInterval(function() {
                if(!snows_stop.key){
                    gii += 1;
                    c.clearRect(0, 0, a.width, a.height);
                    if(gii==gi){ // 当gii = gi 时才会向全局的画布中添加一个雪花
                        createSonw();
                        gii=0;
                    }
                    show();
                }
        }, 32)
    }

    render = () => {
        return <>
            <img src={Snow_img} alt="snows" id="ParticleSmoke" style={{display:"none"}}/> 
            <canvas id={this.props.id}></canvas>
        </>;
    }
}