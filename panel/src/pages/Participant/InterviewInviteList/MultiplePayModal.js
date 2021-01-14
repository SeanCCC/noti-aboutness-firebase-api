import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import { firebaseStorage } from '../../../firebaseInit'
import { Button, Modal, Header, Icon, Message } from 'semantic-ui-react'

function Basic ({ getFile, disabled }) {
  const { getRootProps, getInputProps } = useDropzone(
    { accept: 'application/pdf', maxFiles: 1, getFilesFromEvent: getFile }
  )

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <Button color='blue' fluid disabled={disabled}>
          <Icon name='file' /> 上傳
        </Button>
      </div>
    </section>
  )
}

Basic.propTypes = {
  getFile: PropTypes.func,
  disabled: PropTypes.bool
}

class PayModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      error: false,
      uploading: false
    }
    this.getFile = this.getFile.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.onNextClick = this.onNextClick.bind(this)
    this.askAboutPayment = this.askAboutPayment.bind(this)
  }

  getFile (event) {
    const files = []
    const fileList = event.dataTransfer ? event.dataTransfer.files : event.target.files
    for (var i = 0; i < fileList.length; i++) {
      const file = fileList.item(i)
      Object.defineProperty(file, 'myProp', {
        value: true
      })
      files.push(file)
    }
    this.setState({ file: files[0] })
  }

  async uploadFile () {
    const { participant } = this.props
    const { file } = this.state
    const storageRef = firebaseStorage.ref()
    const fileRef = storageRef.child(`receipts/${participant.uid}.pdf`)
    await fileRef.put(file)
  }

  async onNextClick () {
    const { setRemotePayOpen } = this.props
    const { file } = this.state
    if (!file) {
      this.setState({ error: true })
      return
    }
    this.setState({ uploading: true })
    await this.uploadFile()
    await this.askAboutPayment()
    this.setState({ uploading: false })
    setRemotePayOpen(false)
  }

  async askAboutPayment () {
    const { participant, askAboutPayment, setLoading } = this.props
    setLoading(true)
    await askAboutPayment(participant.uid)
    setLoading(false)
  }

  render () {
    const { error, file, uploading } = this.state
    const { setRemotePayOpen, remotePayOpen, participant } = this.props
    return <Modal
      size="mini"
      onClose={() => setRemotePayOpen(false)}
      onOpen={() => setRemotePayOpen(true)}
      open={remotePayOpen}
    >
      <Header>
      線上付款
      </Header>
      <Modal.Content>
        <p>
        請上傳{participant.name}的領據
        </p>
        <Basic getFile = {this.getFile} disabled={uploading}/>
      </Modal.Content>
      {
        file == null || file.name
      }
      {
        !error || <Message error={error} header="請上傳文件" />
      }
      <Modal.Actions>
        <Button color='red' onClick={() => setRemotePayOpen(false)} disabled={uploading}>
          <Icon name='remove' /> 取消
        </Button>
        <Button color='green' onClick={this.onNextClick} disabled={uploading} loading={uploading}>
          <Icon name='checkmark' /> 上傳領據
        </Button>
      </Modal.Actions>
    </Modal>
  }
}

PayModal.propTypes = {
  participant: PropTypes.object,
  askAboutPayment: PropTypes.func,
  setRemotePayOpen: PropTypes.func,
  remotePayOpen: PropTypes.bool,
  setLoading: PropTypes.func
}

export default class MultiplePayModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      firstOpen: false,
      remotePayOpen: false,
      sitePayOpen: false,
      loading: false
    }
    this.setFirstOpen = this.setFirstOpen.bind(this)
    this.setRemotePayOpen = this.setRemotePayOpen.bind(this)
    this.setSitePayOpen = this.setSitePayOpen.bind(this)
    this.finishInterview = this.finishInterview.bind(this)
    this.setLoading = this.setLoading.bind(this)
  }

  setFirstOpen (input) {
    this.setState({ firstOpen: input })
  }

  setRemotePayOpen (input) {
    this.setState({ remotePayOpen: input })
  }

  setSitePayOpen (input) {
    this.setState({ sitePayOpen: input })
  }

  setLoading (input) {
    this.setState({ loading: input })
  }

  async finishInterview () {
    const { finishInterview, participant } = this.props
    this.setSitePayOpen(false)
    this.setLoading(true)
    await finishInterview(participant.uid)
    this.setLoading(false)
  }

  render () {
    const {
      firstOpen,
      remotePayOpen,
      sitePayOpen,
      loading
    } = this.state
    const { askAboutPayment, participant } = this.props
    return (
      <Fragment>
        <Button
          loading={loading}
          disabled={loading}
          onClick={() => this.setFirstOpen(true)}
        >
          進入付款程序
        </Button>
        <Modal
          onClose={() => this.setFirstOpen(false)}
          onOpen={() => this.setFirstOpen(true)}
          open={firstOpen}
        >
          <Modal.Header>支付現金或線上支付</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <p>如果面對面訪談並支付現金就選擇支付現金，如果遠端訪談就用線上支付。</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => {
              this.setSitePayOpen(true)
              this.setFirstOpen(false)
            }} primary>
              當面支付
            </Button>
            <Button onClick={() => {
              this.setRemotePayOpen(true)
              this.setFirstOpen(false)
            }} primary>
              線上支付
            </Button>
          </Modal.Actions>

        </Modal>
        <PayModal
          setRemotePayOpen={this.setRemotePayOpen}
          remotePayOpen={remotePayOpen}
          setLoading={this.setLoading}
          askAboutPayment={askAboutPayment}
          participant={participant}
        />
        <Modal
          onClose={() => this.setSitePayOpen(false)}
          open={sitePayOpen}
          size='small'
        >
          <Modal.Header>完成訪談並支付報酬</Modal.Header>
          <Modal.Content>
            <p>檢查是否完成支付與簽名領據</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              icon='close'
              content='取消'
              onClick={() => this.setSitePayOpen(false)}
            />
            <Button
              icon='check'
              content='確定'
              positive
              onClick={this.finishInterview}
            />
          </Modal.Actions>
        </Modal>
      </Fragment>
    )
  }
}

MultiplePayModal.propTypes = {
  finishInterview: PropTypes.func,
  askAboutPayment: PropTypes.func,
  participant: PropTypes.object
}
