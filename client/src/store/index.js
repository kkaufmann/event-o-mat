import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
// this needs to be here and not in main.js, because imports get all hoisted ¬_¬
Vue.use(Vuex)

const state = {
	user: {
		username: null,
		authenticated: false,
		hasPermissions: false
	},
	rooms: null,
	roomsLookup: {},
	events: null,
	seriesList: null
}

const store = new Vuex.Store({
	state,
	mutations,
	getters,
	actions
})

export default store
