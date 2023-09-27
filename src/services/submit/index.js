import { post } from '../api';

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
        lang_id: Number(langID),
    }
    if (contestID) {
        data.contest_id = Number(contestID)
    }
    return post('/submit/', data)
}

export function postGetResult(submitID) {
    return post('/submit/result', {
        submit_id: Number(submitID),
    })
}