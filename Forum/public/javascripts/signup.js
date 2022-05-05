first_name_input = document.getElementById("first_name");
password_input = document.getElementById("password");
password_repeat_input = document.getElementById("repeat_password");
submitbutton = document.getElementById("submit");

submitbutton.addEventListener("click", sendForm);
//submitbutton.addEventListener("click", checkFormular);

function sendForm() {
    text = first_name_input.value

    if (password_input.value === password_repeat_input.value && checkFormular()) {
        password = password_input.value;
        data = {
            "id": text,
            "password": password,
        }

        fetch("http://localhost:3000/test", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

    }
    if (password_input.value != password_repeat_input.value) {
        window.alert("Passwords are not the same!");
    }

}

function checkFormular() {

    let checkBox = true;
    let first_name, last_name, email, username, password, repeat_password;

    first_name = document.getElementById("first_name");
    last_name = document.getElementById("last_name");
    email = document.getElementById("e-mail");
    username = document.getElementById("username");
    password = document.getElementById("password");
    repeat_password = document.getElementById("repeat_password");

    if (first_name.value == "") {
        //first_name.style.borderColor = "red";
        window.alert("First name is empty!");
        checkBox = false;
    }
    else {
        first_name.style.borderColor = "white";
    }
    if (last_name.value.length == 0) {
        //last_name.style.borderColor = "red";
        window.alert("Last name is empty!");
        checkBox = false;
    }
    else {
        last_name.style.borderColor = "white";
    }
    if (email.value.length == 0) {
        //email.style.borderColor = "red";
        window.alert("E-Mail is empty!");
        checkBox = false;
    }
    else {
        email.style.borderColor = "white";
    }

    if (username.value.length == 0) {
        //username.style.borderColor = "red";
        window.alert("User name is empty!");
        checkBox = false;
    }
    else {
        username.style.borderColor = "white";
    }

    if (password.value.length == 0) {
        //password.style.borderColor = "red";
        window.alert("Password is empty!");
        checkBox = false;
    }
    else {
        password.style.borderColor = "white";
    }

    if (repeat_password.value.length == 0) {
        //repeat_password.style.borderColor = "red";
        window.alert("Repeat Password is empty!");
        checkBox = false;
    }
    else {
        repeat_password.style.borderColor = "white";
    }
    return checkBox;
}