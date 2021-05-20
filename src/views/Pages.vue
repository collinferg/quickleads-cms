<template>
	<div class="content" v-if="canView">

		<h1>Pages</h1>

		<div class="toolbar">
			<div class="tools" v-if="canDelete">
				<div class="tool">
					<v-select v-model="selectedBulkAction" :options="bulkActions" :clearable="false"></v-select>
					<Prompt
						v-if="selectedBulkAction.code === 'deletePages'"
						label="Delete"
						:classList="`btn btn--red btn--small`"
						:content="`Are you sure you wish to delete these pages? This cannot be undone.`"
						@success="deletePages()"
					/>
				</div>
			</div>
			<div class="actions">
				<router-link :to="{ name: 'NewPage' }" class="btn btn--blue">New Page</router-link>
			</div>
		</div>
		<table v-if="accessiblePages.length" class="table--striped">
			<thead>
				<tr>
					<th v-if="canDelete">Select</th>
					<th>Home</th>
					<th>Name</th>
					<th>Website</th>
					<th>URL</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="page in accessiblePages" :key="page.id">
					<td v-if="canDelete"><input v-model="page.selected" type="checkbox"></td>
					<td>{{page.isHome}}</td>
					<td><router-link :to="{ name: 'EditPage', params: { id: page.id }}">{{ page.name }}</router-link></td>
					<td>{{page.websiteName}}</td>
					<td>{{page.url}}</td>
					<td class="actions">
						<router-link :to="{ name: 'EditPage', params: { id: page.id }}">Edit</router-link>
						<Prompt
							v-if="canDelete"
							label="Delete"
							:content="`Are you sure you wish to delete page: `+page.name+`? This cannot be undone.`"
							@success="deletePage(page.id)"
						/>
					</td>
				</tr>
			</tbody>
		</table>

		<p v-else class="well well--large">
			There are no pages
		</p>

	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to view pages.</p>
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
					label: 'Delete Pages(s)',
					code: 'deletePages'
				}
			],
			selectedBulkAction: {
				label: 'Bulk Actions'
			}
		}
	},
	computed: {
		...mapState(['pages']),
		...mapState(['userProfile']),
		canDelete() {
			if ( this.userProfile.group === 'admin' ) {
				return true
			} else {
				return false
			}
		},
		canView() {
			if ( this.userProfile.group === 'admin' || this.userProfile.access.resources.includes('pages') ) {
				return true
			} else {
				return false
			}
		},
		accessiblePages() {
			if ( this.userProfile.group === 'admin' ) {
				return this.pages
			} else {
				const accessiblePages = this.pages.filter(page => this.userProfile.access.websites.includes(page.website))
				return accessiblePages
			}
		}
	},
	methods: {
		deletePage(id) {
			this.$store.dispatch('deletePage', id)
		},
		deletePages() {
			let self = this
			this.pages.forEach(function(page) {
				if(page.selected) {
					self.$store.dispatch('deletePage', page.id)
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>

</style>