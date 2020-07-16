import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
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
    return { ...d, level: Math.min(9, level) }
  })
  return <div className="date-block">
    <div className="date">{date}</div>
    {levelData.map((d, idx) => <Block level={d.level} key={`${date}-${idx}`}/>)}
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
    <Block level={7} /> 19~21
    <Block level={8} /> 22~24
    <Block level={9} /> 25~
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
