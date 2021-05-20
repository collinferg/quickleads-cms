<template>
	<div id="app">
		<Nav v-if="showNav"></Nav>
		<router-view/>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Nav from '@/components/Nav'

export default {
	components: {
		Nav
	},
	computed: {
		...mapState(['userProfile']),
		showNav() {
			return this.userProfile.id
		}
	}
}
</script>

<style lang="scss">

</style>
