<template>
	<div class="content login">
		<div v-if="showPasswordReset">
			<h1 class="small">Reset your password</h1>
			<div class="message success" v-if="success">Please check your email for password reset instructions</div>
			<form @submit.prevent>
				<label for="resetEmail">Email</label>
				<input v-model.trim="resetForm.email" type="email" id="resetEmail">
				<ol class="inline-form">
					<li><button @click="resetPassword()" class="btn btn--blue">Reset Password</button></li>
					<li><a @click="togglePasswordReset()">Back to Login</a></li>
				</ol>
			</form>
		</div>
		<div v-else>
			<h1 class="small">Please Login...</h1>
			<form @submit.prevent>
				<label for="email">Email</label>
				<input v-model.trim="loginForm.email" type="text" name="email" id="email">
				<label for="password">Password</label>
				<input v-model.trim="loginForm.password" type="password" name="password" id="password">
				<ol class="inline-form">
					<li><button @click="login()" class="btn btn--blue">Log In</button></li>
					<li><a @click="togglePasswordReset()">Forgot Password</a></li>
				</ol>
			</form>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loginForm: {
				email: '',
				password: ''
			},
			resetForm: {
				email: ''
			},
			success: false,
			showPasswordReset: false
		}
	},
	methods: {
		login() {
			this.$store.dispatch('login', {
				email: this.loginForm.email,
				password: this.loginForm.password
			})
		},
		resetPassword() {
			this.$store.dispatch('resetPassword', {
				email: this.resetForm.email
			})
			this.success = true;
		},
		togglePasswordReset() {
			this.showPasswordReset = !this.showPasswordReset
		}
	}
}
</script>

<style lang="scss" scoped>

</style>