import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import { connect } from 'react-redux'

const HighlightTableBody = (props) => {
  const { participants, Cell, porpMapper, highlightMode, hightlightHashTable } = props
  console.log({ highlightMode, hightlightHashTable })
  return <Table.Body>
    {
      participants.map((p, idx) => <Cell
        {...porpMapper(p)}
        highlightMode={hightlightHashTable[p.uid] ? highlightMode : null}
        key={idx}/>)
    }
  </Table.Body>
}

HighlightTableBody.propTypes = {
  participants: PropTypes.array,
  Cell: PropTypes.elementType.isRequired,
  porpMapper: PropTypes.func,
  hightlightHashTable: PropTypes.object,
  highlightMode: PropTypes.string
}
const mapStateToProps = (state) => ({
  hightlightHashTable: state.hightlightHashTable,
  highlightMode: state.highlightMode
})

export default connect(mapStateToProps)(HighlightTableBody)
