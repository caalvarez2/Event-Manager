import app from './config.js';
import { browserSessionPersistence, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        localStorage.setItem('userId', uid);
        console.log("User UID:", uid);
        console.log("Signed IN onAuthState");
    } else {
        console.log("Signed OUT onAuthState");
        localStorage.removeItem('userId');
    }
});

// Handle account creation
const createAccountForm = document.getElementById("createAccountForm");
createAccountForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("signUpName").value;
    const email = document.getElementById("signUpEmail").value;
    const password = document.getElementById("signUpPassword").value;
    const role = document.getElementById("accountRole").value; // Customer or Manager

    try {
        await setPersistence(auth, browserSessionPersistence);

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User created:", user.uid);

        let userData;
        if (role === "manager") {
            userData = {
                email: email,
            };
            await setDoc(doc(db, "Managers", user.uid), userData);
        } else {
            userData = {
                name: name,
                email: email,
                balance: 1000, 
                ticketCount: 0,
                purchases: [], 
                createdAt: new Date()
            };
            await setDoc(doc(db, "Customers", user.uid), userData);
        }

        alert(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully!`);
        location.reload(); 
    } catch (error) {
        console.error("Error creating account:", error);
        alert("Failed to create account. Please try again.");
    }
});

// Handle sign-in
const signInForm = document.getElementById("signIn");

signInForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("signInEmail").value;
    const password = document.getElementById("signInPassword").value;

    try {
        await setPersistence(auth, browserSessionPersistence);

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("User signed in:", user.uid);

        const customerDoc = await getDoc(doc(db, "Customers", user.uid));
        const managerDoc = await getDoc(doc(db, "Managers", user.uid));

        if (customerDoc.exists()) {
            console.log("User is a customer");
            window.location.href = "index.html"; 
        } else if (managerDoc.exists()) {
            console.log("User is a manager");
            window.location.href = "management.html"; 
        } else {
            console.error("User not found in Customers or Managers collection");
            alert("User account not found. Please contact support.");
        }
    } catch (error) {
        console.error("Error signing in:", error);
        alert("Failed to sign in. Please check your email and password.");
    }
});


// Sign out
const signOutForm = document.getElementById("signOut")

signOutButton.addEventListener("submit", (event) => {
    event.preventDefault()

    signOut(auth)
    .then(() => {
      console.log("Signed Out")
      window.location.href = "index.html";
    }).catch((e) => {
      // Error signing out
      console.log(e)
    })
}) 

const signOutButton = document.getElementById("signOut");

signOutButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Button click detected");
    alert("Button works!");
});

