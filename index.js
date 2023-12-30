document.addEventListener('DOMContentLoaded', function () {
    // Initialize Firebase and other setup

    const radioButtons = document.querySelectorAll('input[type="radio"]');
    const slides = document.querySelector('.slides');
    const autoButtons = document.querySelectorAll('.auto-btn1, .auto-btn2, .auto-btn3');
    const manualButtons = document.querySelectorAll('.manual-btn');

    let currentSlide = 0;

    function showSlide(index) {
        const translateValue = -index * 100 + '%';
        slides.style.transform = 'translateX(' + translateValue + ')';
        currentSlide = index;
    }

    function handleManualButtonClick(index) {
        radioButtons[index].checked = true;
        showSlide(index);
    }

    function handleAutoButtonClick(index) {
        showSlide(index);
    }

    manualButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleManualButtonClick(index));
    });

    autoButtons.forEach((button, index) => {
        button.addEventListener('click', () => handleAutoButtonClick(index));
    });

    // Automatic slide change every 5 seconds (adjust as needed)
    setInterval(() => {
        const nextSlideIndex = (currentSlide + 1) % radioButtons.length;
        radioButtons[nextSlideIndex].checked = true;
        showSlide(nextSlideIndex);
    }, 5000);

    firebase.auth().onAuthStateChanged(function (user) {
        const userInfoDiv = document.getElementById('user-info');
        const loginLink = document.getElementById('loginLink');
        const logoutBtn = document.getElementById('logoutBtn');

        // Function to log out the user
        function logout() {
            firebase.auth().signOut().then(function () {
                alert('You have been logged out successfully. See you again soon!');
            }).catch(function (error) {
                console.error('An error occurred during logout:', error);
            });
            // redirect to the index  page after 2sec/
            setTimeout(function () {
                window.location.href = "index.html";
            }, 2000);
        }

        if (user) {
            userInfoDiv.textContent = user.email;
            logoutBtn.style.display = 'block'; 
            loginLink.style.display = 'none'; 

            logoutBtn.addEventListener('click', logout);

            fetchCartItems();
        } else {
            userInfoDiv.textContent = ''; 
            logoutBtn.style.display = 'none'; 
            loginLink.style.display = 'block'; 
        }
    });
});


function displayUserInfo(user) {
    const userInfo = document.getElementById('user-info');

    if (user) {
        userInfo.textContent = `Welcome, ${user.email}`;
    } else {
        userInfo.textContent = '';
    }
}

let quantity = 1;

function incrementQuantity() {
    quantity++;
    updateQuantityAndTotal();
}

function decrementQuantity() {
    if (quantity > 1) {
        quantity--;
        updateQuantityAndTotal();
    }
}

function updateQuantityAndTotal() {
    document.getElementById('fquantity').innerText = quantity;
    const priceString = document.querySelector('.fproduct-price h3').innerText;
    const unitPrice = parseFloat(priceString.replace('$', ''));
    const totalAmount = quantity * unitPrice;
    document.getElementById('ftotal-amount').innerText = `$${totalAmount.toFixed(2)}`;
}

function addToCart() {
    try {
        const user = firebase.auth().currentUser;

        if (user) {
            // User is logged in, proceed with adding the product to the cart
            const userEmail = user.email;
            const productName = document.querySelector('.fproduct-name a').innerText;
            const productPriceString = document.querySelector('.fproduct-price h3').innerText;
            const productDescription = document.querySelector('.fproduct-name p').innerText;
            const productImage = document.querySelector('.fproduct-image img').src;

            // Convert product price to a number
            const unitPrice = parseFloat(productPriceString.replace('$', ''));

            // Get quantity and calculate total amount
            const totalAmount = quantity * unitPrice;

            // Add product details to Firestore
            db.collection("cart").add({
                userEmail: userEmail,
                productName: productName,
                productDescription: productDescription,
                quantity: quantity,
                productImage: productImage,
                unitPrice: unitPrice,
                totalAmount: totalAmount,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(function(docRef) {
                alert(`Successfully added to the Cart.`);
            })
            .catch((error) => {
                console.error('Error adding product to the Cart:', error);
                alert('Error adding product to the Cart. Please try again later.');
            });
        } else {
            // User is not logged in, redirect to login page
            alert('Please log in to add items to the cart.');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
}

function addToCartNormal() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');

    let totalPrice = 0;

    const user = firebase.auth().currentUser;

    if (user) {
        db.collection('cart').where('userEmail', '==', user.email).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                const quantity = data.quantity || 1;
                const unitPrice = data.unitPrice || 0; 

                const productTotalPrice = quantity * unitPrice;
                totalPrice += productTotalPrice;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');

                cartItemDiv.innerHTML = `
                    <img src="${data.productImage}" alt="${data.productName}">
                    <p>${data.productName}</p>
                    ${data.quantity ? `<p>Quantity: ${data.quantity}</p>` : ''}
                    ${data.totalAmount ? `<p>Total Amount: $${data.totalAmount.toFixed(2)}</p>` : ''}
                    <button class="delete-button" onclick="deleteItem('${doc.id}')">Delete</button>
                `;

                cartItemsContainer.appendChild(cartItemDiv);
            });

            totalPriceContainer.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
        }).then(function(docRef) {
            alert(`Successfully added to the Cart.`);
        })
        .catch((error) => {
            console.error('Error adding product to the Cart:', error);
            alert('Error adding product to the Cart. Please try again later.');
        });
    } else {
        // User is not logged in, redirect to login page
        alert('Please log in to add items to the cart.');
        window.location.href = 'login.html';
    }
}



