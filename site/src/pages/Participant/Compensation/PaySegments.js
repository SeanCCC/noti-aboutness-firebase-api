import React, { Fragment } from 'react'
import { Header, Segment, Message, Form, Icon, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'

export const JkoSegment = ({ jkoAccount, uploading, submitted, jkoValid, handleChange, onInputBlur }) => {
  return <Fragment><Segment attached
    className="align-center">
    <Header as='h3'
      textAlign="center">如何取得街口支付帳號</Header>
    1.點擊圖示右下角的『我的』<br/>
    2.在圖上藍色框框的位置可以找到街口帳號<br/>
    <img className="max-width-400"
      src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/jk.jpg"/>
  </Segment><Segment attached
    className="align-center">
    <Header as='h3'
      textAlign="center">街口支付資料填寫</Header>
    <Form.Input
      key='jkoAccount'
      value={jkoAccount}
      label={'街口帳號'}
      disabled={uploading}
      placeholder={'請輸入街口帳號'}
      name='jkoAccount'
      onChange={handleChange}
      onBlur={() => { onInputBlur('jkoAccount') }}
    />
    {submitted && !jkoValid
      ? <Message negative>
        <Message.Header>請填寫帳號</Message.Header>
      </Message>
      : null}
  </Segment></Fragment>
}

JkoSegment.propTypes = {
  jkoValid: PropTypes.bool,
  handleChange: PropTypes.func,
  submitted: PropTypes.bool,
  uploading: PropTypes.bool,
  onInputBlur: PropTypes.func,
  jkoAccount: PropTypes.oneOfType([null, PropTypes.string])
}

export const LinePaySegment = ({ linePayAccount, uploading, submitted, linePayValid, handleChange, onInputBlur }) => {
  return <Fragment><Segment attached
    className="align-center">
    <Header as='h3'
      textAlign="center">如何取得LINE pay轉帳代碼</Header>
        1.點擊圖示右下角的『錢包』，然後點擊紅色框框中的『LINE pay』<br/>
    <img className="max-width-400"
      src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/line1.jpg"/>
        2.選擇您想要用來接受報酬的一卡通，並點擊粉紅色框框中的『轉帳代碼』<br/>
    <img className="max-width-400"
      src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/line2.jpg"/>
        3.轉帳代碼在藍色框框中<br/>
    <img className="max-width-400"
      src="https://storage.googleapis.com/noti-aboutness-firebase-48728.appspot.com/line3.jpg"/>
  </Segment><Segment attached
    className="align-center">
    <Header as='h3'
      textAlign="center">LINE pay資料填寫</Header>
    <Form.Input
      key='linePayAccount'
      value={linePayAccount}
      label={'LINE pay轉帳代碼'}
      disabled={uploading}
      placeholder={'請輸入LINE pay轉帳代碼'}
      name='linePayAccount'
      onChange={handleChange}
      onBlur={() => { onInputBlur('linePayAccount') }}
    />
    {submitted && !linePayValid
      ? <Message negative>
        <Message.Header>請填寫帳號</Message.Header>
      </Message>
      : null}
  </Segment></Fragment>
}

LinePaySegment.propTypes = {
  linePayValid: PropTypes.bool,
  handleChange: PropTypes.func,
  submitted: PropTypes.bool,
  uploading: PropTypes.bool,
  onInputBlur: PropTypes.func,
  linePayAccount: PropTypes.oneOfType([null, PropTypes.string])
}

export const BankTransferSegment = ({ bankCode, bankAccount, uploading, submitted, bankAccountValid, bankCodeValid, handleChange, onInputBlur }) => {
  return <Segment attached
    className="align-center">
    <Header as='h3'
      textAlign="center ">轉帳資料填寫</Header>
    <Form.Input
      key='bankCode'
      className="short-padded"
      value={bankCode}
      label={'銀行代碼'}
      disabled={uploading}
      placeholder={'請輸入銀行代碼'}
      name='bankCode'
      onChange={handleChange}
      onBlur={() => { onInputBlur('bankCode') }}
    />
    <a target="_blank"
      href="https://hiva.cdc.gov.tw/oraltest/bank_list.aspx"
      rel='noreferrer noopener'>
      <Button
        primary >
        <Icon name='linkify'/>
            看看自己銀行的代碼
      </Button>
    </a>
    <Form.Input
      key='bankAccount'
      className="short-padded"
      value={bankAccount}
      label={'銀行帳號'}
      disabled={uploading}
      placeholder={'請輸入銀行帳號'}
      name='bankAccount'
      onChange={handleChange}
      onBlur={() => { onInputBlur('bankAccount') }}
    />
    {submitted && (!bankAccountValid || !bankCodeValid)
      ? <Message negative>
        <Message.Header>請填寫代碼與帳號</Message.Header>
      </Message>
      : null}

  </Segment>
}

BankTransferSegment.propTypes = {
  bankAccountValid: PropTypes.bool,
  bankCodeValid: PropTypes.bool,
  handleChange: PropTypes.func,
  submitted: PropTypes.bool,
  uploading: PropTypes.bool,
  onInputBlur: PropTypes.func,
  bankCode: PropTypes.oneOfType([null, PropTypes.string]),
  bankAccount: PropTypes.oneOfType([null, PropTypes.string])
}
