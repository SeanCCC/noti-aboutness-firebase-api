import React, { Fragment, Component } from 'react'
import { Button, Form, Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import firebase from 'firebase'
// import axios from 'axios'

const config = {
  apiKey: 'AIzaSyAFjPm3moByALBKFZjQw7-J1OKhuj64Chg',
  authDomain: 'noti-aboutness-firebase-48728.firebaseapp.com',
  databaseURL: 'https://noti-aboutness-firebase-48728.firebaseio.com',
  projectId: 'noti-aboutness-firebase-48728',
  storageBucket: 'noti-aboutness-firebase-48728.appspot.com',
  messagingSenderId: '565872836833',
  appId: '1:565872836833:web:799242f1c774cda9daf7a0',
  measurementId: 'G-Z3H54HV5DM'
}
firebase.initializeApp(config)

export default class Auth extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isSignedIn: false, // Local signed-in state.
      email: null,
      password: null,
      submitted: false,
      errorMessage: '',
      error: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount () {
    const that = this
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => {
        that.setState({ isSignedIn: !!user, error: false })
        if (user) {
          firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
          // axios.defaults.headers.common.Authorization = `Bearer ${token}`
        }
      }
    )
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount () {
    this.unregisterAuthObserver()
  }

  handleLogin () {
    const { password, email } = this.state
    const that = this
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
      const errorMessage = error.message
      that.setState({ errorMessage, error: true })
    })
    this.setState({ submitted: true })
  }

  handleChange (e, { name, value }) {
    this.setState({ [name]: value })
  }

  render () {
    const { isSignedIn, submitted, errorMessage, error } = this.state
    if (!isSignedIn) {
      return (
        <div>
          <p>Please sign-in:</p>
          <Form.Input fluid name="email" label='Email' onChange={this.handleChange}/>
          <Form.Input fluid name="password" label='Password' type='password' onChange={this.handleChange} />
          <Button onClick={this.handleLogin}>登入</Button>
          {submitted && error ? <Message negative>
            <Message.Header>{errorMessage}</Message.Header>
          </Message> : null}
        </div>
      )
    }
    return (
      <Fragment>
        <div className="login-status">
          <div>目前登入的帳號為 {firebase.auth().currentUser.email}</div>
          <Button onClick={() => firebase.auth().signOut()}>登出</Button>
        </div>
        {this.props.children}
      </Fragment>
    )
  }
}

Auth.propTypes = {
  children: PropTypes.node.isRequired
}
