<template>
	<div class="content" v-if="canView">
		<FormForm @saveForm="saveForm"/>
	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to view forms.</p>
	</div>
</template>

<script>
import FormForm from '@/components/FormForm'
import { mapState } from 'vuex'

export default {
	components: {
		FormForm
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
			value.created = new Date
			this.$store.dispatch('saveForm', {
				action: 'save',
				data: value
			});
		}
	}
}
</script>

<style lang="scss" scoped>

</style>