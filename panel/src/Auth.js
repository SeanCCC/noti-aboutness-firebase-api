// Import FirebaseAuth and firebase.
import React, { Fragment } from 'react'
import { Button } from 'semantic-ui-react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import PropTypes from 'prop-types'
import firebase from 'firebase'

// Configure Firebase.
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

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
}

export default class SignInScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isSignedIn: false // Local signed-in state.
    }
  }

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount () {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ isSignedIn: !!user })
    )
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount () {
    this.unregisterAuthObserver()
  }

  render () {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
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

SignInScreen.propTypes = {
  children: PropTypes.node.isRequired
}
