<template>
	<div class="content" v-if="canView">
		<WebsiteForm @saveWebsite="saveWebsite" :id="id"/>
	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to view this website.</p>
	</div>
</template>

<script>
import WebsiteForm from '@/components/WebsiteForm'
import { mapState } from 'vuex'

export default {
	components: {
		WebsiteForm
	},
	props: {
		id: {
			type: String,
			required: true
		}
	},
	methods: {
		saveWebsite(value) {
			// TODO: Add Logic to prevent dupe names
			value.updated = new Date
			this.$store.dispatch('saveWebsite', {
				action: 'edit',
				data: value
			})
		}
	},
	computed: {
		...mapState(['userProfile']),
		restrictedNames() {
			return this.$store.state.websites.map(website => website.name)
		},
		canView() {
			if ( this.userProfile.group === 'admin' || (this.userProfile.access.resources.includes('websites') && this.userProfile.access.websites.includes(this.id)) ) {
				return true
			} else {
				return false
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>