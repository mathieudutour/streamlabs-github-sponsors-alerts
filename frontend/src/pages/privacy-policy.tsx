import React from 'react'
import styled from '@emotion/styled'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Footer from '../components/footer'

const Wrapper = styled.div`
  text-align: left;
  width: 600px;
  max-width: 100%;
  min-height: 100vh;
  padding: 3em 15px;
  margin: 0 auto;
  position: relative;
`

const PrivacyPage = () => {
  return (
    <Layout>
      <SEO />
      <Wrapper>
        <h2>No analytics</h2>
        <h2>No trackers</h2>
        <h2>Minimal data stored</h2>
        <p>
          {' '}
          There is a very small amount of{' '}
          <a href="https://github.com/mathieudutour/streamlabs-github-sponsors-alerts/blob/master/backend/lib/model/user.ts">
            data stored
          </a>
          :
          <pre>
            {`type User = {
  id: string // index
  username: string
  createdAt: number
  lastSeenAt: number

  // token by the user to make authenticated calls
  token: string

  // streamlabs OAuth
  streamlabsId?: string
  streamlabsToken?: string
  streamlabsRefreshToken?: string

  // alert customization https://dev.streamlabs.com/v1.0/reference#alerts
  image_href?: string
  sound_href?: string
  message?: string
  user_message?: string
  duration?: string
  special_text_color?: string
}`}
          </pre>
        </p>
        <p>
          If you want your data to be removed, please send me an email:
          mathieu@dutour.me.
        </p>
        <h2>Open Source</h2>
        <p>
          Everything is open source. Check it out here:{' '}
          <a href="https://github.com/mathieudutour/streamlabs-github-sponsors-alerts">
            https://github.com/mathieudutour/streamlabs-github-sponsors-alerts
          </a>
          .
        </p>
        <Footer />
      </Wrapper>
    </Layout>
  )
}

export default PrivacyPage
