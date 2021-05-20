<template>
	<div v-if="canView">

		<form @submit.prevent enctype="multipart/form-data">
			
			<div class="toolbar">
				<div class="actions">
					<router-link :to="{ name: 'Pages' }" class="btn">Back to Pages</router-link>
					<JsonCSV v-if="form.id" class="btn" :data="exportData" :name="exportFileName + '.csv'">Export CSV</JsonCSV>
					<button @click="savePage" :disabled="this.$v.form.$invalid" class="btn btn--blue">Save Page</button>
					<Prompt
						v-if="form.id && canDelete"
						label="Delete"
						:classList="`btn btn--red`"
						:content="`Are you sure you wish to delete page: `+form.name+`? This cannot be undone.`"
						@success="deletePage()"
					/>
				</div>
			</div>

			<input v-model.trim="form.name" @blur="$v.form.name.$touch()" placeholder="Untitled Page" type="text" class="h1">
			<p v-if="$v.form.name.$invalid && $v.form.name.$dirty"  class="error-msg">The website name is required.</p>

			<fieldset>
				<legend @click="toggleSettings()" :class="{ opened : showSettings }">Settings</legend>
				<div v-if="showSettings">
					<label class="required">Website</label>
					<v-select
						v-model="form.website"
						:options="websites"
						:reduce="website => website.id"
						:clearable="false"
						:disabled="Object.keys(form.content).length > 0"
						@input="setWebsiteName($event)"
						label="name"
					></v-select>
					<label class="required">Theme</label>
					<v-select
						v-model="form.theme"
						:options="themes"
						:clearable="false"
						:disabled="Object.keys(form.content).length > 0"
						@input="changeTheme()"
						label="name"
					></v-select>
					<div v-if="this.id">
						<label class="required">Layout</label>
						<input :value="form.layout" type="text" disabled>
					</div>
					<div v-else-if="availableLayouts">
						<label class="required">Layout</label>
						<v-select
							v-model="form.layout"
							:options="availableLayouts"
							:reduce="layout => layout.key"
							:clearable="false"
							:disabled="Object.keys(form.content).length > 0"
							@input="changeLayout()"
							label="name"
						></v-select>
					</div>
					<div v-if="form.layout && form.layout !== 'gallery' && form.layout !== 'blog-list' && form.layout !== 'blog-post'">
						<label>Use Localized Content?</label>
						<input v-model="form.isLocalized" type="checkbox" class="switch">
					</div>
					<div v-if="form.layout">
						<label>Form</label>
						<v-select
							v-model="form.form"
							:options="forms"
							:reduce="form => form.id"
							:clearable="false"
							label="name"
						></v-select>
					</div>
				</div>
			</fieldset>
			
			<div v-if="form.website && form.theme && form.layout">
				<fieldset>
					<legend @click="toggleContent()" :class="{ opened : showContent }">Page Content (Not Localized)</legend>
					<div v-if="showContent">
						<div v-for="(section, sectionIndex) in form.content" :key="sectionIndex" class="group">
							<div v-for="(element, elementIndex) in section.elements" :key="elementIndex" class="item">

								<label>{{section.label}}: <span>{{element.label}}</span></label>

								<div v-if="element.type === 'file'">
									<FileInput @fileUploaded="setFilePaths(form.content, $event, sectionIndex, elementIndex)" :directory="'media'" :multiple="element.multiple"/>
									<div v-if="element.value.length" class="fileInput-previews">
										<div v-for="(file, fileIndex) in element.value" :key="fileIndex" class="preview">
											<img :src="file.url" :alt="file.name">
											<input v-model="file.alt" type="text" placeholder="Alt Text">
											<a @click="removeImage(form.content, sectionIndex, elementIndex, fileIndex)" class="btn btn--red btn--small">X</a>
										</div>
									</div>
								</div>

								<div v-else-if="element.type === 'textarea'">
									<TextEditor v-model="element.value"/>
								</div>

								<div v-else-if="element.type === 'gallery'">
									<FileInput @fileUploaded="setFilePaths(form.content, $event, sectionIndex, elementIndex)" :directory="'media'" :multiple="element.multiple"/>
									<div v-if="element.value.length" class="fileInput-previews">
										<div v-for="(file, fileIndex) in element.value" :key="fileIndex" class="preview">
											<img :src="file.url" :alt="file.name">
											<input v-model="file.title" type="text" placeholder="Title">
											<input v-model="file.description" type="text" placeholder="Description">
											<input v-model="file.alt" type="text" placeholder="Alt Text">
											<a @click="removeImage(form.content, sectionIndex, elementIndex, fileIndex)" class="btn btn--red btn--small">X</a>
										</div>
									</div>
								</div>

								<input v-else v-model="element.value" :type="element.type">

							</div>
						</div>
					</div>
				</fieldset>
				<fieldset v-if="form.isLocalized && form.layout !== 'gallery' && form.layout !== 'blog-list' && form.layout !== 'blog-post'">
					<legend @click="toggleLocalizedContent()" :class="{ opened : showLocalizedContent }">Page Content (Localized)</legend>
					<div v-if="showLocalizedContent">
						<div v-for="(section, sectionIndex) in form.localizedContent" :key="sectionIndex" class="group">
							<div v-for="(element, elementIndex) in section.elements" :key="elementIndex" class="item">

								<label>{{section.label}}: <span>{{element.label}}</span></label>

								<div v-if="element.type === 'file'">
									<FileInput @fileUploaded="setFilePaths(form.localizedContent, $event, sectionIndex, elementIndex)" :directory="'media'" :multiple="element.multiple"/>
									<div v-if="element.value.length" class="fileInput-previews">
										<div v-for="(file, fileIndex) in element.value" :key="fileIndex" class="preview">
											<img :src="file.url" :alt="file.name">
											<input v-model="file.alt" type="text" placeholder="Alt Text">
											<a @click="removeImage(form.localizedContent, sectionIndex, elementIndex, fileIndex)" class="btn btn--red btn--small">X</a>
										</div>
									</div>
								</div>

								<div v-else-if="element.type === 'textarea'">
									<TextEditor v-model="element.value"/>
								</div>

								<div v-else-if="element.type === 'gallery'">
									<FileInput @fileUploaded="setFilePaths(form.localizedContent, $event, sectionIndex, elementIndex)" :directory="'media'" :multiple="element.multiple"/>
									<div v-if="element.value.length" class="fileInput-previews">
										<div v-for="(file, fileIndex) in element.value" :key="fileIndex" class="preview">
											<img :src="file.url" :alt="file.name">
											<input v-model="file.title" type="text" placeholder="Title">
											<input v-model="file.description" type="text" placeholder="Description">
											<input v-model="file.alt" type="text" placeholder="Alt Text">
											<a @click="removeImage(form.localizedContent, sectionIndex, elementIndex, fileIndex)" class="btn btn--red btn--small">X</a>
										</div>
									</div>
								</div>

								<input v-else v-model="element.value" :type="element.type">

							</div>
						</div>
					</div>
				</fieldset>
				<fieldset>
					<legend @click="toggleSeo()" :class="{ opened : showSeo }">SEO</legend>
					<div v-if="showSeo">

						<label class="required">Page URL</label>
						<input :value="form.url" @input="sanitizeUrl($event)" type="text" :disabled="form.isHome || form.layout === 'blog-list'">
						<span v-if="form.isHome" class="note">Home pages always have a URL = /. No website should have more than one homepage.</span>
						<span v-if="form.layout === 'blog-list'" class="note">Pages with a layout equal to "Blog List" always have a URL = "/blog". No website should have more than one Blog List.</span>
						<span v-if="form.layout === 'blog-post'" class="note">Pages with a layout equal to "Blog Post" always have a URL that begins with "/blog"</span>

						<div v-if="form.layout !== 'blog-list' && form.layout !== 'blog-post'">
							<label>This is the homepage</label>
							<input type="checkbox" v-model="form.isHome" @change="toggleHome()" class="switch">
						</div>

						<table class="table--small">
							<thead>
								<tr>
									<th class="first"></th>
									<th>Meta Tag</th>
									<th class="last">Content</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(meta, metaIndex) in form.meta" :key="metaIndex">

									<td class="first"><a @click="deleteMetaTag(metaIndex)" class="btn btn--red btn--small">X</a></td>

									<td v-if="meta.type"><input v-model="meta.type" type="text" disabled></td>
									<td v-else>
										<v-select
											v-model="meta.type"
											:options="metaTags"
										></v-select>
									</td>

									<td class="last"><input v-model="meta.content" type="text"></td>
								</tr>
							</tbody>
							<tfoot>
								<tr>
									<td colspan="3" class="first last"><button class="btn btn--blue btn--small" @click="addMetaTag()">Add new Meta Tag</button></td>
								</tr>
							</tfoot>
						</table>
					</div>
				</fieldset>
			</div>
			<p v-else class="well well--large">Please designate a Store, Theme, and Layout before configuring content or SEO settings.</p>
				
		</form>
	</div>
	<p class="well well--large" v-else>You don't have permissions to view this page.</p>
</template>

<script>
import { pagesCollection } from '../firebase'
import { mapState } from 'vuex'
import axios from 'axios'
import themes from '../themes.json'

import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'

import FileInput from '@/components/FileInput'
import Prompt from '@/components/Prompt'

import TextEditor from '@/components/TextEditor'

import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators';

import JsonCSV from 'vue-json-csv'

export default {
	mixins: [
		validationMixin
	],
	components: {
		vSelect,
		FileInput,
		TextEditor,
		Prompt,
		JsonCSV
	},
	data() {
		return {
			form: {
				id: '',
				created: '',
				updated: '',
				name: '',
				website: '',
				websiteName: '',
				theme: '',
				layout: '',
				form: '',
				content: {},
				isLocalized: false,
				localizedContent: null,
				url: '',
				meta: [
					{
						type: 'title',
						content: ''
					},
					{
						type: 'description',
						content: ''
					}
				],
				isHome: false
			},
			availableLayouts: '',
			themes: themes,
			fileUrl: '',
			metaTags: ['title', 'description', 'keywords', 'robots', 'canonical', 'google-site-verification'],
			exportData: {},
			exportFileName: 'export',
			showSettings: true,
			showContent: false,
			showLocalizedContent: false,
			showSeo: false,
		}
	},
	validations: {
		form: {
			name: {
				required
			}
		}
	},
	props: {
		id: {
			type: String,
			required: false
		}
	},
	computed: {
		...mapState(['websites']),
		...mapState(['forms']),
		...mapState(['userProfile']),
		canView() {
			if ( this.userProfile.group === 'admin' || (this.userProfile.access.resources.includes('pages') && this.userProfile.access.websites.includes(this.form.website)) ) {
				return true
			} else {
				return false
			}
		},
		canDelete() {
			if (this.userProfile.group === 'admin') {
				return true
			} else {
				return false
			}
		}
	},
	methods: {
		savePage() {
			if (!this.$v.form.$invalid) {
				this.$emit('savePage', this.form)
			}
		},
		deletePage() {
			this.$store.dispatch('deletePage', this.form.id)
		},
		setWebsiteName(id){
			const website = this.websites.find(website => website.id === id)
			this.form.websiteName = website.name
		},
		async changeTheme() {
			const response = await axios.get('/themes/'+this.form.theme+'/manifest.json')
			this.availableLayouts = response.data.layouts
			this.form.layout = ''
		},
		changeLayout() {
			const layout = this.availableLayouts.find(layout => layout.key === this.form.layout)
			this.form.content = layout.sections,
			this.form.localizedContent = JSON.parse(JSON.stringify(layout.sections))
			if ( layout.key === 'blog-list' ) {
				this.form.url = '/blog'
			}
		},
		setFilePaths(target, data, sectionIndex, elementIndex) {
			const element = target[sectionIndex].elements[elementIndex]
			if (element.multiple) {
				element.value.push(data)
			} else {
				element.value = [data]
			}
		},
		removeImage(target, sectionIndex, elementIndex, fileIndex) {
			const element = target[sectionIndex].elements[elementIndex]
			element.value.splice(fileIndex, 1)
		},
		sanitizeUrl(event) {
			let value = event.target.value.replace(/[^a-zA-Z0-9/]/g,'-').toLowerCase()
			console.log(value, value.length)

			if ( !value.startsWith('/') ) {
				value = '/'+value
			}

			console.log(this.form.layout)

			if (this.form.layout === 'blog-post' && !value.startsWith('/blog')) {
				value = '/blog'+value
			}

			this.form.url = value
		},
		addMetaTag() {
			let tag = {
				type: '',
				content: ''
			}
			this.form.meta.push(tag)
		},
		deleteMetaTag(index) {
			this.form.meta.splice(index, 1)
		},
		toggleHome() {
			if ( this.form.isHome ) {
				this.form.url = '/'
			} else {
				this.form.url = ''
			}
		},
		toggleSeo() {
			this.showSeo = !this.showSeo;
		},
		toggleContent() {
			this.showContent = !this.showContent;
		},
		toggleLocalizedContent() {
			this.showLocalizedContent = !this.showLocalizedContent;
		},
		toggleSettings() {
			this.showSettings = !this.showSettings;
		}
	},
	created: async function() {
		// If this.id is set, we are editing an existing page.
		if (this.id) {
			let page = await pagesCollection.doc(this.id).get();
			Object.assign(this.form, page.data())
			this.form.id = this.id

			// Build Export Data
			let website = this.websites.find(website => website.id === this.form.website)
			console.log(website)
			let csv = [],
				url = this.form.url

			this.exportFileName = this.form.name.toLowerCase().replace(/\s+/g, '-')
			if ( url !== '/' ) {
				website.locations.forEach(function(state) {
					state.counties.forEach(function(county) {
						county.cities.forEach(function(city) {
							if (city.active) {
								let statename = state.meta.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/'+/g, ""),
									cityname = city.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/'+/g, "")

								let data = {
									domain: website.url,
									keyword: null,
									path: url + '/' + cityname + '/' +statename,
									city: city.name,
									state: state.meta.label,
									stabb: state.meta.code,
									county: county.name,
									zip: city.zip,
									phone: county.phone,
									latitude: city.coords[0],
									longitude: city.coords[1]
								}

								csv.push(data)
							}
						})
					}.bind(this))
				}.bind(this))
			} else {
				let data = {
					domain: website.url,
					keyword: null,
					path: url,
					city: null,
					state: null,
					stabb: null,
					county: null,
					zip: null,
					phone: null,
					latitude: null,
					longitude: null
				}

				csv.push(data)
			}

			this.exportData = csv
		}
	}
}
</script>

<style lang="scss" scoped>

</style>