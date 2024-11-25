import app from './config.js';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', function () {
    const auth = getAuth(app);
    const db = getFirestore(app);

    onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
            // Fetch the document from Firestore using the user's UID
            const userDocRef = doc(db, "Customers", currentUser.uid);
            console.log("here")
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();

                    // Check if purchases exist and handle them
                    if (userData.purchases && userData.purchases.length > 0) {
                        console.log("User's purchase history:", userData.purchases);
                        await displayPurchaseHistory(userData.purchases);
                    } else {
                        document.getElementById("payment-history").innerHTML =
                            "<p>No purchase history available.</p>";
                    }
                } else {
                    console.log("No document found for the current user in Customers collection.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            console.log("No user is signed in.");
        }
    });

    // Function to display purchase history
    async function displayPurchaseHistory(purchases) {
        console.log("Displaying purchase history:", purchases);
        const ticketContainer = document.querySelector(".ticket-container");

        if (!ticketContainer) {
            console.error("Ticket container not found in the DOM");
            return;
        }

        ticketContainer.innerHTML = ""; // Clear existing tickets

        if (purchases.length === 0) {
            ticketContainer.innerHTML = "<p>No purchase history available.</p>";
            return;
        }

        for (const eventId of purchases) {
            const eventData = await fetchEventData(eventId);
            if (eventData) {
                const ticket = createTicketElement(eventData);
                ticketContainer.appendChild(ticket);
            }
        }
    }

    // Function to fetch event data based on event ID
    async function fetchEventData(eventId) {
        try {
            const docRef = doc(db, "Events", eventId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                return {
                    id: docSnapshot.id,
                    ...docSnapshot.data(),
                };
            } else {
                console.log(`Event with ID ${eventId} not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error fetching event data:", error);
            return null;
        }
    }

    // Function to create a ticket element for the DOM
    function createTicketElement(eventData) {
        const ticket = document.createElement("div");
        ticket.classList.add("ticket");

        const ticketHeader = document.createElement("div");
        ticketHeader.classList.add("ticket-header");

        const eventName = document.createElement("span");
        eventName.classList.add("event-title");
        eventName.textContent = eventData.title || "Untitled Event";
        ticketHeader.appendChild(eventName);

        const locationName = document.createElement("span");
        locationName.classList.add("location-name");
        locationName.textContent = eventData.location || "Unknown Location";
        ticketHeader.appendChild(locationName);

        ticket.appendChild(ticketHeader);

        const ticketBody = document.createElement("div");
        ticketBody.classList.add("ticket-body");

        const ticketInfo = document.createElement("div");
        ticketInfo.classList.add("ticket-info");
        ticketInfo.innerHTML = `
            <span>Artist: ${eventData.artist || "N/A"}</span>
            <br>
            <span>Date: ${eventData.date || "N/A"}</span>
        `;
        ticketBody.appendChild(ticketInfo);

        const qrContainer = document.createElement("canvas");
        qrContainer.classList.add("qr-code");
        ticketBody.appendChild(qrContainer);

        new QRious({
            element: qrContainer,
            background: "#007AFF",
            backgroundAlpha: 1,
            foreground: "#080F28",
            foregroundAlpha: 1,
            level: "H",
            padding: 0,
            size: 99,
            value: `Ticket ID: ${eventData.id}`,
        });

        console.log("QRious:", QRious);

        ticket.appendChild(ticketBody);

        return ticket;
    }
});

const signOutButton = document.getElementById("signOut");

signOutButton.addEventListener("click", (event) => {
    const auth = getAuth(app);
    event.preventDefault()

    signOut(auth)
    .then(() => {
      console.log("Signed Out")
      window.location.href = "index.html";
    }).catch((e) => {
      // Error signing out
      console.log(e)
    })
});

const backButton = document.getElementById("backButton");

backButton.addEventListener("click", (event) => {
    window.location.href = "index.html"
})

const firstTab = document.querySelector('.profile-nav .nav-link');
firstTab.click();