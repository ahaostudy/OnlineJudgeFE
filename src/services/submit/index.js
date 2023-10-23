import { get, post } from '../api'

export function postDebug(code, input, langID) {
  return post('/submit/debug', {
    code: code,
    input: input,
    lang_id: Number(langID)
  })
}

export function postSubmit(problemID, code, langID, contestID) {
  const data = {
    problem_id: Number(problemID),
    code: code,
    lang_id: Number(langID)
  }
  if (contestID) {
    data.contest_id = Number(contestID)
  }
  return post('/submit/', data)
}

export function postGetResult(submitID) {
  return post('/submit/result', {
    submit_id: Number(submitID)
  })
}

export function getSubmits(problemID) {
  return get('/submit/', {
    problem_id: Number(problemID)
  })
}

export function getSubmit(id) {
  return get('/submit/' + id)
}

export function getLatestSubmits(count, userID) {
  if (!userID) userID = 0;
  return get('/submit/latest', {
    count,
    user_id: BigInt(userID)
  })
}

export function getSubmitCalendar(userID) {
  if (!userID) userID = 0;
  return get('/submit/calendar', {
    user_id: BigInt(userID)
  })
}

export function getSubmitStatistics(userID) {
  if (!userID) userID = 0;
  return get('/submit/statistics', {
    user_id: BigInt(userID)
  })
}