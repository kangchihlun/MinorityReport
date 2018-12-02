import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import range from 'lodash/range'

const CenterComponent = styled.div`
  display:flex;
  justify-content:center;
`

const resizeAnimation = keyframes`
0%{transform:scale(0.2)}
40%{transform:scale(1)}
80%{transform:scale(0.2)}
100%{transform:scale(0.2)}
`

const Dot = styled.div`
  width:${props => props.size}px;
  height:${props => props.size}px;
  background-color: ${props => (props.mushroom ? 'black' : 'white')};
  border-radius:100%;
  margin:3px;
  animation: ${() => resizeAnimation} 1s infinite ease-in-out both;
  animation-delay:${props => `${props.delay}s`};
`

const Loader = ({ size = 4, dotsCount = 3, mushroom = false }) => (
  <CenterComponent>
    {range(1, dotsCount + 1).map((d, di) => <Dot mushroom={mushroom} size={size * 4} delay={di} key={`${d}_dot`} />)}
  </CenterComponent>
)

Loader.propTypes = {
  size: PropTypes.number, /* eslint-disable-line */
  dotsCount: PropTypes.number, /* eslint-disable-line */
  mushroom: PropTypes.bool,
}

export default Loader
