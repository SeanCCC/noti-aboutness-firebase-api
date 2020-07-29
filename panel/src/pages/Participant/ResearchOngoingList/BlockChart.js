import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import _ from 'lodash'

const Block = ({ level }) => {
  return <div className={`block lv${level}`}/>
}

Block.propTypes = {
  level: PropTypes.number
}

const DateChart = ({ data, date }) => {
  const levelData = data.map(d => {
    const level = Math.ceil(d.amount / 3)
    return { ...d, level: Math.min(7, level) }
  })
  const shoutDate = moment(date, 'YYYY-MM-DD').tz('Asia/Taipei').format('MM/DD')
  return <div className="date-block">
    <div className="date">{shoutDate}</div>
    {levelData.map((d, idx) =>
      <div className="tooltip" key={`${date}-${idx}`}>
        <span className="tooltiptext">{shoutDate} {d.hour}:00 {d.amount}個</span>
        <Block level={d.level} />
      </div>
    )}
  </div>
}

DateChart.propTypes = {
  data: PropTypes.array,
  date: PropTypes.string
}

const ColorInfo = () => {
  return <div className="color-info">
    <Block level={0} /> 0
    <Block level={1} /> 1~3
    <Block level={2} /> 4~6
    <Block level={3} /> 6~9
    <Block level={4} /> 10~12
    <Block level={5} /> 13~15
    <Block level={6} /> 16~18
    <Block level={7} /> 19~
  </div>
}

const BlockChart = ({ data }) => {
  const dateData = _.groupBy(data, 'date')
  const dates = Object.keys(dateData)
  return <Fragment>
    <ColorInfo/>
    <div className="block-chart">
      {dates.map((date, idx) => <DateChart date={date} key={idx} data={dateData[date]} />)}
    </div>
  </Fragment>
}

BlockChart.propTypes = {
  data: PropTypes.array
}

export default BlockChart
