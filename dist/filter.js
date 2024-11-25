import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
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
const cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  const auth = getAuth(app);
  const myAccountButton = document.getElementById("myAccountButton");
  const signInButton = document.getElementById("signInButton");

  // Check authentication state
  onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
          // User is signed in - ensure the "My Account" button is visible
          console.log("User is signed in:", currentUser.uid);
          myAccountButton.style.display = "inline-block"; // Show the button
          signInButton.style.display = "none";
      } else {
          // User is not signed in - hide the "My Account" button
          console.log("No user signed in.");
          myAccountButton.style.display = "none"; // Hide the button
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

  try {
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
  } catch (error) {
    console.error("Error populating filters:", error);
  }
}

function addToCart(eventData) {
  cart.push(eventData);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Event added to cart!");
}

document.getElementById('view-cart').addEventListener('click', () => {
  window.location.href = 'checkout.html';
});

function createEventCard(eventData) {
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
    addToCart(eventData);
    window.location.href = "seating.html";
  };

  card.appendChild(cartButton);
  return card;
}

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

      const matchesType = !eventType || data.type === eventType;
      const matchesLocation = !location || data.location === location;
      const matchesDate = !eventDate || data.date === eventDate;

      if (matchesType && matchesLocation && matchesDate) {
        filteredEvents.push(data);
      }
    });

    if (filteredEvents.length === 0) {
      eventsContainer.innerHTML = '<p>No events found for the selected filters.</p>';
    } else {
      filteredEvents.forEach((eventData) => {
        const eventCard = createEventCard(eventData);
        eventsContainer.appendChild(eventCard);
      });
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    eventsContainer.innerHTML = '<p>Failed to load events. Please try again later.</p>';
  }

  hideLoading();
}

window.fetchAndRenderEvents = fetchAndRenderEvents;

populateFilters();
fetchAndRenderEvents();