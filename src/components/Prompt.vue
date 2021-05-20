<template>
	<div @keydown.esc="hidePrompt()" @keydown.enter="easyConfirm()" tabindex="0">
		<a @click="showPrompt()" :class="classList">{{label}}</a>
		<div v-if="show" class="modal">
			<div @click="hidePrompt()" class="modal__overlay"></div>
			<div class="modal__body">
				<h2 class="modal__header">Are you sure?</h2>
				<p v-if="content.length" class="modal__content">{{content}}</p>
				<div class="modal__actions">
					<a @click="hidePrompt()" class="btn btn--clear-red">Cancel</a>
					<a @click="confirm()" class="btn btn--blue">Confirm</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			show: false
		}
	},
	props: {
		label: {
			type: String,
			required: true
		},
		content: {
			type: String,
			required: false
		},
		allowEasyConfirm: {
			type: Boolean,
			required: false
		},
		classList: {
			type: String,
			required: false
		}
	},
	methods: {
		showPrompt() {
			this.show = true
		},
		hidePrompt() {
			this.show = false
		},
		confirm() {
			this.$emit('success')
			this.hidePrompt()
		},
		easyConfirm() {
			if ( this.allowEasyConfirm ) {
				this.confirm()
			}
		}
	}
}
</script>

<style lang="scss" scoped>

</style>