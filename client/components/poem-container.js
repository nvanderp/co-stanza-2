import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {fetchNewPoem, savePoemInStyle} from '../store'
import {PoemDisplay} from './index'
import Slider from 'material-ui/Slider'

class PoemContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      style: 'normal'
    }
  }
  componentDidMount () {
    this.props.loadInitialPoem()
    this.canvas = new window.fabric.StaticCanvas('poem')
    this.canvas.setDimensions({
      width: 500,
      height: 500
    })
    // this.canvas.backgroundColor = 'red'
    this.canvas.renderAll()
  }

  styleChange(event, value, poem, canvas) {
    canvas.clear()
    switch (value) {
      case 1:
        this.setState({style: 'abstract'})
        mountPoem(poem, canvas, this.state.style)
      break
      default:
        this.setState({style: 'normal'})
        mountPoem(poem, canvas, this.state.style)
      break
    }
  }

  render () {
    const {poem, tempSavePoem} = this.props
    const style = this.state.style
    if (typeof poem.content === 'string') {
      poem.content = generatePoemArray(poem.content)
      poem.title = poem.content[0].join(' ')
    }
    if (typeof poem.content === 'object' && this.canvas && this.canvas.getObjects().length === 0) {
      mountPoem(poem, this.canvas, style)
      if (!poem[this.state.style]) tempSavePoem(this.canvas, poem, style)
    }
    return (
      <div>
        <Slider step={1} value={0} onChange={(event, target) => this.styleChange(event, target, poem, this.canvas)} />
        {this.state.style === 'normal' && <p>A Normal Poem</p>}
        {this.state.style === 'abstract' && <p>A Poem About Nothing</p>}
        <PoemDisplay canvas={this.canvas} />
      </div>
    )
  }
}

function generatePoemArray(content) {
  const poemArr = content.split(' ')
  const newPoem = []
  let firstWord = true
  let index = 0
  poemArr.map((word) => {
    if (firstWord) {
      firstWord = false
      newPoem[index] = [word]
    }
    else {
      const randomNum = Math.floor(Math.random() * (2))
      if (!randomNum) {
        newPoem[index].push(word)
      }
      else {
        index++
        newPoem[index] = [word]
      }
    }
  })
  return newPoem
}

function normalPoem(canvas, poem) {
  let content = poem.content
  let prevTextWidth = 0
  let prevTextLeft = 0
  let left = 0
  let top = 0
  let max = 0
  let min = 0
  content.forEach(array => {
    const text = new window.fabric.Text(array.join(' '),
      {
        // fill: this.state.textColor,
        // textBackgroundColor: this.state.textBGColor,
        // fontFamily: this.state.fontFamily,
        // fontWeight: this.state.fontWeight,
        fontSize: 24
      }
    )
    max = canvas.getWidth() - text.width
    // move like a typewriter
    const randomNum = Math.floor(Math.random() * (3))
    if (!randomNum && (prevTextLeft + prevTextWidth + text.width) < canvas.getWidth()) {
      left = Math.floor(Math.random() * (max - min)) + min
    }
    else if (randomNum === 1 && (prevTextLeft + prevTextWidth + text.width) < canvas.getWidth()) {
      left = Math.floor(Math.random() * max)
      top += Math.floor(Math.random() * (70 - 30) + 30)
    }
    else {
      left = 0
      top += Math.floor(Math.random() * (70 - 30) + 30)
    }
    if (top >= canvas.getHeight()) canvas.setHeight(top + text.height + text.top)
    text.left = left
    text.top = top
    prevTextWidth = text.width
    prevTextLeft = text.left
    min = prevTextLeft + prevTextWidth
    canvas.add(text)
  })
}

function mountPoem(poem, canvas, style) {
  if (poem[style]) {
    canvas.loadFromJSON(poem[style], canvas.renderAll.bind(canvas))
  }
  else if (style === 'normal') {
    normalPoem(canvas, poem)
  }
  else if (style === 'abstract') {
    normalPoem(canvas, poem) // change me!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }
}

const mapState = (state) => {
  return {
    poem: state.poem
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadInitialPoem () {
      dispatch(fetchNewPoem())
    },
    tempSavePoem (canvas, poem, style) {
      dispatch(savePoemInStyle(canvas, poem, style))
    }
  }
}

export default connect(mapState, mapDispatch)(PoemContainer)

/**
 * PROP TYPES
 */
PoemContainer.propTypes = {
  loadInitialPoem: PropTypes.func.isRequired,
  tempSavePoem: PropTypes.func.isRequired
}
