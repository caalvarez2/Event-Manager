import app from './config.js';
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";

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

    try {
        await addDoc(collection(db, 'Events'), {
            title,
            artist,
            location,
            date,
            time,
            type
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

    const eventId = cancelEventForm.event_id.value;
    try {
        await deleteDoc(doc(db, 'Events', eventId));
        cancelEventForm.reset();
        alert('Event canceled successfully!');
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