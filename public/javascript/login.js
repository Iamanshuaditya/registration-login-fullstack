function handleRegister() {
  const nameInput = document.querySelector("#form3Example1c");
  const emailInput = document.querySelector("#form3Example3c");
  const passwordInput = document.querySelector("#form3Example4c");
  const repeatPassInput = document.querySelector("#form3Example4cd");
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;
  const repeatPass = repeatPassInput.value;

  if (password === repeatPass) {
    console.log(
      `name: ${name}, email: ${email}, password: ${password}, repeatPass: ${repeatPass}`
    );
  } else {
    alert("please use same pass as");
  }

  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  repeatPassInput.value = "";

  function callback(resp) {
    resp.json().then(parsedResponse);
  }

  function parsedResponse(data) {
    if (data.error) {
      alert(data.error);
    } else {
      alert("Registration successful");
    }
  }

  fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, repeatPass }),
  }).then(callback);
}

function handleLogin() {
  const emailInput = document.getElementById("form2Example17");
  const passwordInput = document.getElementById("form2Example27");

  const email = emailInput.value;
  const password = passwordInput.value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password: password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      emailInput.value = "";
      passwordInput.value = "";

      alert("Logged in");
    })
    .catch((error) => console.error("Error:", error.message, error.response));
}
