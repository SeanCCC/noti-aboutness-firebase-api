import React, { Component, Fragment } from 'react'
import { firebaseStorage } from '../../../firebaseInit'
import PropTypes from 'prop-types'
import { Table, Button, Modal, Header, Icon, Message } from 'semantic-ui-react'
import { useDropzone } from 'react-dropzone'

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
    const { uid } = this.props
    const { file } = this.state
    const storageRef = firebaseStorage.ref()
    const fileRef = storageRef.child(`receipts/${uid}.pdf`)
    await fileRef.put(file)
  }

  async onNextClick () {
    const { setOpen, askAboutPayment } = this.props
    const { file } = this.state
    if (!file) {
      this.setState({ error: true })
      return
    }
    this.setState({ uploading: true })
    await this.uploadFile()
    await askAboutPayment()
    this.setState({ uploading: false })
    setOpen(false)
  }

  render () {
    const { setOpen } = this.props
    const { error, file, uploading } = this.state
    return <Fragment>
      <Header>
      確認進入付款程序?
      </Header>
      <Modal.Content>
        <p>
        真的不訪談這個人?不訪談就上傳一下領據吧
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
        <Button color='red' onClick={() => setOpen(false)} disabled={uploading}>
          <Icon name='remove' /> 取消
        </Button>
        <Button color='green' onClick={this.onNextClick} disabled={uploading} loading={uploading}>
          <Icon name='checkmark' /> 上傳領據
        </Button>
      </Modal.Actions>
    </Fragment>
  }
}

PayModal.propTypes = {
  setOpen: PropTypes.func,
  uid: PropTypes.string,
  askAboutPayment: PropTypes.func
}

export default class PayorInviteCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      askingPayment: false,
      invitingInterview: false,
      payOpen: false
    }
    this.askAboutPayment = this.askAboutPayment.bind(this)
    this.inviteInterview = this.inviteInterview.bind(this)
    this.setPayOpen = this.setPayOpen.bind(this)
  }

  async askAboutPayment () {
    const { participant, askAboutPayment } = this.props
    this.setState({ askingPayment: true })
    await askAboutPayment(participant.uid)
    this.setState({ askingPayment: false })
  }

  async inviteInterview () {
    const { inviteInterview, participant } = this.props
    this.setState({ invitingInterview: true })
    await inviteInterview(participant.uid)
    this.setState({ invitingInterview: false })
  }

  setPayOpen (input) {
    this.setState({ payOpen: input })
  }

  render () {
    const { participant: p, record } = this.props
    const { askingPayment, invitingInterview, payOpen } = this.state
    const { totalEsmCount } = record
    const { researchEndDate } = p
    return (
      <Fragment>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {totalEsmCount || 0}
        </Table.Cell>
        <Table.Cell>
          {researchEndDate || 'N/A'}
        </Table.Cell>
        <Table.Cell>
          <Modal
            size="mini"
            trigger={<Button content="進入付款程序" loading={askingPayment} disabled={askingPayment} primary />}
            onClose={() => this.setPayOpen(false)}
            onOpen={() => this.setPayOpen(true)}
            open={payOpen}
          >
            <PayModal setOpen = {this.setPayOpen} uid={p.uid} askAboutPayment={this.askAboutPayment} />
          </Modal>
          <Modal
            size="mini"
            trigger={<Button content="寄出訪談邀請" loading={invitingInterview} disabled={invitingInterview} primary />}
            header='是否邀請訪談'
            content='無'
            actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: this.inviteInterview }]}
          />
        </Table.Cell>
      </Fragment>)
  }
}

PayorInviteCell.propTypes = {
  askAboutPayment: PropTypes.func,
  inviteInterview: PropTypes.func,
  participant: PropTypes.object,
  record: PropTypes.object
}
