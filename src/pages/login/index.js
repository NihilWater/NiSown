import React from "react";
import Data from "../../data";

class Login extends React.Component {
    login = () =>{
        Data.islogin = true;
        this.props.history.goBack();
        // this.props.num = this.props.num + 1;
    }
    render = () => {
        return <h2>
            <p>这个时登陆界面</p>
            <button onClick={this.login}>点击登陆</button>
            
        </h2>
    }
}
export default Login;