import crypto from 'crypto'
import * as qs from 'querystring'
import fetch from 'node-fetch'
import {
  _handler
} from '../_handler'
import {
  BadRequest
} from '../errors'
import {
  findUser
} from '../storage'

function signRequestBody(key: string, body: string) {
  return `sha1=${crypto
    .createHmac('sha1', key)
    .update(body, 'utf8')
    .digest('hex')}`
}

function replaceTemplate(string: string, payload: WebhookPayloadSponsorship) {
  return string
    .replace(/GITHUB_USERNAME/g, payload.sponsorship.sponsor.login)
    .replace(/TIER_PRICE/g, payload.sponsorship.tier.monthly_price_in_dollars.toString())
}

type GitHubUser = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: 'User'
  site_admin: false
}

type Tier = {
  node_id: string
  created_at: string
  description: string
  monthly_price_in_cents: number
  monthly_price_in_dollars: number
  name: string
}

type WebhookPayloadSponsorship = {
  sponsorship: {
    node_id: string
    created_at: string
    maintainer: GitHubUser
    sponsor: GitHubUser
    privacy_level: 'public' | 'private'
    tier: Tier
  }
  sender: GitHubUser
} & ( |
  {
    action: 'created'
  } |
  {
    action: 'edited'
    changes: {
      privacy_level: 'public' | 'private'
    }
  } |
  {
    action: 'tier_changed' // upgrade
    changes: {
      tier: {
        from: Tier
      }
    }
  } |
  {
    action: 'pending_tier_change' // downgrade
    changes: {
      tier: {
        from: Tier
      }
    }
    effective_date: string
  } |
  {
    action: 'pending_cancellation'
    effective_date: string
  } |
  {
    action: 'cancelled'
  })

export const handler = _handler(async event => {
  const userId = event.pathParameters.userId

  if (!userId) {
    throw new BadRequest('Missing user id')
  }

  const user = await findUser(userId)

  if (!userId) {
    throw new BadRequest('cannot find user')
  }

  const sig = event.headers['X-Hub-Signature']
  const githubEvent = event.headers['X-GitHub-Event']
  const id = event.headers['X-GitHub-Delivery']

  if (!sig) {
    throw new BadRequest('No X-Hub-Signature found on request')
  }

  if (!githubEvent) {
    throw new BadRequest('No X-Github-Event found on request')
  }

  if (!id) {
    throw new BadRequest('No X-Github-Delivery found on request')
  }

  const calculatedSig = signRequestBody(user.token, event.body)

  if (sig !== calculatedSig) {
    throw new BadRequest(
      "X-Hub-Signature incorrect. Github webhook token doesn't match"
    )
  }

  /* eslint-disable */
  console.log('---------------------------------')
  console.log(`Github-Event: "${githubEvent}"`)
  console.log('---------------------------------')
  console.log('Payload', event.body)
  /* eslint-enable */

  const body: unknown = JSON.parse(event.body || '{}')

  // For more on events see https://developer.github.com/v3/activity/events/types/
  switch (githubEvent) {
    case 'sponsorship': {
      const payload = body as WebhookPayloadSponsorship

      if (payload.action === 'created' || payload.action === 'tier_changed') {
        const data: {[key: string]: string} = {
          access_token: user.streamlabsToken,
          type: 'subscription',
          message: replaceTemplate(user.message || '*GITHUB_USERNAME* just sponsored!', payload)
        }

        if (user.image_href) {
          data.image_href = user.image_href
        }

        if (user.sound_href) {
          data.sound_href = user.sound_href
        }

        if (user.duration) {
          data.duration = user.duration
        }

        if (user.special_text_color) {
          data.special_text_color = user.special_text_color
        }

        if (user.special_text_color) {
          data.special_text_color = user.special_text_color
        }

        if (user.user_message) {
          data.user_message = replaceTemplate(user.user_message, payload)
        }

        await fetch(`https://streamlabs.com/api/v1.0/alerts`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: qs.stringify(data),
        })
      }

      return { message: 'pong' }
    }
    default:
      return { message: 'pong' }
  }
})
