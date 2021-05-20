<template>
	<div>
		<quill-editor
			ref="quillEditor"
			:options="options"
			:value="value"
			@input="$emit('input', $event)"
		/>
	</div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
import { ImageResize } from 'quill-image-resize-module'
import FireBaseStorageUpload from '@/mixins/FireBaseStorageUpload'

Quill.register('modules/imageResize', ImageResize)

export default {
	mixins: [FireBaseStorageUpload],
	props: {
		value: {
			type: String,
			required: false
		},
		directory: {
			type: String,
			required: false
		}
	},
	components: {
		quillEditor
	},
	data() {
		return {
			options: {
				modules: {
					toolbar: {
						container: [
							[{'header': [1, 2, 3, 4, 5, 6, false]}],
							['bold', 'italic', 'underline', 'strike'],
							['blockquote'],
							[{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
							[{ 'color': [] }, { 'background': [] }],
							[{ 'align': [] }],
							['link', 'image'],
							['clean']
						],
						handlers: {
							'image': () => {
								this.selectLocalImage()
							}
						}
					},
					imageResize: {}
				}
			}
		}
	},
	computed: {
		filteredDirectory() {
			if ( this.directory ) {
				return this.directory.replace(/^\/+|\/+$/g, '')
			} else {
				return 'uploads'
			}
		},
		editor() {
			return this.$refs.quillEditor.quill
		}
	},
	watch: {
		fireBaseStoreageFile() {
			this.insertToEditor(this.fireBaseStoreageFile.url)
			return this.fireBaseStoreageFile
		}
	},
	methods: {
		selectLocalImage() {
			const input = document.createElement('input')
			input.setAttribute('type', 'file')
			input.click()
			input.onchange = () => {
				const file = input.files[0]
				// verify only image
				if (/^image\//.test(file.type)) {
					this.saveToServer(file)
				} else {
					console.warn('You can only upload images')
				}
			}
		},
		saveToServer(file) {
			const fd = new FormData()
			fd.append('image', file)
			this.fireBaseStorageUpload(file, this.filteredDirectory)
		},
		insertToEditor(url) {
			console.log(this.editor, url)
			const range = this.editor.getSelection()
			this.editor.insertEmbed(range.index, 'image', url)
		}
	}
}
</script>

<style lang="scss" scoped>
</style>