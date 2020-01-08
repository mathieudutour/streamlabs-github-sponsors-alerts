import React from 'react'
import styled from '@emotion/styled'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Footer from '../components/footer'

const Wrapper = styled.div`
  text-align: center;
  width: 500px;
  max-width: 100%;
  min-height: 100vh;
  padding: 3em 15px;
  margin: 0 auto;
  position: relative;
`

const ImageWrapper = styled.div`
  margin: 3em 0;
  max-width: 100%;
`

const LoginButton = styled.a`
  display: inline-block;
  background: url(shadow.svg);
  background-size: 100% 100%;
  color: white;
  text-decoration: none;
  padding: 15px 30px;
  margin-top: 3em;
  border-radius: 10px;
`

const IndexPage = () => {
  return (
    <Layout>
      <SEO />
      <Wrapper>
        <ImageWrapper>
          <img src="/banner.png" />
        </ImageWrapper>
        <h1>Streaming alerts for GitHub Sponsors</h1>
        <p>
          Trigger real-time <a href="https://streamlabs.com/">streamlabs</a>{' '}
          subscription alerts when someone sponsors you on{' '}
          <a href="https://github.com/sponsors">GitHub</a>.
        </p>
        <LoginButton
          href={`https://www.streamlabs.com/api/v1.0/authorize?client_id=${process.env.GATSBY_STREAMLABS_CLIENT_ID}&redirect_uri=${process.env.GATSBY_BASE_API}/oauth/streamlabs&response_type=code&scope=alerts.create`}
        >
          Log in with streamlabs
        </LoginButton>
        <Footer />
      </Wrapper>
    </Layout>
  )
}

export default IndexPage
