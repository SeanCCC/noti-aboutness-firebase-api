import React, { Component } from 'react'
import CandidateList from './CandidateList'

// import {
//   Switch,
//   Route,
//   useRouteMatch,
//   Redirect
// } from 'react-router-dom'

export default class Recruit extends Component {
  render () {
    return <div className="page">
      <CandidateList/>
    </div>
  }
}
