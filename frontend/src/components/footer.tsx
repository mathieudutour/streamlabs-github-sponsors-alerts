import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'

const Wrapper = styled.footer`
  position: absolute;
  width: 100%;
  bottom: 0;
  font-size: 10px;
  opacity: 0.8;
  text-align: center;
`

const Separator = styled.span`
  padding: 0 20px;
`

const Footer = () => {
  return (
    <Wrapper>
      Made with ♡ by <a href="https://github.com/mathieudutour">Mathieu</a>
      <Separator> </Separator>
      <a href="https://github.com/sponsors/mathieudutour">Sponsors</a>
      <Separator> </Separator>
      <Link to="/privacy-policy">Privacy Policy</Link>
    </Wrapper>
  )
}

export default Footer
