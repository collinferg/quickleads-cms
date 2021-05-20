<template>
	<div class="content" v-if="canView">

		<h1>Websites</h1>

		<div class="toolbar" v-if="canCreateDelete">
			<!-- <div class="tools">
				<div class="tool">
					<v-select v-model="selectedBulkAction" :options="bulkActions" :clearable="false"></v-select>
					<button v-if="selectedBulkAction.code === 'deleteWebsites'" @click="deleteWebsites()" class="btn btn--red btn--small">Delete</button>
				</div>
			</div> -->
			<div class="actions">
				<router-link :to="{ name: 'NewWebsite' }" class="btn btn--blue">New Website</router-link>
			</div>
		</div>
		<table v-if="accessibleWebsites.length" class="table--striped">
			<thead>
				<tr>
					<!-- <th v-if="canCreateDelete">Select</th> -->
					<th>Name</th>
					<th>Url</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="website in accessibleWebsites" :key="website.id">
					<!-- <td v-if="canCreateDelete"><input v-model="website.selected" type="checkbox"></td> -->
					<td><router-link :to="{ name: 'EditWebsite', params: { id: website.id }}">{{ website.name }}</router-link></td>
					<td>{{website.url}}</td>
					<td class="actions">
						<router-link :to="{ name: 'EditWebsite', params: { id: website.id }}">Edit</router-link>
						<Prompt
							v-if="canCreateDelete"
							label="Delete"
							:content="`Are you sure you wish to delete website: `+website.name+`? All associated pages will also be deleted. This cannot be undone.`"
							@success="deleteWebsite(website.id)"
						/>
					</td>
				</tr>
			</tbody>
		</table>

		<p v-else class="well well--large">
			There are no websites
		</p>

	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to view websites.</p>
	</div>
</template>	

<script>
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'
import Prompt from '@/components/Prompt'
import { mapState } from 'vuex'

export default {
	components: {
		vSelect,
		Prompt
	},
	data() {
		return {
			bulkActions: [
				{
					label: 'Bulk Actions'
				},
				{
					label: 'Delete Website(s)',
					code: 'deleteWebsites'
				}
			],
			selectedBulkAction: {
				label: 'Bulk Actions'
			}
		}
	},
	computed: {
		...mapState(['websites']),
		...mapState(['userProfile']),
		canView() {
			if ( this.userProfile.group === 'admin' || this.userProfile.access.resources.includes('websites') ) {
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
		},
		accessibleWebsites() {
			if ( this.userProfile.group === 'admin' ) {
				return this.websites
			} else {
				const accessibleWebsites = this.websites.filter(website => this.userProfile.access.websites.includes(website.id))
				return accessibleWebsites
			}
		}
	},
	methods: {
		deleteWebsite(id) {
			this.$store.dispatch('deleteWebsite', id)
		},
		deleteWebsites() {
			let self = this
			this.accessibleWebsites.forEach(function(website) {
				if(website.selected) {
					self.$store.dispatch('deleteWebsite', website.id)
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>

</style>