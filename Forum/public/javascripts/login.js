user_name_input = document.getElementById("user");
password_input = document.getElementById("password");
submitbutton = document.getElementById("submit");

submitbutton.addEventListener("click", sendForm);

async function sendForm() {
    username = user_name_input.value;
    password = password_input.value;

    data = {
        "username": username,
        "password": password
    }

    let res = await fetch("/user/new_session", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    res = await res.json();

    if (res.status == "correct") {
        cookie_str = "sessionid=" + res.sessionid + "; expires=" + Date(res.endTime) + "; path=/";
        document.cookie = cookie_str;
        window.location.href = "/index.html"
    }   
    else if(res.status == "pwwrong"){
        window.alert("Password wrong!");
    }
    else if(res.status == "usrwrong"){
        window.alert("Username doesn't exist!")
    }
}