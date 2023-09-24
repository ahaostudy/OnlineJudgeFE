import { post } from '../api';

export function postLoginByPassword(username, password) {
    return post('/user/login', {
        username: username,
        email: username,
        password: password
    })
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