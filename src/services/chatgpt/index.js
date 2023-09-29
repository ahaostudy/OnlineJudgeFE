import axios from 'axios';

export async function postChat(messages) {
    const token = localStorage.getItem('token');
    const authorization = token ? "Bearer " + token : '';

    return await axios({
        method: 'post',
        url: '/api/chat',
        data: { messages },
        headers: { 'Authorization': authorization },
        responseType: 'stream'
    })
}
