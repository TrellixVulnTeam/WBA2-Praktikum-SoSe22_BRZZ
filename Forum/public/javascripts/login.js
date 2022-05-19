user_name_input = document.getElementById("user");
password_input = document.getElementById("password");
submitbutton = document.getElementById("submit");

//submitbutton.submitbutton.addEventListener("click", sendForm);
submitbutton.addEventListener("click", sendForm);

function sendForm() {
    username = user_name_input.value;
    password = password_input.value;

    data = {
        "username": username,
        "password": password
    }

    fetch("http://localhost:3000/new_session", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    console.log(Response.status);



    /*
    if (res.status) {
        console.log("Status True");
        window.location.href = "/index.html"
    }   
    else {
        console.log("Status False");
        window.alert("Password wrong!");
    }
    */
}