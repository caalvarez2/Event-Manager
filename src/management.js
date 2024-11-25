import app from './config.js';
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

const db = getFirestore();

const addEventForm = document.getElementById("addEventForm");
const cancelEventForm = document.getElementById("cancelEventForm");
const updateEventForm = document.getElementById("updateEventForm");


addEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
 
    const title = addEventForm.title.value;
    const artist = addEventForm['artist/s'].value;
    const location = addEventForm.location.value;
    const date = addEventForm.date.value;
    const time = addEventForm.time.value;
    const type = addEventForm.type.value;
    const vipPrice = parseFloat(addEventForm.vip_price.value);
    const silverPrice = parseFloat(addEventForm.silver_price.value);
    const bronzePrice = parseFloat(addEventForm.bronze_price.value);
 
    if (isNaN(vipPrice) || isNaN(silverPrice) || isNaN(bronzePrice)) {
        alert('Please enter valid prices for VIP, Silver, and Bronze seats.');
        return;
    }
 
    let seatMap = [];
    const rows = 17;
    const seatsPerRow = 23;
 
    for (let charCode = 'A'.charCodeAt(0); charCode < 'A'.charCodeAt(0) + rows; charCode++) {
        let row = {
            row: String.fromCharCode(charCode),
            seats: Array.from({ length: seatsPerRow }, (_, i) => ({
                number: `${String.fromCharCode(charCode)}${i + 1}`,
                occupied: 0 
            }))
        };
        seatMap.push(row);
    }
 
    try {
        await addDoc(collection(db, 'Events'), {
            title,
            artist,
            location,
            date,
            time,
            type,
            vipPrice,
            silverPrice,
            bronzePrice,
            seatMap
        });
        addEventForm.reset();
        alert('Event added successfully!');
    } catch (error) {
        console.error("Error adding event: ", error);
        alert('Failed to add event.');
    }
});

cancelEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const eventName = cancelEventForm.event_name.value;

    try {
        const eventsCollection = collection(db, 'Events');
        const q = query(eventsCollection, where("title", "==", eventName));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert('No event found with the given name.');
            return;
        }

        const eventDoc = querySnapshot.docs[0];
        const eventId = eventDoc.id;
        const eventData = eventDoc.data();

        const customersCollection = collection(db, 'Customers');
        const customersSnapshot = await getDocs(customersCollection);

        for (const customerDoc of customersSnapshot.docs) {
            const customerData = customerDoc.data();
            const purchases = customerData.purchases || [];
            const ticketCount = customerData.ticketCount || 0;

            if (purchases.includes(eventId)) {
                let ticketsToRefund = 0;
                eventData.seatMap.forEach(row => {
                    row.seats.forEach(seat => {
                        if (seat.occupied === 1) {
                            ticketsToRefund += 1;
                        }
                    });
                });

                const ticketPrice = 5;
                const refundAmount = ticketsToRefund * ticketPrice;

                // Update the customer's purchases, balance, and ticketCount
                const updatedPurchases = purchases.filter(purchase => purchase !== eventId);
                const newBalance = customerData.balance + refundAmount;
                const newTicketCount = ticketCount - ticketsToRefund;

                await updateDoc(doc(db, 'Customers', customerDoc.id), {
                    purchases: updatedPurchases,
                    balance: newBalance,
                    ticketCount: newTicketCount
                });
            }
        }

        await deleteDoc(doc(db, 'Events', eventId));

        cancelEventForm.reset();
        alert(`Event "${eventName}" canceled successfully and refunds processed!`);
    } catch (error) {
        console.error("Error canceling event: ", error);
        alert('Failed to cancel event.');
    }
});

updateEventForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventName = updateEventForm.event_name.value;
    const newDate = updateEventForm.date.value;
    const newTime = updateEventForm.time.value;
    console.log("Update event name: ", eventName);
 
    try {
        const eventsCollection = collection(db, 'Events');
        const q = query(eventsCollection, where("title", "==", eventName));
        const querySnapshot = await getDocs(q);
 
        if (querySnapshot.empty) {
            alert("No event found with the given name.");
            return;
        }

        const eventDoc = querySnapshot.docs[0];
        const eventRef = doc(db, 'Events', eventDoc.id);
 
        await updateDoc(eventRef, {
            date: newDate,
            time: newTime
        });
 
        alert('Event updated successfully!');
    } catch (error) {
        console.error("Error updating event: ", error);
        alert('Failed to update event. Please check the event name.');
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
      console.log(e)
    })
});