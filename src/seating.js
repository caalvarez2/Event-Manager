const totalRows = 17;
const totalCols = 23;
const seatSpacing = 35;
let selectedSeats = [];
let occupiedSeats = [];
let vipPrice = 0;
let silverPrice = 0;
let bronzePrice = 0;
const vipSeats = [
    'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'E14', 'E15', 'E16', 'E17', 'E18',
    'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18',
    'G6', 'G7', 'G17', 'G18',
    'H6', 'H7', 'H17', 'H18',
    'I6', 'I7', 'I17', 'I18',
    'J6', 'J7', 'J17', 'J18',
    'K6', 'K7', 'K17', 'K18',
    'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16', 'L17', 'L18',
    'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13', 'M14', 'M15', 'M16', 'M17', 'M18'
];
const silverSeats = [
    'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14', 'C15', 'C16', 'C17', 'C18', 'C19', 'C20',
    'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16', 'D17', 'D18', 'D19', 'D20',
    'E4', 'E5', 'E19', 'E20', 'F4', 'F5', 'F19', 'F20', 'G4', 'G5', 'G19', 'G20', 'H4', 'H5', 'H19', 'H20',
    'I4', 'I5', 'I19', 'I20', 'J4', 'J5', 'J19', 'J20', 'K4', 'K5', 'K19', 'K20', 'L4', 'L5', 'L19', 'L20',
    'M4', 'M5', 'M19', 'M20', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', 'N11', 'N12', 'N13', 'N14', 'N15',
    'N16', 'N17', 'N18', 'N19', 'N20', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11', 'O12', 'O13', 'O14',
    'O15', 'O16', 'O17', 'O18', 'O19', 'O20'
];
const bronzeSeats = [
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 
    'A19', 'A20', 'A21', 'A22', 'A23', 
    'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 
    'B19', 'B20', 'B21', 'B22', 'B23', 
    'C1', 'C2', 'C3', 'C21', 'C22', 'C23', 
    'D1', 'D2', 'D3', 'D21', 'D22', 'D23', 
    'E1', 'E2', 'E3', 'E21', 'E22', 'E23', 
    'F1', 'F2', 'F3', 'F21', 'F22', 'F23', 
    'G1', 'G2', 'G3', 'G21', 'G22', 'G23', 
    'H1', 'H2', 'H3', 'H21', 'H22', 'H23', 
    'I1', 'I2', 'I3', 'I21', 'I22', 'I23', 
    'J1', 'J2', 'J3', 'J21', 'J22', 'J23', 
    'K1', 'K2', 'K3', 'K21', 'K22', 'K23', 
    'L1', 'L2', 'L3', 'L21', 'L22', 'L23', 
    'M1', 'M2', 'M3', 'M21', 'M22', 'M23', 
    'N1', 'N2', 'N3', 'N21', 'N22', 'N23', 
    'O1', 'O2', 'O3', 'O21', 'O22', 'O23', 
    'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16', 'P17', 'P18', 
    'P19', 'P20', 'P21', 'P22', 'P23', 
    'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12', 'Q13', 'Q14', 'Q15', 'Q16', 'Q17', 'Q18', 
    'Q19', 'Q20', 'Q21', 'Q22', 'Q23'
];


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
