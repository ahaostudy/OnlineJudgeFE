import { get, post, put } from '../api'

export function avatarPath(avatar) {
  return (
    import.meta.env.VITE_BASE_HOST +
    import.meta.env.VITE_API_URI +
    '/user/avatar/' +
    avatar
  )
}

export function postLoginByPassword(username, password) {
  return post('/user/login', {
    username: username,
    email: username,
    password: password
  })
}

export function putUpdateUser(userID, user) {
  return put('/user/' + userID, user)
}

export function postLoginByEmail(email, captcha) {
  return post('/user/login', {
    email: email,
    captcha: captcha
  })
}

export function postRegister(email, password, captcha) {
  return post('/user/register', {
    email: email,
    password: password,
    captcha: captcha
  })
}

export function postSendCaptcha(email) {
  return post('/user/captcha', {
    email: email
  })
}

export function getUser(id, username) {
  return get('/user/' + id, {
    username
  })
}
