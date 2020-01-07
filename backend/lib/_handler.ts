import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import { User } from './model'
import { findUserByToken } from './storage'
import { Unauthorized } from './errors'

export const _handler = (
  fn: (event: APIGatewayProxyEvent) => Promise<any>
): APIGatewayProxyHandler => async (event: APIGatewayProxyEvent) => {
  try {
    const result = (await fn(event)) || {}

    return {
      statusCode: result.statusCode || 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        ...(result.headers || {}),
      },
      body: result.isBase64Encoded ? result.result : JSON.stringify(result),
      isBase64Encoded: result.isBase64Encoded,
    }
  } catch (err) {
    console.error(err)
    return {
      statusCode: err.statusCode || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: err.message,
        data: err.data,
      }),
    }
  }
}

export const _withAuth = (
  fn: (event: APIGatewayProxyEvent, user: User) => Promise<any>
): ((event: APIGatewayProxyEvent) => Promise<any>) => async (
  event: APIGatewayProxyEvent
) => {
  if (!event.headers || !event.headers.Authorization) {
    throw new Unauthorized('Missing "Authorization" header.')
  }

  const token = event.headers.Authorization.replace('Bearer ', '')

  const user = await findUserByToken(token)

  if (!user) {
    throw new Unauthorized('No valid API key provided.')
  }

  return await fn(event, user)
}
