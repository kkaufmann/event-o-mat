import moment from 'moment'
import api from 'lib/api'
import { plenumForWeek } from 'lib/plenum'

const actions = {
	'fetch-all' ({dispatch}) {
		return Promise.all([dispatch('fetch-user'), dispatch('fetch-rooms'), dispatch('fetch-events'), dispatch('fetch-series')])
	},
	'fetch-user' ({commit}) {
		return api.users.me().then((user) => {
			commit('SET_USER', {
				username: user.username,
				hasPermissions: user.is_staff,
				authenticated: api.auth.authenticated
			})
			return Promise.resolve()
		})
	},
	'fetch-rooms' ({commit}) {
		return api.rooms.list().then((rooms) => {
			commit('SET_ROOMS', rooms)
			return Promise.resolve()
		})
	},
	'fetch-series' ({commit}) {
		return api.series.list().then((series) => {
			commit('SET_SERIES_LIST', series)
			return Promise.resolve(series)
		})
	},
	'fetch-events' ({commit}) {
		return api.events.list().then((events) => {
			moment.locale('de')
			for (const event of events) {
				event.start = moment(event.start)
				event.end = moment(event.end)
			}

			for (let i = 0; i < 75; i++) {
				const date = moment().startOf('year').startOf('week').add(7 * i, 'days')
				plenumForWeek(date)

				events.push({
					name: 'Plenum',
					plenumLink: `https://wiki.shackspace.de/plenum/${date.format('YYYY-MM-DD')}`,
					start: date,
					end: date.clone().set('hour', 21),
					room: 1,
					keyholder: {
						id: 0,
						username: ''
					}
				})
			}
			events.sort((a, b) => a.start.diff(b.start))
			commit('SET_EVENTS', events)
			return Promise.resolve()
		})
	},
	'create-event' ({commit}, event) {
		return api.events.create(event).then(event => {
			commit('ADD_EVENT', event)
			return Promise.resolve(event)
		})
	},
	'update-event' ({commit}, event) {
		return api.events.update(event).then(event => {
			commit('UPDATE_EVENT', event)
			return Promise.resolve(event)
		})
	},
	'delete-event' ({commit}, event) {
		return api.events.delete(event).then(() => {
			commit('REMOVE_EVENT', event)
			return Promise.resolve()
		})
	}
}

export default actions
