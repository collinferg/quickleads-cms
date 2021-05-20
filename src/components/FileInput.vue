<template>
	<div>
		
		<input type="file" :multiple="this.multiple" ref="file" @change="uploadFiles()"/>

	</div>
</template>

<script>
import FireBaseStorageUpload from '@/mixins/FireBaseStorageUpload'

export default {
	mixins: [
		FireBaseStorageUpload,
	],
	props: {
		multiple: {
			type: Boolean,
			required: false
		},
		directory: {
			type: String,
			required: false
		}
	},
	computed: {
		filteredDirectory() {
			if ( this.directory ) {
				return this.directory.replace(/^\/+|\/+$/g, '')
			} else {
				return 'uploads'
			}
		}
	},
	watch: {
		fireBaseStoreageFile() {
			this.$emit('fileUploaded', {url: this.fireBaseStoreageFile.url, name: this.fireBaseStoreageFile.filename})
			this.$refs.file.value = ''
			return this.fireBaseStoreageFile
		}
	},
	methods: {
		uploadFiles() {
			this.fireBaseStorageUpload(this.$refs.file.files, this.filteredDirectory)
		}
	}
}
</script>

<style lang="scss">
</style>