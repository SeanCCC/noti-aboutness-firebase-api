import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Modal } from 'semantic-ui-react'
import status from '../../status'
import { mailMethodOptions } from '../../formOptions'
import moment from 'moment-timezone'

const translate = (options, value, defaultValue) => {
  if (defaultValue !== undefined && value === undefined) return defaultValue
  return options.find(opt => opt.value === value).text
}

export default class ConsentPendingCell extends Component {
  constructor (props) {
    super(props)
    this.state = {
      acceptingConsent: false
    }
  }

  render () {
    const { participant: p, acceptConsent } = this.props
    const { acceptingConsent } = this.state
    const mailMethod = translate(mailMethodOptions, p.mailMethod, '未送出')
    const consentSentTime = !p.consentSentTime ? '未送出' : moment(new Date(p.consentSentTime)).tz('Asia/Taipei').format('YYYY-MM-DD HH:mm')
    return (
      <Table.Row>
        <Table.Cell>
          {p.name}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.INIT ? '是' : '否'}
        </Table.Cell>
        <Table.Cell>
          {mailMethod}
        </Table.Cell>
        <Table.Cell>
          {consentSentTime}
        </Table.Cell>
        <Table.Cell>
          {p.status === status.CONSENT_SENT
            ? <Modal
              size="mini"
              trigger={<Button content="確認同意書" loading={acceptingConsent} primary />}
              header='確認同意書有效'
              content='資料是否有填寫完整？'
              actions={['取消', { key: 'confirm', content: '確定', positive: true, onClick: acceptConsent }]}
            />
            : null}
        </Table.Cell>
      </Table.Row>)
  }
}

ConsentPendingCell.propTypes = {
  acceptConsent: PropTypes.func,
  participant: PropTypes.object
}
