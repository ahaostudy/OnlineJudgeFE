import { get, post, put, del } from '../api'

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
  const data = {
    title: title,
    content: content,
    user_id: -1
  }
  if (problemID) data.problem_id = Number(problemID)
  if (submitID) data.submit_id = Number(submitID)
  return post('/note/', data)
}

export function putUpdateNote(noteID, title, content) {
  const data = {}
  if (title) data.title = title
  if (content) data.content = content
  return put('/note/' + noteID, data)
}

export function deleteNote(id) {
  return del('/note/' + id)
}
