import app from './config.js';
import {browserSessionPersistence, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut} from "firebase/auth"
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const auth = getAuth(app)
const db = getFirestore(app)

const createAccountForm = document.getElementById("createAccount")

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        localStorage.setItem('userId', uid);
        console.log(uid)
        console.log("Signed IN onAuthState")
    } else {
        console.log("Signed OUT onAuthState")
        localStorage.removeItem('userId');
    }
})

createAccountForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("signUpName").value;
    const email = document.getElementById("signUpEmail").value;
    const pass = document.getElementById("signUpPassword").value;

    try {
        await setPersistence(auth, browserSessionPersistence);
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;
        console.log(user);
        console.log(user.uid);
        await addDoc(collection(db, 'Customers'), {
            name: name,
            email: email,
            createdAt: new Date(),
            balance: 1000, 
            ticketCount: 0  
        });

        alert("Account created and customer added to database!");
        location.reload(); 
    } catch (e) {
        console.error("Error creating account or adding customer:", e);
        alert("Failed to create account or add customer.");
    }
});
  

const signInForm = document.getElementById("signIn")
signInForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    
    const email = document.getElementById("signInEmail").value;
    const pass = document.getElementById("signInPassword").value;

    setPersistence(auth, browserSessionPersistence)
    .then(() => {
        signInWithEmailAndPassword(auth, email, pass)
        .then((user) => {
            console.log(user.displayName);
            console.log("Signed In With Created user");
            window.location.href = 'index.html';
        }).catch((e) => {
            console.log(e);
        });
    })
    .catch((e) =>{
        console.log("Persistence error:", e);
    });
});


const signOutUserForm = document.querySelector("#signOut")
signOutUserForm.addEventListener("submit", (event) => {
    event.preventDefault()
    signOut(auth).then(() => {
        console.log("Signed Out")
    }).catch((error) => {
    })
})

