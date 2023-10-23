import { get, post, put } from '../api'

export function getNote(id) {
  return get('/note/' + id)
}

export function getNotes(query) {
  if (!query) {
    query = {}
  }
  return get('/note/', query)
}

export function postCreateNote(title, content, problemID, submitID) {
  return post('/note/', {
    title: title,
    content: content,
    problem_id: Number(problemID),
    submit_id: Number(submitID),
    user_id: -1
  })
}

export function putUpdateNote(noteID, title, content) {
  return put('/note/' + noteID, {
    title: title,
    content: content
  })
}
