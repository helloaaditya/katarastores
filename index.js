
document.addEventListener('DOMContentLoaded', function () {
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
});


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
    // Update quantity display
    document.getElementById('fquantity').innerText = quantity;

    // Get product price as a string
    const priceString = document.querySelector('.fproduct-price h3').innerText;

    // Extract numerical value from the price string
    const unitPrice = parseFloat(priceString.replace('$', ''));

    // Calculate and update total amount
    const totalAmount = quantity * unitPrice;
    document.getElementById('ftotal-amount').innerText = `$${totalAmount.toFixed(2)}`;
}


function addToCart() {
    try {
        // Get product details
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
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
}




function addToCartNormal() {
    // Get product details
    const productName = document.querySelector('.product-name a').innerText;
    const productPriceString = document.querySelector('.product-price h3').innerText;
    const productImage = document.querySelector('.product-image img').src;

    // Parse the price string to a float
    const productPrice = parseFloat(productPriceString.replace('$', ''));

    // Add the product to the Firestore "normalcart" collection with additional data
    db.collection('normalcart').add({
        productName: productName,
        productPrice: productPrice,
        productImage: productImage,
        dataTimeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        // Add other product details as needed
    }).then((docRef) => {
        alert(`Successfully added to the Cart.`);
    }).catch((error) => {
        alert.error('Error adding product to the Cart.');
    });
}


