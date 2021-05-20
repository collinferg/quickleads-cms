import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

fb.websitesCollection.orderBy('created', 'desc').onSnapshot(snapshot => {
	let websiteArray = []

	snapshot.forEach(doc => {
		let website = doc.data()
		website.id = doc.id

		websiteArray.push(website)
	})

	store.commit('setWebsites', websiteArray)
})

fb.pagesCollection.orderBy('created', 'desc').onSnapshot(snapshot => {
	let pageArray = []

	snapshot.forEach(doc => {
		let page = doc.data()
		page.id = doc.id

		pageArray.push(page)
	})

	store.commit('setPages', pageArray)
})

fb.formsCollection.orderBy('created', 'desc').onSnapshot(snapshot => {
	let formArray = []

	snapshot.forEach(doc => {
		let form = doc.data()
		form.id = doc.id

		formArray.push(form)
	})

	store.commit('setForms', formArray)
})

fb.usersCollection.orderBy('group', 'desc').onSnapshot(snapshot => {
	let usersArray = []

	snapshot.forEach(doc => {
		let user = doc.data()
		user.id = doc.id

		usersArray.push(user)
	})

	store.commit('setUsers', usersArray)
})

const store = new Vuex.Store({
	state: {
		userProfile: {
			id: null,
			name: null,
			group: null,
			access: {
				websites: [],
				resources: []
			}
		},
		websites: [],
		pages: [],
		forms: [],
		users: []
	},
	mutations: {
		setUserProfile(state, val) {
			state.userProfile = val.data
			state.userProfile.id = val.id
		},
		setWebsites(state, val) {
			state.websites = val
		},
		setPages(state, val) {
			state.pages = val
		},
		setForms(state, val) {
			state.forms = val
		},
		setUsers(state, val) {
			state.users = val
		}
	},
	actions: {
		async createUser({ dispatch }, form) {
			// sign user up
			const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

			// create user profile object in userCollections
			await fb.usersCollection.doc(user.uid).set({
				name: form.name,
				group: form.group,
				access: form.access
			})

			// fetch user profile and set in state
			dispatch('fetchUserProfile', user)
		},
		async login({ dispatch }, form) {
			// sign user in
			const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

			// fetch user profile and set in state
			dispatch('fetchUserProfile', user)
		},
		async logout({ commit }) {
			await fb.auth.signOut()

			// clear userProfile and redirect to Login
			commit('setUserProfile', {id: null, data: {}})
			router.push({ name: 'Login' })
		},
		async resetPassword(context, form) {
			await fb.auth.sendPasswordResetEmail(form.email)
		},
		async fetchUserProfile({ commit }, user) {
			// fetch user profile
			const userProfile = await fb.usersCollection.doc(user.uid).get()

			// set user profile in state
			commit('setUserProfile', {id: user.uid, data: userProfile.data()})

			// change route to dashboard
			if (router.currentRoute.name === 'Login') {
				router.push({ name: 'Dashboard' })
			}
		},
		async saveWebsite(context, website) {
			if ( website.action === 'save' ) {
				// Add new website
				await fb.websitesCollection.add(website.data)
			} else if ( website.action === 'edit' ) {
				// Edit existing website
				await fb.websitesCollection.doc(website.data.id).set(website.data)
			}

			router.push({ name: 'Websites' })
		},
		async deleteWebsite(context, id) {
			await fb.websitesCollection.doc(id).delete()
			if (router.currentRoute.name !== 'Websites') {
				router.push({ name: 'Websites' })
			}
		},
		async savePage(context, page) {
			if ( page.action === 'save' ) {
				// Add new page
				await fb.pagesCollection.add(page.data)
			} else if ( page.action === 'edit' ) {
				// Edit existing page
				await fb.pagesCollection.doc(page.data.id).set(page.data)
			}

			router.push({ name: 'Pages' })
		},
		async deletePage(context, id) {
			await fb.pagesCollection.doc(id).delete()
			if (router.currentRoute.name !== 'Pages') {
				router.push({ name: 'Pages' })
			}
		},
		async saveForm(context, form) {
			if ( form.action === 'save' ) {
				// Add new form
				await fb.formsCollection.add(form.data)
			} else if ( form.action === 'edit' ) {
				// Edit existing form
				await fb.formsCollection.doc(form.data.id).set(form.data)
			}

			router.push({ name: 'Forms' })
		},
		async deleteForm(context, id) {
			await fb.formsCollection.doc(id).delete()
			if (router.currentRoute.name !== 'Forms') {
				router.push({ name: 'Forms' })
			}
		}
	},
	modules: {
	}
})

export default store