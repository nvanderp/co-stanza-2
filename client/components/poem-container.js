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
      style: 'normal',
      styleValue: 0,
      styleText: <p>A Normal Poem</p>
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

  styleChange(event, value) {
    const poem = this.props.poem
    const style = this.state.style
    this.canvas.clear()
    switch (value) {
      case 1:
        this.setState({style: 'abstract', styleValue: 1, styleText: <p>A Poem About Nothing</p>})
      break
      default:
        this.setState({style: 'normal', styleValue: 0, styleText: <p>A Normal Poem</p>})
      break
    }
    if (!poem[style]) {
      this.generatePoemArray()
    }
    this.mountPoem(poem, this.canvas, style)
  }

  generatePoemArray() {
    const content = this.props.poem.quote
    const poemArr = content.split(' ')
    const newPoem = []
    let firstWord = true
    let index = 0
    let min = 0
    poemArr.map((word) => {
      if (firstWord) {
        firstWord = false
        newPoem[index] = [word]
      }
      else {
        if (this.state.style === 'abstract') min = 3
        else min = 2
        const randomNum = Math.floor(Math.random() * (min))
        if (!randomNum) {
          newPoem[index].push(word)
        }
        else if (randomNum === 1) {
          index++
          newPoem[index] = [word]
        }
      }
    })
    this.props.poem[this.state.style].title = newPoem[0].join(' ')
    return newPoem
  }

  mountPoem() {
    const poem = this.props.poem
    const style = this.state.style
    if (poem[style].poem) {
      this.canvas.loadFromJSON(poem[style].poem, this.canvas.renderAll.bind(this.canvas))
    }
    else {
      this.formatPoem()
    }
  }

  formatPoem() {
    let content = this.props.poem[this.state.style].poemArr
    let prevTextWidth = 0
    let prevTextLeft = 0
    let left = 0
    let top = 40
    let max = 0
    let min = 0
    const title = new window.fabric.Text(this.props.poem[this.state.style].title,
      {
        fontSize: 24,
        underline: true,
        left: this.canvas.getWidth() / 2
      }
    )
    this.canvas.add(title)
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
      max = this.canvas.getWidth() - text.width
      const randomNum = Math.floor(Math.random() * (3))
      if (!randomNum && (prevTextLeft + prevTextWidth + text.width) < this.canvas.getWidth()) {
        left = Math.floor(Math.random() * (max - min)) + min
      }
      else if (randomNum === 1 && (prevTextLeft + prevTextWidth + text.width) < this.canvas.getWidth()) {
        left = Math.floor(Math.random() * max)
        top += Math.floor(Math.random() * (70 - 30) + 30)
      }
      else {
        left = 0
        top += Math.floor(Math.random() * (70 - 30) + 30)
      }
      if (top >= this.canvas.getHeight()) this.canvas.setHeight(top + text.height + text.top)
      text.left = left
      text.top = top
      prevTextWidth = text.width
      prevTextLeft = text.left
      min = prevTextLeft + prevTextWidth
      this.canvas.add(text)
    })
  }

  render () {
    const {poem, tempSavePoem} = this.props
    const style = this.state.style
    if (poem.quote && !poem[style]) {
      poem[style] = {}
      poem[style].poemArr = this.generatePoemArray()
    }
    if (poem[style] && poem[style].poemArr && this.canvas && this.canvas.getObjects().length === 0) {
      this.mountPoem()
      if (!poem[style].poem) tempSavePoem(this.canvas, poem, style)
    }
    return (
      <div>
        <Slider step={1} value={this.state.styleValue} onChange={(event, target) => this.styleChange(event, target)} />
        {this.state.styleText}
        <PoemDisplay canvas={this.canvas} />
      </div>
    )
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
