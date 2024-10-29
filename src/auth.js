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
    event.preventDefault();

    const name = document.getElementById("signUpName").value;
    const email = document.getElementById("signUpEmail").value;
    const pass = document.getElementById("signUpPassword").value;

    setPersistence(auth, browserSessionPersistence)
    .then(()=>{
        createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential)=>{
            const user = userCredential.user;
            console.log(user);
            console.log(user.uid);
            location.reload();
        })
    })
    .catch((e)=>{
        console.log(e);
    });
});

const signInForm = document.getElementById("signIn")

signInForm.addEventListener("submit", (event)=>{
    event.preventDefault();

    const email = document.getElementById("signInEmail").value;
    const pass = document.getElementById("signInPassword").value;

    setPersistence(auth, browserSessionPersistence)
    .then(() => {
        signInWithEmailAndPassword(auth, email, pass)
        .then((user)=>{
            console.log(user.displayName);
            console.log("Signed In With Created user");
            console.log(auth);
            console.log('redirected');
            window.location.href = 'index.html'
        }).catch((e)=>{
            console.log(e);
        });
    })
    .catch((e) =>{
        console.log("Persistence error 2", e);
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

const createAccountLink = document.getElementById('createAccountLink')
createAccountLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signIn').style.display = 'none';
    document.getElementById('createAccount').style.display = 'block';
});

document.getElementById('signInLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signIn').style.display = 'block';
    document.getElementById('createAccount').style.display = 'none';
});

