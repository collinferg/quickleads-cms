import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// firebase init = add your own config here
const firebaseConfig = {
	apiKey: '',
	authDomain: '',
	databaseURL: '',
	projectId: '',
	storageBucket: '',
	messagingSenderId: '',
	appId: ''
}

firebase.default.initializeApp(firebaseConfig)

// utils
const db = firebase.default.firestore()
const auth = firebase.default.auth()
const storage = firebase.default.storage()

// collection references
const usersCollection = db.collection('users');
const websitesCollection = db.collection('websites');
const pagesCollection = db.collection('pages');
const formsCollection = db.collection('forms');

export {
	db,
	auth,
	storage,
	usersCollection,
	websitesCollection,
	pagesCollection,
	formsCollection
}