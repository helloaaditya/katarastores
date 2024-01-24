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

// Function to fetch and display cart items based on userEmail
function fetchCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');

    let totalPrice = 0;

    // Get the currently logged-in user
    const user = firebase.auth().currentUser;
    console.log(user);

    if (user) {
        // Fetch items from all cart collections
        Promise.all([
            db.collection('cart').where('userEmail', '==', user.email).get(),
            db.collection('normalcart').where('userEmail', '==', user.email).get()
            // Add other cart collections here if needed
        ])
        .then((snapshots) => {
            snapshots.forEach((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const quantity = data.quantity || 1;
                    const unitPrice = data.unitPrice || 0;
                    const productTotalPrice = quantity * unitPrice;
                    totalPrice += productTotalPrice;

                    // Create and append cart item div
                    const cartItemDiv = document.createElement('div');
                    cartItemDiv.classList.add('cart-item');
                    cartItemDiv.innerHTML = `
                        <img src="${data.productImage}" alt="${data.productName}">
                        <p>${data.productName}</p>
                        ${data.quantity ? `<p>Quantity: ${data.quantity}</p>` : ''}
                        ${data.totalAmount ? `<p>Total Amount: ₹${data.totalAmount.toFixed(2)}</p>` : ''}
                        <button class="delete-button" onclick="deleteItem('${doc.id}', '${querySnapshot.metadata.isFromCache ? 'normalcart' : 'cart'}')">Delete</button>
                    `;
                    cartItemsContainer.appendChild(cartItemDiv);
                });
            });

            // Display the total price
            totalPriceContainer.textContent = `Total Price: ₹${totalPrice.toFixed(2)}`;
        }).catch((error) => {
            console.error('Error fetching cart items:', error);
        });
    } else {
        // User is not logged in
        console.log('User is not logged in.');
    }
}

function deleteItem(cartItemId) {
    // Remove the item from the "cart" collection in Firestore
    db.collection('cart').doc(cartItemId).delete().then(() => {
        alert('Document successfully deleted!');
        // refresh page 
        location.reload();
        // Fetch and display updated cart items
        fetchCartItems();
    }).catch((error) => {
        console.error('Error deleting document:', error);
    });
}
// Function to delete an item from the cart


// Initial display of the cart
fetchCartItems();

function buynow() {
    // redirect to the checkout.html page
    window.location.href = "checkout.html";
}
