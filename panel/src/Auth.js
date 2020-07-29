import React, { Fragment, Component } from 'react'
import { Button, Form, Message } from 'semantic-ui-react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { firebaseAuth, firebaseDB } from './firebaseInit.js'
import { updateParticipants, updateCandidates, updateUploadRecord } from './redux/actions'

const restructure = (objs) => {
  if (!objs) return []
  return Object.keys(objs).map((uid) => {
    return {
      uid,
      ...objs[uid]
    }
  })
}

const dbRefArray = (colloection, cb, filterFunc = () => true) =>
  firebaseDB.ref(colloection).on('value', function (snapshot) {
    const data = restructure(snapshot.val()).filter(filterFunc)
    cb(data)
  })

class Auth extends Component {
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
    this.unregisterAuthObserver = firebaseAuth.onAuthStateChanged(
      (user) => {
        that.setState({ isSignedIn: !!user, error: false })
        if (user) {
          firebaseAuth.currentUser.getIdToken(true)
          dbRefArray('participant', this.props.updateParticipants)
          dbRefArray('candidate', this.props.updateCandidates)
          dbRefArray('uploadRecord', this.props.updateUploadRecord)
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
    firebaseAuth.signInWithEmailAndPassword(email, password).catch(function (error) {
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
          <p>請登入:</p>
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
          <div>目前登入的帳號為 {firebaseAuth.currentUser.email}</div>
          <Button onClick={() => firebaseAuth.signOut()}>登出</Button>
        </div>
        {this.props.children}
      </Fragment>
    )
  }
}

Auth.propTypes = {
  children: PropTypes.node.isRequired,
  updateParticipants: PropTypes.func,
  updateCandidates: PropTypes.func,
  updateUploadRecord: PropTypes.func
}

export default connect(null, { updateParticipants, updateCandidates, updateUploadRecord })(Auth)
