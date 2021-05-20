<template>
	<div class="content" v-if="canView">

		<div v-if="canCreateDelete">
			<form @submit.prevent>
				<label class="required">Name</label>
				<input v-model.trim="userForm.name" type="text" placeholder="Harry Johnson">

				<label class="required">Group</label>
				<v-select
					v-model="userForm.group"
					:options="userGroups"
				></v-select>

				<div v-if="userForm.group === 'client'">
					<label class="required">What websites can this user access?</label>
					<select v-model="userForm.access.websites" multiple>
						<option v-for="(website, index) in websites" :key="index" :value="website.id">{{website.name}}</option>
					</select>

					<label class="required">What resources can this user access?</label>
					<select v-model="userForm.access.resources" multiple>
						<option v-for="(resource, index) in resources" :key="index" :value="resource">{{resource}}</option>
					</select>
				</div>

				<label class="required">Email</label>
				<input v-model.trim="userForm.email" type="email" placeholder="you@email.com">

				<label class="required">Password</label>
				<input v-model.trim="userForm.password" type="password" placeholder="********">
				<br/>
				<button @click="createUser()" class="btn btn--blue">Create User</button>
			</form>
		</div>

		<div>
			<h1>Users</h1>
			<table v-if="users.length" class="table--striped">
			<thead>
				<tr>
					<th>Name</th>
					<th>User Group</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="user in users" :key="user.id">
					<td>{{user.name}}</td>
					<td>{{user.group}}</td>
					<td class="actions">
					</td>
				</tr>
			</tbody>
		</table>
		</div>

	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to view users.</p>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'

export default {
	components: {
		vSelect
	},
	data() {
		return {
			userForm: {
				name: '',
				group: '',
				email: '',
				password: '',
				access: {
					websites: [],
					resources: []
				}
			},
			userGroups: ['admin', 'client'],
			resources: ['websites', 'pages', 'forms']
		}
	},
	computed: {
		...mapState(['users']),
		...mapState(['websites']),
		...mapState(['userProfile']),
		canView() {
			if ( this.userProfile.group === 'admin' ) {
				return true
			} else {
				return false
			}
		},
		canCreateDelete() {
			if ( this.userProfile.group === 'admin' ) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		createUser() {
			this.$store.dispatch('createUser', this.userForm)
		},
		deleteUser(id) {
			this.$store.dispatch('deleteUser', id)
		}
	}
}
</script>

<style lang="scss" scoped>

</style>