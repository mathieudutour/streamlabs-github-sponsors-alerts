import * as qs from 'querystring'
import fetch from 'node-fetch'
import { User } from '../model'
import { createUser, findUserByStreamlabsId, updateUser } from '../storage'
import { _handler } from '../_handler'
import { BadRequest } from '../errors'

async function authenticate(
  code: string
): Promise<{
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number
}> {
  const res = await fetch(`https://streamlabs.com/api/v1.0/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: qs.stringify({
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.BASE_API_URL}/oauth/streamlabs`,
      client_id: process.env.STREAMLABS_CLIENT_ID,
      client_secret: process.env.STREAMLABS_CLIENT_SECRET,
      code,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    const error = new BadRequest(data.message || data.error_description)
    error.statusCode = res.status
    throw error
  }

  return data
}

export const handler = _handler(async event => {
  const { access_token, refresh_token } = await authenticate(
    event.queryStringParameters.code
  )

  const res = await fetch(
    `https://streamlabs.com/api/v1.0/user?access_token=${access_token}`
  )

  const data = await res.json()

  if (!res.ok) {
    const error = new BadRequest(data.message)
    error.statusCode = res.status
    error.data = data
    throw error
  }

  const streamlabsId = String(data.streamlabs.id)
  const existingUser = await findUserByStreamlabsId(streamlabsId)

  let user: User
  if (existingUser) {
    await updateUser(existingUser, {
      username: data.streamlabs.display_name,
      streamlabsToken: access_token,
      streamlabsRefreshToken: refresh_token,
    })
    user = existingUser
  } else {
    user = await createUser({
      username: data.streamlabs.display_name,
      streamlabsId,
      streamlabsToken: access_token,
      streamlabsRefreshToken: refresh_token,
    })
  }

  const { redirect } = event.pathParameters || {}

  return {
    statusCode: 301,
    headers: {
      Location: `https://streamlabs-github-sponsors.netlify.com/oauth-redirect?token=${
        user.token
      }${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ''}`,
    },
  }
})
