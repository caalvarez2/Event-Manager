import app from './config.js';
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, getDocs, query, where } from "firebase/firestore";

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
                occupied: 0  // Initialize all seats as unoccupied
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
        await deleteDoc(doc(db, 'Events', eventDoc.id));

        cancelEventForm.reset();
        alert(`Event "${eventName}" canceled successfully!`);
    } catch (error) {
        console.error("Error canceling event: ", error);
        alert('Failed to cancel event.');
    }
});

updateEventForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const eventId = updateEventForm.event_id.value;
    const newDate = updateEventForm.date.value;
    const newTime = updateEventForm.time.value;
    console.log("Update event ID: ", eventId);

    const eventRef = doc(db, 'Events', eventId);
    try {
        await updateDoc(eventRef, {
            date: newDate,
            time: newTime
        });
        alert('Event updated successfully!');
    } catch (error) {
        console.error("Error updating event: ", error);
        alert('Failed to update event. Please check the event ID.');
    }
});