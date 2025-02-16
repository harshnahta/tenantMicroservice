import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyCt7hb-Q1bZzytJPtM5y-ObPUFcaMMU-Zw',
  authDomain: 'zonezapper-91594.firebaseapp.com',
  projectId: 'zonezapper-91594',
  storageBucket: 'zonezapper-91594.appspot.com',
  messagingSenderId: '145808341848',
  appId: '1:145808341848:web:7409bf25fda57caf0b832d',
  measurementId: 'G-EYVHJEX4EK',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
