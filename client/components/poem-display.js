import React from 'react'

const PoemDisplay = (props) => {
  const {poem, canvas} = props

  return (
    <div>
      <canvas id="poem" />
    </div>
  )
}

export default PoemDisplay
