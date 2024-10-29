const totalRows = 17;
const totalCols = 23;
const seatSpacing = 35;
let selectedSeats = [];
let occupiedSeats = [];

// Creating seats
function createSeats() {
    const stadiumContainer = document.querySelector('.stadium-container');
    const performanceArea = document.querySelector('.performance-area');
    const performanceAreaTop = performanceArea.offsetTop;
    const performanceAreaLeft = performanceArea.offsetLeft;
    const performanceAreaWidth = performanceArea.offsetWidth;
    const performanceAreaHeight = performanceArea.offsetHeight;

    // Generate seats 
    for (let row = 0; row < totalRows; row++) {
        const rowLabel = String.fromCharCode(65 + row);

        for (let col = 0; col < totalCols; col++) {
            const seatLabel = `${rowLabel}${col + 1}`;
            const seat = createSeatElement(seatLabel);

            const topPosition = row * seatSpacing;
            const leftPosition = col * seatSpacing;

            // Skip seats that will be in performance area
            if (
                topPosition >= performanceAreaTop &&
                topPosition < performanceAreaTop + performanceAreaHeight &&
                leftPosition >= performanceAreaLeft &&
                leftPosition < performanceAreaLeft + performanceAreaWidth
            ) {
                continue;
            }
            if (
                (rowLabel === 'G' || rowLabel === 'H' || rowLabel === 'I' || rowLabel === 'J' || rowLabel === 'K') &&
                (col + 1 >= 8 && col + 1 <= 16)
            ) {
                continue;
            }
            seat.style.top = `${topPosition}px`;
            seat.style.left = `${leftPosition}px`;
            stadiumContainer.appendChild(seat);
        }
    }
}

function createSeatElement(label) {
    const seatElement = document.createElement('div');
    seatElement.classList.add('seat');
    seatElement.textContent = label;

    seatElement.addEventListener('click', () => toggleSeatSelection(label, seatElement));

    return seatElement;
}

// Select Seats
function toggleSeatSelection(label, seatElement) {
    if (seatElement.classList.contains('selected')) {
        seatElement.classList.remove('selected');
        selectedSeats = selectedSeats.filter(seat => seat !== label);
    } else if (!seatElement.classList.contains('occupied')) {
        seatElement.classList.add('selected');
        selectedSeats.push(label);
    }
}

// Add selected tickets to the list of the 'cart'
function updateSelectedSeatsList() {
    const selectedSeatsList = document.getElementById('selectedSeatsList');
    selectedSeatsList.innerHTML = '';

    occupiedSeats.forEach(seat => {
        const listItem = document.createElement('li');
        listItem.textContent = seat;
        selectedSeatsList.appendChild(listItem);
    });
}

// Move the selected seats to the cart and mark them occupied
function addToCart() {
    selectedSeats.forEach(seatLabel => {
        document.querySelectorAll('.seat').forEach(seatElement => {
            if (seatElement.textContent === seatLabel) {
                seatElement.classList.remove('selected');
                seatElement.classList.add('occupied');
            }
        });
        if (!occupiedSeats.includes(seatLabel)) {
            occupiedSeats.push(seatLabel);
        }
    });
    localStorage.setItem('selectedSeats', JSON.stringify(occupiedSeats));
    selectedSeats = []; 
    updateSelectedSeatsList();
}

// Reset seat selection
function resetSelection() {
    selectedSeats = [];
    document.querySelectorAll('.seat.selected').forEach(seat => seat.classList.remove('selected'));
    updateSelectedSeatsList(); 
}

document.addEventListener('DOMContentLoaded', () => {
    createSeats();
    document.getElementById('resetSelection').addEventListener('click', resetSelection);
    document.getElementById('addToCart').addEventListener('click', addToCart);
});