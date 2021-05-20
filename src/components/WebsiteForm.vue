<template>
	<div>
		<form @submit.prevent>

			<div class="toolbar">
				<div class="actions">
					<router-link :to="{ name: 'Websites' }" class="btn">Back to Websites</router-link>
					<button @click="saveWebsite" :disabled="this.$v.form.$invalid" class="btn btn--blue">Save Website</button>
					<Prompt
						v-if="form.id && canDelete"
						label="Delete"
						:classList="`btn btn--red`"
						:content="`Are you sure you wish to delete website: `+form.name+`? All associated pages will also be deleted. This cannot be undone.`"
						@success="deleteWebsite()"
					/>
				</div>
			</div>

			<input v-model.trim="form.name" @blur="$v.form.name.$touch()" placeholder="Untitled Website" type="text" class="h1">
			<p v-if="$v.form.name.$invalid && $v.form.name.$dirty"  class="error-msg">The website name is required.</p>

			<fieldset>
				<legend>Settings</legend>
				<label class="required">URL</label>
				<input v-model.trim="form.url" @blur="$v.form.url.$touch()" type="text">
				<p v-if="$v.form.url.$invalid && $v.form.url.$dirty"  class="error-msg">A valid URL is required: https://www.example.com</p>
				<label class="required">Logo</label>
				<FileInput @fileUploaded="setLogoPath($event)" :directory="'logo'"/>
				<p v-if="$v.form.logo.$invalid"  class="error-msg">Please upload a logo.</p>
				<div v-if="form.logo" class="fileInput-previews" style="margin-top: -30px; margin-bottom: 20px;">
					<div class="preview">
						<img :src="form.logo.url" :alt="form.logo.name" width="100">
						<a @click="removeLogo()" class="btn btn--red btn--small">X</a>
					</div>
				</div>
				<label class="required">Primary Color</label>
				<input v-model.trim="form.color" @blur="$v.form.color.$touch()" type="text">
				<p v-if="$v.form.color.$invalid && $v.form.color.$dirty"  class="error-msg">Please choose a color.</p>
				<label>Secondary Color</label>
				<input v-model.trim="form.secondaryColor" type="text">
			</fieldset>

			<fieldset>
				<legend>Contact Information</legend>
				<label class="required">Emails</label>
				<input v-model.trim="form.emails" @blur="$v.form.emails.$touch()" type="text" placeholder="one@email.com, two@email.com">
				<p v-if="$v.form.emails.$invalid && $v.form.emails.$dirty"  class="error-msg">At least one email address is required.</p>
				<label class="required">Default Phone Number</label>
				<input v-model.trim="form.phone" @blur="$v.form.phone.$touch()" type="text">
				<p v-if="$v.form.phone.$invalid && $v.form.phone.$dirty"  class="error-msg">A default phone number is required.</p>
				<label class="required">Default City</label>
				<input v-model.trim="form.city" @blur="$v.form.city.$touch()" type="text">
				<p v-if="$v.form.city.$invalid && $v.form.city.$dirty"  class="error-msg">A default city is required.</p>
				<label class="required">Default State</label>
				<input v-model.trim="form.state" @blur="$v.form.state.$touch()" type="text">
				<p v-if="$v.form.state.$invalid && $v.form.state.$dirty"  class="error-msg">A default state is required.</p>
				<label>Facebook URL</label>
				<input v-model.trim="form.facebook" type="text">
				<label>Twitter URL</label>
				<input v-model.trim="form.twitter" type="text">
				<label>Instagram URL</label>
				<input v-model.trim="form.instagram" type="text">
				<label>Youtube URL</label>
				<input v-model.trim="form.youtube" type="text">
			</fieldset>

			<fieldset>
				<legend>Menu</legend>
				<div v-if="form.menu.length">
					<div v-for="(item, itemIndex) in form.menu" :key="itemIndex" class="accordion">
						<div class="accordion__title">
							<div class="inline-form">
								<input v-model.trim="item.name" type="text" placeholder="Menu Item Label">
								<input v-model.trim="item.href" type="text" placeholder="Menu Item Link">
								<input v-model="item.external" type="checkbox">
								<label>External Link</label>
							</div>
							<button @click="deleteMenuItem(itemIndex)" class="accordion__action btn btn--red btn--small">X</button>
						</div>
						<div class="accordion__content">
							<div v-for="(subItem, subIndex) in item.children" :key="subIndex" class="inline-form">
								<input v-model.trim="subItem.name" type="text" placeholder="Menu Item Label">
								<input v-model.trim="subItem.href" type="text" placeholder="Menu Item Link">
								<button @click="deleteSubItem(itemIndex, subIndex)" class="btn btn--red btn--small">X</button>
							</div>
							<button @click="addSubItem(itemIndex)" class="btn btn--blue btn--small">Add child item</button>
						</div>
					</div>
				</div>
				<p v-else class="well well--large">
					Please add a menu items
				</p>
				<button @click="addMenuItem()" class="btn">Add Menu Item</button>
			</fieldset>

			<fieldset>
				<legend>Footer</legend>
				<div v-if="form.footer.length">
					<div v-for="(section, sectionIndex) in form.footer" :key="sectionIndex" class="accordion">
						<div class="accordion__title">
							<input v-model.trim="section.name" type="text" placeholder="Section Name">
							<button @click="deleteFooterSection(sectionIndex)" class="accordion__action btn btn--red btn--small">X</button>
						</div>
						<div class="accordion__content">
							<div v-for="(link, linkIndex) in section.children" :key="linkIndex" class="inline-form">
								<input v-model.trim="link.name" type="text" placeholder="Link Title">
								<input v-model.trim="link.href" type="text" placeholder="Link URL">
								<button @click="deleteFooterLink(sectionIndex, linkIndex)" class="btn btn--red btn--small">X</button>
							</div>
							<button @click="addFooterLink(sectionIndex)" class="btn btn--blue btn--small">Add Link</button>
						</div>
					</div>
				</div>
				<p v-else class="well well--large">
					Please add a section to the footer
				</p>
				<button @click="addFooterSection()" class="btn">Add Section</button>
			</fieldset>

			<fieldset>
				<legend>Supported Locales</legend>
				<div v-if="form.locations.length">
					<div v-for="(state, stateIndex) in form.locations" :key="stateIndex" class="accordion">
						<div class="accordion__title">
							<v-select
								v-model="state.meta"
								:options="states"
								:disabled="state.counties.length > 0"
								@input="getCounties(state)"
							></v-select>
							<button @click="deleteState(stateIndex)" class="accordion__action btn btn--red btn--small">X</button>
						</div>
						<div v-if="state.meta.label" class="accordion__content">
							<div v-if="state.counties.length">
								<div v-for="(county, countyIndex) in state.counties" :key="countyIndex">
									<div class="inline-form">
										<v-select
											v-model="county.name"
											:options="state.allCounties"
											:disabled="county.cities.length > 0"
											@input="getCities(state, county)"
										></v-select>
										<input v-model="county.phone" type="text" placeholder="Phone Number">
										<button @click="deleteCounty(stateIndex, countyIndex)" class="btn btn--red btn--small">X</button>
									</div>
									<ul class="nested">
										<li v-for="(city, cityIndex) in county.cities" :key="cityIndex">
											<input v-model="city.active" type="checkbox">
											<label>{{city.name}}</label>
										</li>
									</ul>
								</div>
							</div>
							<p v-else class="well well--large">
								No counties have been added for {{state.meta.label}}. Please add a County.
							</p>
							<button @click="addCounty(stateIndex)" class="btn btn--blue btn--small">Add County</button>
						</div>
					</div>
				</div>
				<p v-else class="well well--large">
					There are currently no supported states. Please add a state.
				</p>
				<button @click="addState()" class="btn">Add State</button>
			</fieldset>

			<div class="toolbar">
				<div class="actions">
					<router-link :to="{ name: 'Websites' }" class="btn">Back to Websites</router-link>
					<button @click="$emit('saveWebsite', form)" class="btn btn--blue">Save Website</button>
				</div>
			</div>

			<pre>{{form.locations}}</pre>

		</form>
	</div>
</template>

<script>
import 'vue-select/dist/vue-select.css'
import vSelect from 'vue-select'
import FileInput from '@/components/FileInput'
import Prompt from '@/components/Prompt'
import { validationMixin } from 'vuelidate'
import { required, url } from 'vuelidate/lib/validators';
import { websitesCollection } from '../firebase'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
	mixins: [
		validationMixin
	],
	components: {
		vSelect,
		FileInput,
		Prompt
	},
	data() {
		return {
			form: {
				id: '',
				created: '',
				updated: '',
				name: '',
				url: '',
				logo: '',
				color: '',
				secondaryColor: '',
				emails: '',
				phone: '',
				city: '',
				state: '',
				facebook: '',
				twitter: '',
				instagram: '',
				youtube: '',
				menu: [],
				footer: [],
				locations: []
			},
			loadingCities: false,
			states: [
				{
					label: "Alabama",
					code: "AL"
				},
				{
					label: "Alaska",
					code: "AK"
				},
				{
					label: "American Samoa",
					code: "AS"
				},
				{
					label: "Arizona",
					code: "AZ"
				},
				{
					label: "Arkansas",
					code: "AR"
				},
				{
					label: "California",
					code: "CA"
				},
				{
					label: "Colorado",
					code: "CO"
				},
				{
					label: "Connecticut",
					code: "CT"
				},
				{
					label: "Delaware",
					code: "DE"
				},
				{
					label: "District of Columbia",
					code: "DC"
				},
				{
					label: "Florida",
					code: "FL"
				},
				{
					label: "Georgia",
					code: "GA"
				},
				{
					label: "Guam",
					code: "GU"
				},
				{
					label: "Hawaii",
					code: "HI"
				},
				{
					label: "Idaho",
					code: "ID"
				},
				{
					label: "Illinois",
					code: "IL"
				},
				{
					label: "Indiana",
					code: "IN"
				},
				{
					label: "Iowa",
					code: "IA"
				},
				{
					label: "Kansas",
					code: "KS"
				},
				{
					label: "Kentucky",
					code: "KY"
				},
				{
					label: "Louisiana",
					code: "LA"
				},
				{
					label: "Maine",
					code: "ME"
				},
				{
					label: "Maryland",
					code: "MD"
				},
				{
					label: "Massachusetts",
					code: "MA"
				},
				{
					label: "Michigan",
					code: "MI"
				},
				{
					label: "Minnesota",
					code: "MN"
				},
				{
					label: "Mississippi",
					code: "MS"
				},
				{
					label: "Missouri",
					code: "MO"
				},
				{
					label: "Montana",
					code: "MT"
				},
				{
					label: "Nebraska",
					code: "NE"
				},
				{
					label: "Nevada",
					code: "NV"
				},
				{
					label: "New Hampshire",
					code: "NH"
				},
				{
					label: "New Jersey",
					code: "NJ"
				},
				{
					label: "New Mexico",
					code: "NM"
				},
				{
					label: "New York",
					code: "NY"
				},
				{
					label: "North Carolina",
					code: "NC"
				},
				{
					label: "North Dakota",
					code: "ND"
				},
				{
					label: "Northern Mariana Islands",
					code: "MP"
				},
				{
					label: "Ohio",
					code: "OH"
				},
				{
					label: "Oklahoma",
					code: "OK"
				},
				{
					label: "Oregon",
					code: "OR"
				},
				{
					label: "Palau",
					code: "PW"
				},
				{
					label: "Pennsylvania",
					code: "PA"
				},
				{
					label: "Puerto Rico",
					code: "PR"
				},
				{
					label: "Rhode Island",
					code: "RI"
				},
				{
					label: "South Carolina",
					code: "SC"
				},
				{
					label: "South Dakota",
					code: "SD"
				},
				{
					label: "Tennessee",
					code: "TN"
				},
				{
					label: "Texas",
					code: "TX"
				},
				{
					label: "Utah",
					code: "UT"
				},
				{
					label: "Vermont",
					code: "VT"
				},
				{
					label: "Virgin Islands",
					code: "VI"
				},
				{
					label: "Virginia",
					code: "VA"
				},
				{
					label: "Washington",
					code: "WA"
				},
				{
					label: "West Virginia",
					code: "WV"
				},
				{
					label: "Wisconsin",
					code: "WI"
				},
				{
					label: "Wyoming",
					code: "WY"
				}
			]
		}
	},
	validations: {
		form: {
			name: {
				required
			},
			url: {
				required,
				url
			},
			logo: {
				required
			},
			color: {
				required
			},
			emails: {
				required
			},
			phone: {
				required
			},
			city: {
				required
			},
			state: {
				required
			}
		}
	},
	computed: {
		...mapState(['userProfile']),
		canDelete() {
			if ( this.userProfile.group === 'admin' ) {
				return true
			} else {
				return false
			}
		}
	},
	props: {
		id: {
			type: String,
			required: false
		}
	},
	methods: {
		saveWebsite() {
			if (!this.$v.form.$invalid) {
				this.$emit('saveWebsite', this.form)
			}
		},
		addMenuItem() {
			let item = {
				name: '',
				href: '',
				external: false,
				children: []
			}
			this.form.menu.push(item);
		},
		deleteMenuItem(index) {
			this.form.menu.splice(index, 1);
		},
		addSubItem(itemIndex) {
			let item = {
				name: '',
				href: ''
			}
			this.form.menu[itemIndex].children.push(item)
		},
		deleteSubItem(itemIndex, subIndex) {
			this.form.menu[itemIndex].children.splice(subIndex, 1)
		},
		addFooterSection() {
			let section = {
				name: '',
				children: []
			}
			this.form.footer.push(section)
		},
		deleteFooterSection(index) {
			this.form.footer.splice(index, 1)
		},
		addFooterLink(sectionIndex) {
			let link = {
				name: '',
				href: ''
			}
			this.form.footer[sectionIndex].children.push(link)
		},
		deleteFooterLink(sectionIndex, linkIndex) {
			this.form.footer[sectionIndex].children.splice(linkIndex, 1)
		},
		deleteWebsite() {
			this.$store.dispatch('deleteWebsite', this.form.id)
		},
		addState() {
			let state = {
				meta: '',
				allCounties: [],
				counties: []
			}
			this.form.locations.push(state)
		},
		deleteState(stateIndex) {
			this.form.locations.splice(stateIndex, 1)
		},
		getCounties(state) {
			axios
				.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-county-boundaries&fields=name&sort=name&rows=300&refine.state_name='+state.meta.label)
				.then(response => (
					response.data.records.forEach(record => state.allCounties.push(
						record.fields.name
					))
				))
		},
		addCounty(stateIndex) {
			let county = {
				name: '',
				phone: '',
				cities: []
			}
			this.form.locations[stateIndex].counties.push(county)
		},
		deleteCounty(stateIndex, countyIndex) {
			this.form.locations[stateIndex].counties.splice(countyIndex, 1)
		},
		getCities(state, county) {
			axios
				.get('https://public.opendatasoft.com/api/records/1.0/search/?dataset=cities-and-towns-of-the-united-states&fields=name,latitude,longitude&rows=1000&refine.state='+state.meta.code+'&refine.county='+county.name)
				.then(response => (
					response.data.records.forEach(function(record) {
						axios
							.get('https://data.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude%40public&q=&facet=state&facet=city&refine.state='+state.meta.code+'&refine.city='+record.fields.name)
							.then(function(response) {
								let zip = response.data.records[0].fields.zip
								county.cities.push(
									{
										name: record.fields.name,
										coords: [record.fields.latitude, record.fields.longitude],
										zip: zip,
										active: true
									}
								)
							})
					})
				))
		},
		setLogoPath(logo) {
			this.form.logo = logo
		},
		removeLogo() {
			this.form.logo = null
		}
	},
	mounted: async function() {
		// If this.id is set, we are editing an existing website.
		if (this.id) {
			let website = await websitesCollection.doc(this.id).get();
			Object.assign(this.form, website.data())
			this.form.id = this.id
		}
	}
}
</script>

<style lang="scss" scoped>

</style>