import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'
import { connect } from 'react-redux'

const HighlightTableBody = (props) => {
  const { participants, Cell, porpMapper, highlightMode, hightlightHashTable } = props
  return <Table.Body>
    {
      participants.map((p, idx) => {
        const _highlightMode = hightlightHashTable[p.uid] ? highlightMode : null
        return <Table.Row
          warning={_highlightMode === 'warning'}
          negative={_highlightMode === 'dangerous'}
          active={_highlightMode === 'active'}
          key={idx}
        >
          <Cell {...porpMapper(p)} />
        </Table.Row>
      })
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
