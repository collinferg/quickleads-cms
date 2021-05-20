<template>
	<div class="content" v-if="canView">
		<PageForm @savePage="savePage"/>
	</div>
	<div class="content" v-else>
		<p class="well well--large">You don't have permissions to view pages.</p>
	</div>
</template>

<script>
import PageForm from '@/components/PageForm'
import { mapState } from 'vuex'

export default {
	components: {
		PageForm
	},
	computed: {
		...mapState(['userProfile']),
		canView() {
			if ( this.userProfile.group === 'admin' || this.userProfile.access.resources.includes('pages') ) {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		savePage(value) {
			value.created = new Date
			this.$store.dispatch('savePage', {
				action: 'save',
				data: value
			});
		}
	}
}
</script>

<style lang="scss" scoped>

</style>