//DATABASE
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAryoh-bO90naehPlcOwsahHDIBVHJ_pSM",
    authDomain: "wellnessapp-reactnative.firebaseapp.com",
    projectId: "wellnessapp-reactnative",
    storageBucket: "wellnessapp-reactnative.firebasestorage.app",
    messagingSenderId: "940653385662",
    appId: "1:940653385662:web:9d79c5c9993c54944d4bef",
    measurementId: "G-4JBXCYTR5C",
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export { db }; // Export db so you can use it anywhere