<template>
	<div class="content">
		<h1>Welcome, {{userProfile.name}}</h1>
		<a href="/docs/index.html">Read the documentation</a>
	</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
	computed: {
		...mapState(['userProfile'])
	}
}
</script>

<style lang="scss" scoped>

</style>