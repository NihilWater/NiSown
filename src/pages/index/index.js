import React from 'react';
import './index.scss';
import NiIndexHead from '../../components/ni_index_head/ni_index_head';
import {withRouter} from 'react-router-dom';
import NiNav from '../../components/ni_nav/ni_nav';
import NiIndexBody from '../../components/ni_index_body/ni_index_body';

class Index extends React.Component {

    componentDidMount() {
        let is_top = false;
        document.getElementById("ni_index_body_s").addEventListener("wheel", function (e) {
            if (is_top && e.deltaY < 0 && document.body.clientWidth > 888) {
                document.getElementById("ni_index_head_after").style.height = '100vh';
            } else if (e.deltaY > 0 && document.body.clientWidth > 888) {
                document.getElementById("ni_index_head_after").style.height = '0';
            } else if (document.body.clientWidth <= 888) {
                document.getElementById("ni_index_head_after").style.height = '100vh';
            }
            is_top = false;
            if (this.scrollTop === 0) {
                is_top = true;
            }
        })
    }

    render = () => {
        return <div id="ni_index">
            <NiNav />
            <NiIndexHead />
            <NiIndexBody href={this.props.match.params} history={this.props.history}/>
        </div>
    }
}
export default withRouter(Index);