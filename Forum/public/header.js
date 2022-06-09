document.write('\
<div class="header">\
<table class ="table_header">\
    <tr>\
        <th class="border">\
            <a href="./index.html"><img id="Logo" src="./lib/logo2.png" align="left" alt="Logo"></a>\
            <h1 class="welcome">Welcome!</h1>\
        </th>\
        <th class="border">\
            <div>\
                <input class="search" type="text" placeholder="Search">\
            </div>\
        </th>\
        <th class="border">\
            <a id="profileTab" href="profile.html"><img id="Profil" src="/profilePicture" alt="Profil" style="height:100px;"></a>\
        </th>\
        <th class="border">\
            <nav>\
                <div class="dropdown">\
                    <button class="dropbtn">Menu</button>\
                    <div id="menuDropdown" class="dropdown-content">\
                        <a href="index.html">Home</a>\
                        <a id="questionTab" href="questionSide.html">Ask Question</a>\
                        <a href="kategorie.html">Categories</a>\
                        <a id="loginTab" href="login.html">Log in</a>\
                        <a id="signupTab" href="signup.html">Sign up</a>\
                        <a id="logoutTab" href="logout">Log Out</a>\
                    </div>\
                </div>\
            </nav>\
        </th>\
    </tr>\
</table>\
</div>\
');

document.addEventListener("DOMContentLoaded", main);

async function isLoggedIn(){
    let res = await fetch("/isLoggedIn", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });
    res = await res.json()
    if (res.loggedin == "true"){
        return true
    }
    else{
        return false
    }
}
async function main(){
    res = await isLoggedIn()
    if(res){
        document.getElementById("loginTab").remove()
        document.getElementById("signupTab").remove()
    }
    else{
        document.getElementById("questionTab").remove()
        document.getElementById("logoutTab").remove()
        document.getElementById("profileTab").setAttribute("href", "login.html")
    }
}