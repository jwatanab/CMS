import React, { Component } from 'react'

export default class MainAppHome extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div className='container'>
                <div className='content_title'>
                    <h2 className='main_title'>参照サイト</h2>
                </div>
                <div className='main_content'>
                    <div classname='content_bg'>
                        <div className='content_item'>
                            <p className='sub_item inner_text'>店内アンケート</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}