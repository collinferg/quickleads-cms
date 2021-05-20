<template>
	<div class="content" v-if="canView">
		<FormForm @saveForm="saveForm" :id="id"/>
	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to view forms.</p>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import FormForm from '@/components/FormForm'

export default {
	components: {
		FormForm
	},
	props: {
		id: {
			type: String,
			required: true
		}
	},
	computed: {
		...mapState(['userProfile']),
		canView() {
			if ( this.userProfile.group === 'admin' || this.userProfile.access.resources.includes('forms') ) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		saveForm(value) {
			// TODO: Add Logic to prevent dupe names
			value.updated = new Date
			this.$store.dispatch('saveForm', {
				action: 'edit',
				data: value
			})
		}
	}
}
</script>

<style lang="scss" scoped>

</style>