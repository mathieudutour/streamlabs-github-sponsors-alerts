export type User = {
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
}
