import app from './config.js';
import {browserSessionPersistence, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut} from "firebase/auth"


const auth = getAuth(app)

const createAccountForm = document.getElementById("createAccount")

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid)
        console.log("Signed IN onAuthState")
    } else {
        console.log("Signed OUT onAuthState")
    }
})

createAccountForm.addEventListener("submit", (event) =>{
    event.preventDefault()

    const name = createAccountForm.name.value
    const email = createAccountForm.email.value
    const pass = createAccountForm.password.value
    
    setPersistence(auth, browserSessionPersistence)
    .then(()=>{
        createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential)=>{
            const user = userCredential.user
            console.log(user)
            console.log(user.uid)
            location.reload()
        })
    })
    .catch((e)=>{
        console.log(e)
    })
})

const signInForm = document.getElementById("signIn")
signInForm.addEventListener("submit", (event)=>{
    event.preventDefault()
    setPersistence(auth, browserSessionPersistence)
    .then(() => {

        const email = signInForm.email.value
        const pass = signInForm.password.value
        console.log(email)
        console.log(pass)
        signInWithEmailAndPassword(auth,email,pass)
        .then((user)=>{
            console.log(user.displayName)
            console.log("Signed In With Created user")
            console.log(auth)
            window.location.href = './dist/management.html';
            console.log('redirected')
        }).catch((e)=>{
            console.log(e)
        })
    })
    .catch((e) =>{
        console.log("Persistence error 2")
    })
})


const signOutUserForm = document.querySelector("#signOut")
signOutUserForm.addEventListener("submit", (event) => {
    event.preventDefault()
    signOut(auth).then(() => {
        console.log("Signed Out")
    }).catch((error) => {
    })
})


