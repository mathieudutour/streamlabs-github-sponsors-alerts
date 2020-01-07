import * as AWS from 'aws-sdk'
import { generate as randomString } from 'randomstring'
import { User } from './model'

const db = new AWS.DynamoDB.DocumentClient()
const { USERS_TABLE_NAME } = process.env

export const findUser = async (id: string): Promise<User | undefined> => {
  if (!id) {
    return Promise.resolve(undefined)
  }
  const meta = await db
    .get({
      TableName: USERS_TABLE_NAME,
      Key: {
        id: String(id),
      },
    })
    .promise()
  return (meta || { Item: undefined }).Item as User
}

export const findUserByToken = async (
  token: string
): Promise<User | undefined> => {
  if (!token) {
    return Promise.resolve(undefined)
  }
  const meta = await db
    .query({
      TableName: USERS_TABLE_NAME,
      IndexName: 'tokenIndex',
      KeyConditionExpression: '#token = :token',
      ExpressionAttributeNames: {
        '#token': 'token',
      },
      ExpressionAttributeValues: { ':token': token },
      Limit: 1,
    })
    .promise()
  return (meta || { Items: [] }).Items[0] as User
}

export const findUserByStreamlabsId = async (
  streamlabsId: string
): Promise<User | undefined> => {
  if (!streamlabsId) {
    return Promise.resolve(undefined)
  }
  const meta = await db
    .query({
      TableName: USERS_TABLE_NAME,
      IndexName: 'streamlabsIdIndex',
      KeyConditionExpression: '#streamlabsId = :streamlabsId',
      ExpressionAttributeNames: {
        '#streamlabsId': 'streamlabsId',
      },
      ExpressionAttributeValues: { ':streamlabsId': streamlabsId },
      Limit: 1,
    })
    .promise()
  return (meta || { Items: [] }).Items[0] as User
}

export const updateUser = async (data: User, body?: Partial<User>) => {
  data.lastSeenAt = Date.now()
  if (body) {
    data = Object.assign(data, body)
    Object.keys(body).forEach(k => {
      if (typeof body[k] === 'string' && !body[k]) {
        delete data[k]
      }
    })
  }
  await db
    .put({
      TableName: USERS_TABLE_NAME,
      Item: data,
    })
    .promise()
  return data
}

export const createUser = async (
  data: Pick<
    User,
    'username' | 'streamlabsId' | 'streamlabsToken' | 'streamlabsRefreshToken'
  >
) => {
  const user: User = {
    id: randomString(),
    ...data,

    // generate a random API key
    token: randomString(),

    createdAt: Date.now(),
    lastSeenAt: Date.now(),
  }

  await db
    .put({
      TableName: USERS_TABLE_NAME,
      Item: user,
    })
    .promise()
  return user
}
