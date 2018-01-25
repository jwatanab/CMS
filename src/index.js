import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Route, BrowserRouter } from 'react-router-dom'
import MainAppHome from './falls/home'
import MainAppFirst from './falls/first'


ReactDOM.render((
    <BrowserRouter>
        <div>
            <Route path='/' component={MainAppFirst} />
        </div>
    </BrowserRouter>),
    document.querySelector('#root')
)