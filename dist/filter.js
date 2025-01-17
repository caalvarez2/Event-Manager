import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBxQrigYRQ4Fj3G9r2nUA7k54dBo0kcKsg",
  authDomain: "event-manager-11130.firebaseapp.com",
  projectId: "event-manager-11130",
  storageBucket: "event-manager-11130.appspot.com",
  messagingSenderId: "315869204176",
  appId: "1:315869204176:web:87b236d07bdd316de318d5",
  measurementId: "G-DMGP180X0N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const eventsContainer = document.querySelector('.event-cards');
const loadingIndicator = document.getElementById('loading');

document.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth(app);
  const myAccountButton = document.getElementById("myAccountButton");
  const signInButton = document.getElementById("signInButton");

  onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
          console.log("User is signed in:", currentUser.uid);
          myAccountButton.style.display = "inline-block"; 
          signInButton.style.display = "none";
      } else {
          console.log("No user signed in.");
          myAccountButton.style.display = "none"; 
      }
  });
});

function showLoading() {
  loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
  loadingIndicator.classList.add('hidden');
}

async function populateFilters() {
  const eventTypeSelect = document.getElementById('event-type');
  const locationSelect = document.getElementById('location');

  const uniqueTypes = new Set();
  const uniqueLocations = new Set();

  const querySnapshot = await getDocs(collection(db, "Events"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    uniqueTypes.add(data.type);
    uniqueLocations.add(data.location);
  });

  uniqueTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    eventTypeSelect.appendChild(option);
  });

  uniqueLocations.forEach(location => {
    const option = document.createElement('option');
    option.value = location;
    option.textContent = location;
    locationSelect.appendChild(option);
  });
}

function createEventCard(eventData, eventId) {
  const card = document.createElement('div');
  card.classList.add('event-card');

  const title = document.createElement('h3');
  title.textContent = eventData.title || "Untitled Event";
  card.appendChild(title);

  const details = ['artist', 'date', 'time', 'location', 'type'];
  details.forEach(detail => {
    const p = document.createElement('p');
    p.textContent = `${detail.charAt(0).toUpperCase() + detail.slice(1)}: ${eventData[detail] || "N/A"}`;
    card.appendChild(p);
  });

  const cartButton = document.createElement('button');
  cartButton.textContent = 'View Tickets';
  cartButton.classList.add('select-button');

  cartButton.onclick = () => {
    const auth = getAuth(app);
    const currentUser = auth.currentUser;

    if (currentUser) {
      window.location.href = `seating.html?eventId=${eventId}`;
    } else {
      alert("You must create an account or log in to purchase tickets.");
      window.location.href = "login.html"; 
    }
  };

  card.appendChild(cartButton);
  return card;
}

document.getElementById('apply-filters-button').addEventListener('click', fetchAndRenderEvents);

async function fetchAndRenderEvents() {
  showLoading();
  eventsContainer.innerHTML = '';

  const eventType = document.getElementById('event-type').value;
  const location = document.getElementById('location').value;
  const eventDate = document.getElementById('event-date').value;

  try {
    const querySnapshot = await getDocs(collection(db, "Events"));
    let filteredEvents = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const eventId = doc.id;

      const matchesType = !eventType || data.type === eventType;
      const matchesLocation = !location || data.location === location;
      const matchesDate = !eventDate || data.date === eventDate;

      if (matchesType && matchesLocation && matchesDate) {
        filteredEvents.push({data, eventId});
      }
    });

    if (filteredEvents.length === 0) {
      eventsContainer.innerHTML = '<p>No events found for the selected filters.</p>';
    } else {
      filteredEvents.forEach(({data, eventId}) => {
        const eventCard = createEventCard(data, eventId);
        eventsContainer.appendChild(eventCard);
      });
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    eventsContainer.innerHTML = '<p>Failed to load events. Please try again later.</p>';
  }

  hideLoading();
}

populateFilters();
fetchAndRenderEvents();
