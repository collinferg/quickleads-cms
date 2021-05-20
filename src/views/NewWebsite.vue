<template>
	<div class="content" v-if="canView">
		<WebsiteForm @saveWebsite="saveWebsite"/>
	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to create websites.</p>
	</div>
</template>

<script>
import WebsiteForm from '@/components/WebsiteForm'
import { mapState } from 'vuex'

export default {
	components: {
		WebsiteForm
	},
	computed: {
		...mapState(['userProfile']),
		canView() {
			if ( this.userProfile.group === 'admin' ) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		saveWebsite(value) {
			value.created = new Date
			this.$store.dispatch('saveWebsite', {
				action: 'save',
				data: value
			});
		}
	}
}
</script>

<style lang="scss" scoped>

</style>