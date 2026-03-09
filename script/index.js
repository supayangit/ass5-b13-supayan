const doSignIn = () => {
   const userNameField = document.getElementById("username-input");
   const passwordField = document.getElementById("password-input");

   // credentials
   const userName = userNameField.value;
   const password = passwordField.value;
   const defUsername = document.getElementById("default-username").innerText;
   const defPassword = document.getElementById("default-password").innerText;
   if (userName == defUsername && password == defPassword) {
      alert("Sign In Successfull!");
      window.location.href = "dashboard.html";
   } else {
      alert("Enter Correct Credentials!");
      userNameField.value = "";
      passwordField.value = "";
      return;
   }
};