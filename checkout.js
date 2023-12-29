const firebaseConfig = {
    apiKey: "AIzaSyCdtn8SUGu-zf8cvjBmuuWt_2CI65DEgpQ",
    authDomain: "katarastores-78cad.firebaseapp.com",
    projectId: "katarastores-78cad",
    storageBucket: "katarastores-78cad.appspot.com",
    messagingSenderId: "608050390043",
    appId: "1:608050390043:web:4c789c9c77cbf66ad644be",
    measurementId: "G-WPGL7WB382"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');
    const checkoutForm = document.getElementById('checkout-form');

    function fetchCartItems() {
        // Fetch items from "cart" collection
        db.collection('cart').get().then((querySnapshot) => {
            let totalPrice = 0;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                cartItemDiv.innerHTML = `
                    <img src="${data.productImage}" alt="${data.productName}">
                    <p>${data.productName}</p>
                    ${data.quantity ? `<p>Quantity: ${data.quantity}</p>` : ''}
                    ${data.totalAmount ? `<p>Total Amount: $${data.totalAmount.toFixed(2)}</p>` : ''}
                    ${data.unitPrice ? `<p>Unit Price: $${data.unitPrice.toFixed(2)}</p>` : ''}
                `;

                cartItemsContainer.appendChild(cartItemDiv);

                // Calculate the total price for each product
                totalPrice += data.quantity * data.unitPrice;
            });

            // Display the total price on the page
            totalPriceContainer.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        }).catch((error) => {
            console.error('Error fetching cart items:', error);
        });
    }

    // Function to store billing details in Firestore
    function storeBillingDetails(name, email, address, city, state, country, zip, phone) {
        db.collection('billingDetails').add({
            name: name,
            email: email,
            address: address,
            city: city,
            state: state,
            country: country,
            zip: zip,
            phone: phone,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then((docRef) => {
            console.log('Billing details stored with ID: ', docRef.id);
        }).catch((error) => {
            console.error('Error storing billing details:', error);
        });
    }

    // Fetch and display cart items on page load
    fetchCartItems();

    // Handle form submission
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // Extract billing details from the form
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const country = document.getElementById('country').value;
        const zip = document.getElementById('zip').value;
        const phone = document.getElementById('phone').value;

        // Store billing details in Firestore
        storeBillingDetails(name, email, address, city, state, country, zip, phone);

        alert('Purchase completed!');
    });
});