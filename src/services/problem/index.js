import { get, post } from '../api';

export function getProblems(page, count) {
    return get('/problem/', {
        page: page,
        count: count
    })
}

export function getProblemCount() {
    return get('/problem/count')
}

export function getProblem(id) {
    return get('/problem/' + id)
}

export function postCreateTestcase(problemID, input, output) {
    return post('/problem/testcase/', {
        action_type: 1,
        problem_id: problemID,
        input: input,
        output: output
    })
}