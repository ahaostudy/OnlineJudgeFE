import { post } from '../api';

export function postDebug(code, input, lang) {
    console.log(lang);
    return post('/submit/debug', {
        code: code,
        input: input,
        lang_id: Number(lang)
    })
}
