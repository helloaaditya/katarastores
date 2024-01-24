
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

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Login successful! Welcome to Katarastores.");
                window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Login Failed ! Try to login with valid Credential.")
        });
}

function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Registration successful! Please login to continue.");
            document.getElementById('loginForm').style.display = 'none';
        })
        .catch((error) => {
            const errorMessage = error.message;           
            alert(`Registration failed!. Please enter Email and Password.`);
            document.getElementById('loginForm').innerHTML = errorMessage;
            document.getElementById('loginForm').style.display = '';
        });
}

function forgotPassword() {
    const email = document.getElementById('email').value;

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Password reset email sent! Please check your inbox.");
        })
        .catch((error) => {
            alert("Password reset failed! Please Enter your Email address.");
            
        });
}
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            console.log('User successfully logged in with Google:', user);
            window.location.href = "index.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Google login error:', errorCode, errorMessage);
        });
}