import { _handler, _withAuth } from './_handler'
import { updateUser } from './storage'

export const me = _handler(
  _withAuth(async (_, user) => {
    return {
      id: user.id,
      username: user.username,
      image_href: user.image_href,
      sound_href: user.sound_href,
      message: user.message,
      user_message: user.user_message,
      duration: user.duration,
      special_text_color: user.special_text_color,
    }
  })
)

export const updateMe = _handler(
  _withAuth(async (event, user) => {
    const body = JSON.parse(event.body)
    await updateUser(user, {
      image_href: body.image_href,
      sound_href: body.sound_href,
      message: body.message,
      user_message: body.user_message,
      duration: body.duration,
      special_text_color: body.special_text_color,
    })
    return {
      ok: true,
    }
  })
)
