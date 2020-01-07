import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import styled from '@emotion/styled'

import Layout from '../components/layout'
import SEO from '../components/seo'

type User = {
  id: string
  username: string

  // alert customization https://dev.streamlabs.com/v1.0/reference#alerts
  image_href: string
  sound_href: string
  message: string
  user_message: string
  duration: string
  special_text_color: string
}

const Wrapper = styled.div`
  width: 800px;
  max-width: 100%;
  padding: 3em 15px;
  margin: 0 auto;
`

const Data = styled.span`
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);
  padding: 3px 8px;
`

const OauthRedirectPage = ({ location }: { location: Location }) => {
  const [user, setUser] = useState<User | void>(undefined)
  const [githubUsername, setGithubUsername] = useState('')
  const token = location.search.replace('?token=', '')

  useEffect(() => {
    // load the user
    fetch(`${process.env.GATSBY_BASE_API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(res => setUser(res))
      .catch(console.error.bind(console))
  }, [])

  if (!user) {
    return (
      <Layout>
        <SEO />
        <div>Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <SEO />
      <Wrapper>
        <h3>Nearly there!</h3>
        <div>
          One last step: add a GitHub webhook. Sounds complicated? It's not!
          Let's walk you through it.
        </div>
        <ol>
          <li>
            What's your GitHub username?{' '}
            <input
              value={githubUsername}
              onChange={e => setGithubUsername(e.target.value)}
            />
          </li>
          <li>
            Head over{' '}
            <a
              href={`https://github.com/sponsors/${githubUsername}/dashboard/webhooks/new`}
              target="_blank"
            >{`https://github.com/sponsors/${githubUsername}/dashboard/webhooks/new`}</a>
          </li>
          <li>
            Fill the form with the following information:
            <ul>
              <li>
                Payload URL:{' '}
                <Data>{`${process.env.GATSBY_BASE_API}/webhook/github/${user.id}`}</Data>
              </li>
              <li>
                Content Type: <Data>application/json</Data>
              </li>
              <li>
                Secret: <Data>{token}</Data>
              </li>
            </ul>
          </li>
          <li>
            Done! When someone sponsors you on GitHub, you will now receive an
            alert on streamlabs.
          </li>
        </ol>
      </Wrapper>
    </Layout>
  )
}

export default OauthRedirectPage
