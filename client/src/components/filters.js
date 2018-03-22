import Vue from 'vue'
import moment from 'moment'

const datetimeFormat = 'YYYY-MM-DD HH:mm'
Vue.filter('datetime', (date) => {
	return moment(date).format(datetimeFormat)
})

Vue.filter('fromnow', (date) => {
	return moment(date).fromNow()
})
Vue.filter('truncate', (str, length) => {
	return (str.length > length ? str.slice(0, length - 1) + '…' : str)
})
Vue.filter('times', (count) => {
	if (count === 1)
		return 'once'
	if (count === 2)
		return 'twice'
	return `${count} times`
})
