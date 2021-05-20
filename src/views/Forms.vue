<template>
	<div class="content" v-if="canView">

		<h1>Forms</h1>

		<div class="toolbar">
			<div class="tools" v-if="canDelete">
				<div class="tool">
					<v-select v-model="selectedBulkAction" :options="bulkActions" :clearable="false"></v-select>
					<Prompt
						v-if="selectedBulkAction.code === 'deleteForms'"
						label="Delete"
						:classList="`btn btn--red btn--small`"
						:content="`Are you sure you wish to delete these pages? This cannot be undone.`"
						@success="deleteForms()"
					/>
				</div>
			</div>
			<div class="actions">
				<router-link :to="{ name: 'NewForm' }" class="btn btn--blue">New Form</router-link>
			</div>
		</div>
		<table v-if="forms.length" class="table--striped">
			<thead>
				<tr>
					<th v-if="canDelete">Select</th>
					<th>Name</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="form in forms" :key="form.id">
					<td v-if="canDelete"><input v-model="form.selected" type="checkbox"></td>
					<td><router-link :to="{ name: 'EditForm', params: { id: form.id }}">{{ form.name }}</router-link></td>
					<td class="actions">
						<router-link :to="{ name: 'EditForm', params: { id: form.id }}">Edit</router-link>
						<Prompt
							v-if="canDelete"
							label="Delete"
							:content="`Are you sure you wish to delete form: `+form.name+`? This cannot be undone.`"
							@success="deleteForm(form.id)"
						/>
					</td>
				</tr>
			</tbody>
		</table>

		<p v-else class="well well--large">
			There are no forms
		</p>

	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to view forms.</p>
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
					label: 'Delete Forms(s)',
					code: 'deleteForms'
				}
			],
			selectedBulkAction: {
				label: 'Bulk Actions'
			}
		}
	},
	computed: {
		...mapState(['forms']),
		...mapState(['userProfile']),
		canView() {
			if ( this.userProfile.group === 'admin' || this.userProfile.access.resources.includes('forms') ) {
				return true
			} else {
				return false
			}
		},
		canDelete() {
			if ( this.userProfile.group === 'admin' ) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		deleteForm(id) {
			this.$store.dispatch('deleteForm', id)
		},
		deleteForms() {
			let self = this
			this.forms.forEach(function(form) {
				if(form.selected) {
					self.$store.dispatch('deleteForm', form.id)
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>

</style>