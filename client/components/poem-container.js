import React, {Component} from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {fetchNewPoem} from '../store'
import {PoemDisplay} from './index'

class PoemContainer extends Component {
  componentDidMount () {
    this.props.loadInitialPoem()
    this.canvas = new window.fabric.StaticCanvas('poem')
    this.canvas.setDimensions({
      width: 600,
      height: 800
    })
    // this.canvas.backgroundColor = 'red'
    this.canvas.renderAll()
  }

  render () {
    const {poem} = this.props
    if (typeof poem.content === 'string') {
      poem.content = generatePoemArray(poem.content)
      poem.title = poem.content[0].join(' ')
    }
    if (typeof poem.content === 'object' && this.canvas) {
      mountPoem(poem.content, this.canvas)
    }
    return (
      <PoemDisplay poem={poem} canvas={this.canvas} />
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

function mountPoem(content, canvas) {
  let left = 0
  let top = 0
  content.forEach(array => {
    const text = new window.fabric.Text(array.join(' '),
			{ left: left, top: top,
				// fill: this.state.textColor,
				// textBackgroundColor: this.state.textBGColor,
				// fontFamily: this.state.fontFamily,
				// fontWeight: this.state.fontWeight,
				fontSize: 24
      }
    )
    canvas.add(text)
    // move like a typewriter
    const randomNum = Math.floor(Math.random() * (2))
    if (!randomNum) {
      left += Math.floor(Math.random() * (170 - 135) + 135)
    } else {
      left = 0
      top += Math.floor(Math.random() * (70 - 35) + 35)
    }
  })
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
    }
  }
}

export default connect(mapState, mapDispatch)(PoemContainer)

/**
 * PROP TYPES
 */
PoemContainer.propTypes = {
  loadInitialPoem: PropTypes.func.isRequired,
}
