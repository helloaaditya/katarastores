const firebaseConfig = {
    apiKey: "AIzaSyCdtn8SUGu-zf8cvjBmuuWt_2CI65DEgpQ",
    authDomain: "katarastores-78cad.firebaseapp.com",
    projectId: "katarastores-78cad",
    storageBucket: "katarastores-78cad.appspot.com",
    messagingSenderId: "608050390043",
    appId: "1:608050390043:web:4c789c9c77cbf66ad644be",
    measurementId: "G-WPGL7WB382"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();


// Function to fetch and display cart items
function fetchCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');
    cartItemsContainer.innerHTML = ''; // Clear existing content

    let totalPrice = 0;

    // Fetch items from "cart" collection
    db.collection('cart').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Ensure quantity and unitPrice are defined before calculations
            const quantity = data.quantity || 1; // Set default quantity to 1 if not available
            const unitPrice = data.unitPrice || 0; // Set default unit price to 0 if not available

            // Calculate the total price for each product
            const productTotalPrice = quantity * unitPrice;
            totalPrice += productTotalPrice;

            // Create a div for each cart item
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');

            // Add product details to the cart item div
            cartItemDiv.innerHTML = `
                <img src="${data.productImage}" alt="${data.productName}">
                <p>${data.productName}</p>
                ${data.quantity ? `<p>Quantity: ${data.quantity}</p>` : ''}
                ${data.totalAmount ? `<p>Total Amount: $${data.totalAmount.toFixed(2)}</p>` : ''}
                <button class="delete-button" onclick="deleteItem('${doc.id}')">Delete</button>
            `;

            // Append the cart item div to the container
            cartItemsContainer.appendChild(cartItemDiv);
        });

        // Display the total price on the page after iterating through all items
        totalPriceContainer.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
    }).catch((error) => {
        console.error('Error fetching cart items:', error);
    });
}

// Function to delete an item from the cart
function deleteItem(cartItemId) {
    // Remove the item from the "cart" collection in Firestore
    db.collection('cart').doc(cartItemId).delete().then(() => {
        console.log('Document successfully deleted!');
        // Fetch and display updated cart items
        fetchCartItems();
    }).catch((error) => {
        console.error('Error deleting document:', error);
    });
}


// Initial display of the cart
fetchCartItems();


function buynow() {
    // redirect to the checkout.html page
    window.location.href = "checkout.html";
}