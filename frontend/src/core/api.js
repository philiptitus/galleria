import axios from 'axios'


export const ADDRESS =  '10.0.2.2:8000'

const api = axios.create({
	baseURL: 'http://' + ADDRESS,
	headers: {
		'Content-Type': 'application/json'
	}
})

export default api