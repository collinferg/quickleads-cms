<template>
	<div>
		<form @submit.prevent>

			<div class="toolbar">
				<div class="actions">
					<router-link :to="{ name: 'Forms' }" class="btn">Back to Forms</router-link>
					<button @click="saveForm" :disabled="this.$v.form.$invalid" class="btn btn--blue">Save Form</button>
					<Prompt
						v-if="form.id && canDelete"
						label="Delete"
						:classList="`btn btn--red`"
						:content="`Are you sure you wish to delete form: `+form.name+`? This cannot be undone.`"
						@success="deleteForm()"
					/>
				</div>
			</div>

			<input v-model.trim="form.name" placeholder="Untitled Form" type="text" class="h1">

			<fieldset>
				<legend>Settings</legend>
				<label>Form Header</label>
				<input v-model="form.header" type="text">
				<label>Success Message</label>
				<input v-model="form.success" type="text">
			</fieldset>

			<fieldset>
				<legend>Fields</legend>
				<table class="table--small">
					<thead>
						<tr>
							<th></th>
							<th class="first">Label</th>
							<th>Type</th>
							<th>Character Limit</th>
							<th class="last">Required?</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(field, fieldIndex) in form.fields" :key="fieldIndex">

							<td class="first"><a @click="deleteField(fieldIndex)" class="btn btn--red btn--small">X</a></td>

							<td><input v-model="field.label" type="text"></td>

							<td v-if="field.type"><input v-model="field.type" type="text" disabled></td>
							<td v-else>
								<v-select
									v-model="field.type"
									:options="formFields"
								></v-select>
							</td>

							<td><input v-model="field.limit" type="number"></td>

							<td class="last"><input v-model="field.required" type="checkbox"></td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="3" class="first last"><button class="btn btn--blue btn--small" @click="addField()">Add new field</button></td>
						</tr>
					</tfoot>
				</table>
			</fieldset>
				
		</form>
	</div>
</template>

<script>
import { formsCollection } from '../firebase'
import { mapState } from 'vuex'
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'
import Prompt from '@/components/Prompt'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators';

export default {
	mixins: [
		validationMixin
	],
	components: {
		vSelect,
		Prompt
	},
	data() {
		return {
			form: {
				id: '',
				created: '',
				updated: '',
				name: '',
				header: '',
				success: '',
				fields: [
					{
						label: 'First Name',
						type: 'text',
						limit: 20,
						required: true
					},
					{
						label: 'Last Name',
						type: 'text',
						limit: 20,
						required: true
					},
					{
						label: 'Email',
						type: 'email',
						limit: 50,
						required: true
					}
				]
			},
			formFields: ['text', 'textarea', 'email', 'checkbox', 'tel', 'color', 'date', 'datetime-local', 'hidden', 'image', 'month', 'number', 'range', 'time', 'url', 'week']
		}
	},
	validations: {
		form: {
			name: {
				required
			}
		}
	},
	props: {
		id: {
			type: String,
			required: false
		}
	},
	computed: {
		...mapState(['forms']),
		...mapState(['userProfile']),
		canDelete() {
			if ( this.userProfile.group === 'admin' ) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		saveForm() {
			if (!this.$v.form.$invalid) {
				this.$emit('saveForm', this.form)
			}
		},
		deleteForm() {
			this.$store.dispatch('deleteForm', this.form.id)
		},
		deleteField(index) {
			this.form.fields.splice(index, 1)
		},
		addField() {
			let field = {
				label: '',
				type: '',
				limit: 50,
				required: false
			}
			this.form.fields.push(field)
		}
	},
	created: async function() {
		// If this.id is set, we are editing an existing form.
		if (this.id) {
			let form = await formsCollection.doc(this.id).get();
			Object.assign(this.form, form.data())
			this.form.id = this.id
		}
	}
}
</script>

<style lang="scss" scoped>

</style>