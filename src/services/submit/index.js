import { get, post } from '../api'

export function postDebug(code, input, langID) {
  return post('/submit/debug', {
    code: code,
    input: input,
    lang_id: BigInt(langID)
  })
}

export function postSubmit(problemID, code, langID, contestID) {
  const data = {
    problem_id: BigInt(problemID),
    code: code,
    lang_id: BigInt(langID)
  }
  if (contestID) {
    data.contest_id = BigInt(contestID)
  }
  return post('/submit/', data)
}

export function postGetResult(submitID) {
  return post('/submit/result', {
    submit_id: BigInt(submitID)
  })
}

export function getSubmits(problemID) {
  return get('/submit/', {
    problem_id: BigInt(problemID)
  })
}

export function getSubmit(id) {
  return get('/submit/' + id)
}

export function getLatestSubmits(count, userID) {
  return get('/submit/latest', {
    count,
    user_id: BigInt(userID)
  })
}
export function getSubmitCalendar(userID) {
  return get('/submit/calendar', {
    user_id: BigInt(userID)
  })
}
