import React from 'react'

const PoemDisplay = (props) => {
  const {canvas} = props

  return (
    <div>
      <canvas id="poem" />
    </div>
  )
}

export default PoemDisplay
