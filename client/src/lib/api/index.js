/* global Headers, URLSearchParams */
import config from 'config'

const BASE_URL = config.api.baseUrl
let headers = new Headers()
headers.append('Content-Type', 'application/json')

export function cleanQuery (object) {
	Object.keys(object).forEach(key => !object[key] && delete object[key])
	return object
}

let api = {
	auth: {
		authenticated: false,
		login () {
			window.location = `${BASE_URL}login/shackgitlab/`
		},
		getSession () {
			const queryParams = new URLSearchParams(window.location.hash.substring(1))
			let token
			if (queryParams.has('token')) {
				token = queryParams.get('token')
				localStorage.setItem('token', token)
				window.history.replaceState({}, document.title, '.') // remove hash from url
			} else {
				token = localStorage.getItem('token')
			}
			if (!token) return Promise.reject(new Error('no session'))
			headers.set('Authorization', 'Token ' + token)
			api.auth.authenticated = true
			return Promise.resolve()
		},
		logout () {
			localStorage.clear()
			window.location = '/'
		}
	},
	users: {
		me () {
			return api.fetch(`user`)
		}
	},
	rooms: {
		list () {
			return api.fetch(`rooms/`)
		}
	},
	events: {
		list () {
			return api.fetch(`events/`)
		},
		get (id) {
			return api.fetch(`events/${id}/`)
		},
		update (event) {
			return api.fetch(`events/${event.id}/`, 'PUT', event)
		},
		create (event) {
			return api.fetch('events/', 'POST', event)
		},
		delete (event) {
			return api.fetch(`events/${event.id}/`, 'DELETE')
		}
	},
	series: {
		list () {
			return api.fetch(`series/`)
		},
		get (id) {
			return api.fetch(`series/${id}/`)
		},
		update (event) {
			return api.fetch(`series/${event.id}/`, 'PUT', event)
		},
		create (event) {
			return api.fetch('series/', 'POST', event)
		},
		delete (event) {
			return api.fetch(`series/${event.id}/`, 'DELETE')
		}
	}
}

api.fetch = function (url, method, body) {
	let options = {
		method: method || 'GET',
		headers,
		body: JSON.stringify(body)
	}
	return window.fetch(url.startsWith('http') ? url : BASE_URL + url, options).then((response) => {
		if (response.status === 204) {
			return Promise.resolve(response)
		}
		return response.json().then((json) => {
			if (!response.ok) {
				const error = new Error('Request Failed!')
				error.response = response
				error.json = json
				return Promise.reject(error)
			}
			return Promise.resolve(json)
		})
	}).catch((error) => {
		return Promise.reject(error)
	})
}

export default api
