import app from './config.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, updateDoc, arrayUnion, increment, getDoc } from "firebase/firestore";

const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("eventId"); // Event ID from the URL
    const seats = urlParams.get("seats") ? urlParams.get("seats").split(",") : [];
    const totalPrice = urlParams.get("totalPrice") ? parseFloat(urlParams.get("totalPrice")).toFixed(2) : "0.00";

    const seatsList = document.getElementById("seats-list");
    if (seats.length > 0) {
        seats.forEach((seat) => {
            const listItem = document.createElement("li");
            listItem.textContent = seat;
            seatsList.appendChild(listItem);
        });
    } else {
        seatsList.innerHTML = "<p>No seats selected.</p>";
    }

    const taxRate = 0.0825;
    const priceWithTax = (totalPrice * (1 + taxRate)).toFixed(2);
    document.getElementById("price").textContent = `$${priceWithTax} (includes tax)`;

    const paymentForm = document.getElementById("payment-form");
    paymentForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        // Simple validation
        if (!/^\d{16}$/.test(cardNumber)) {
            alert("Please enter a valid 16-digit card number.");
            return;
        }
        const [month, year] = expiryDate.split("/");
        if (!month || !year || parseInt(year) < 24 || (parseInt(year) === 24 && parseInt(month) < 12)) {
            alert("Please enter a valid expiration date (must be after 12/2024).");
            return;
        }
        if (!/^\d{3}$/.test(cvv)) {
            alert("Please enter a valid 3-digit CVV.");
            return;
        }

        // Proceed to update Firestore
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, "Customers", user.uid); // Reference to the user's document
                try {
                    // Update Firestore: Add the eventId to purchases and increment ticketCount
                    await updateDoc(userRef, {
                        purchases: arrayUnion(eventId), // Add eventId to purchases array
                        ticketCount: increment(seats.length), // Increment ticketCount by the number of seats
                    });
                    await updateSeatMap(eventId, seats);
                    alert("Thank you for your purchase! Your tickets have been updated.");
                    window.location.href = "index.html"; // Redirect to the index page
                } catch (error) {
                    console.error("Error updating Firestore:", error);
                    alert("Something went wrong while updating your tickets. Please try again.");
                }
            } else {
                alert("No user is signed in. Please sign in to complete the purchase.");
            }
        });
    });
});

// Update occupied seats in firebase
const updateSeatMap = async (eventId, purchasedSeats) => {
    const eventRef = doc(db, "Events", eventId);

    try {
        const eventDoc = await getDoc(eventRef);
        if (eventDoc.exists()) {
            const seatMap = eventDoc.data().seatMap;
            seatMap.forEach(row => {
                row.seats.forEach(seat => {
                    if (purchasedSeats.includes(seat.number)) {
                        seat.occupied = 1;
                    }
                });
            });
            await updateDoc(eventRef, { seatMap });
            console.log("Seat map updated successfully.");
        } else {
            console.error("Event not found.");
        }
    } catch (error) {
        console.error("Error updating seat map:", error);
    }
};

const backButton = document.getElementById("backButton");

backButton.addEventListener("click", (event) => {
    window.location.href = "index.html";
});
