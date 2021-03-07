import React from "react";
import "./page_keys.scss";

class PageKeys extends React.Component {   

    state = {
        page_list:[],   // 用于保存数据
        currentPage: 0  // 当前的页面数字
    }

    componentDidMount(){
        console.log(this.props.currentPage)
        this.setState({
            page_list : this.gernerateNums(this.props.currentPage),
            currentPage: this.props.currentPage
        })
        console.log(this.state)
    }

    limit = 10;   // 长度限制

    // 接收props 数据传给state 以便通过state 更新数据
    componentWillReceiveProps(){
        
    }
    
    // 根据当前页和最大页生成页面导航列表数据
    gernerateNums(center_page){
        // 用来标志开头和结尾
        let i=center_page-1, j=center_page-(-1);
        console.log(i, j)
        // 用来计数
        let count =1;
        while(!(i==0 && j==this.props.maxPage+1)){
            // 向后找一个
            if (j<=this.props.maxPage){
                j++;
                count++;
            }
            if(count==10) break;
            // 向前找一个
            if(i>=1){
                i--;
                count++;
            }
            if(count==10) break;
        }
        console.log(i, j);
        return Array.from(Array( j - i - 1 )).map(( e, ii ) => i + 1 + ii);
    }

    // 通过改变state 来让页面导航列表发生更新
    changePage(center_page){
        if(center_page <1 || center_page > this.props.maxPage){
            return;
        }
        this.props.callback(center_page);
        this.setState({
            page_list : this.gernerateNums(center_page),
            currentPage: center_page
        })
    }

    render(){
        return (<ul className = "page_key">
            <li className={this.state.currentPage == 1?"current":""} onClick={()=>this.changePage(this.state.currentPage - 1)}>&lt;</li>
                {this.state.page_list.map( item =>
                    <li className={this.state.currentPage == item?"current":""} onClick={()=>this.changePage(item)}>{item}</li>
                )}
            <li className={this.state.currentPage == this.props.maxPage?"current":""} onClick={()=>this.changePage(this.state.currentPage - (-1))}>&gt;</li>
        </ul>)
    }
}
export default PageKeys;