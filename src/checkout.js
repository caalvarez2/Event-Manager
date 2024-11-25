document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);

    const seats = urlParams.get('seats') ? urlParams.get('seats').split(',') : [];
    const totalPrice = urlParams.get('totalPrice') ? parseFloat(urlParams.get('totalPrice')).toFixed(2) : '0.00';

    const seatsList = document.getElementById('seats-list');
    if (seats.length > 0) {
        seats.forEach(seat => {
            const listItem = document.createElement('li');
            listItem.textContent = seat;
            seatsList.appendChild(listItem);
        });
    } else {
        seatsList.innerHTML = '<p>No seats selected.</p>';
    }

    const taxRate = 0.0825;
    const priceWithTax = (totalPrice * (1 + taxRate)).toFixed(2);
    document.getElementById('price').textContent = `$${priceWithTax} (includes tax)`;
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        if (!/^\d{16}$/.test(cardNumber)) {
            alert("Please enter a valid 16-digit card number.");
            return;
        }
        const [month, year] = expiryDate.split('/');
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1; 

        if (!month || !year || parseInt(year) < 24 || (parseInt(year) === 24 && parseInt(month) < 12)) {
            alert("Please enter a valid expiration date (must be after 12/2024).");
            return;
        }

        if (!/^\d{3}$/.test(cvv)) {
            alert("Please enter a valid 3-digit CVV.");
            return;
        }
        alert("Thank you for your purchase!");
        window.location.href = "index.html";
    });
});
