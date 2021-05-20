import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import { auth } from '../firebase'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Dashboard',
		component: Dashboard,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/login',
		name: 'Login',
		// route level code-splitting
		// this generates a separate chunk (Login.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "Login" */ '../views/Login.vue')
	},
	{
		path: '/users',
		name: 'Users',
		component: () => import(/* webpackChunkName: "Users" */ '../views/Users.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/websites',
		name: 'Websites',
		component: () => import(/* webpackChunkName: "Websites" */ '../views/Websites.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/websites/new',
		name: 'NewWebsite',
		component: () => import(/* webpackChunkName: "NewWebsite" */ '../views/NewWebsite.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/websites/edit/:id',
		name: 'EditWebsite',
		props: true,
		component: () => import(/* webpackChunkName: "EditWebsite" */ '../views/EditWebsite.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/pages',
		name: 'Pages',
		component: () => import(/* webpackChunkName: "Pages" */ '../views/Pages.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/pages/new',
		name: 'NewPage',
		component: () => import(/* webpackChunkName: "NewPage" */ '../views/NewPage.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/pages/edit/:id',
		name: 'EditPage',
		props: true,
		component: () => import(/* webpackChunkName: "EditPage" */ '../views/EditPage.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/forms',
		name: 'Forms',
		component: () => import(/* webpackChunkName: "Forms" */ '../views/Forms.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/forms/new',
		name: 'NewForm',
		component: () => import(/* webpackChunkName: "NewForm" */ '../views/NewForm.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '/forms/edit/:id',
		name: 'EditForm',
		props: true,
		component: () => import(/* webpackChunkName: "EditForm" */ '../views/EditForm.vue'),
		meta: {
			requiresAuth: true
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

	if (requiresAuth && !auth.currentUser) {
		next('/login')
	} else {
		next()
	}
})

export default router
