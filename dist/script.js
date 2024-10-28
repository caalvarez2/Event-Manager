document.getElementById('createAccountLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signInForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'block';
});

document.getElementById('signInLink').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signInForm').style.display = 'block';
    document.getElementById('signUpForm').style.display = 'none';
});
