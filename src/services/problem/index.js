import { get } from '../api';

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