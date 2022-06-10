document.addEventListener("DOMContentLoaded", main);

async function getUserName(){
    let res = await fetch("/username", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });
    res = await res.json()
    return res.username
}

function updateProfilePicture(){
    let newProfilePic = document.getElementById("newProfilePic").files[0];
    let formData = new FormData();
        
    formData.append("photo", newProfilePic);
    fetch('/profilePicture', {method: "POST", body: formData});
}

async function main() {
    document.getElementById("username").innerHTML = await getUserName();
    document.getElementById("btn_upload_profile_pic").addEventListener("click", updateProfilePicture)
    
    var tab_body = document.getElementById("tab_body");

    var profile_info_tab = document.getElementById("profile_info_tab");
    profile_info_tab.addEventListener("click", () => {
        profile_info_tab.className = 'tab_current';
        user_questions_tab.className = 'tab_other';
        user_answers_tab.className = 'tab_other';

        tab_body.innerHTML =  ""

        profile_left = document.createElement("div")
        tab_body.append(profile_left)
        profile_left.setAttribute("id", "profile_left")
        profile_left.setAttribute("class", "profile_left")

        profile_right = document.createElement("div")
        tab_body.append(profile_right)
        profile_right.setAttribute("id", "profile_right")
        profile_right.setAttribute("class", "profile_right")

        p = document.createElement("p")
        profile_left.append(p)
        p.innerHTML = "Questions:"

        p = document.createElement("p")
        profile_left.append(p)
        p.innerHTML = "Answers:"

        p = document.createElement("p")
        profile_left.append(p)
        p.innerHTML = "Member since:"

        p = document.createElement("p")
        profile_right.append(p)
        p.innerHTML = "0"

        p = document.createElement("p")
        profile_right.append(p)
        p.innerHTML = "0"

        p = document.createElement("p")
        profile_right.append(p)
        p.innerHTML = "05.04.2022"
    });

    var user_questions_tab = document.getElementById("user_questions_tab")
    user_questions_tab.addEventListener("click", () => {
        profile_info_tab.className = 'tab_other';
        user_questions_tab.className = 'tab_current';
        user_answers_tab.className = 'tab_other';

        tab_body.innerHTML = ""

        profile_qa = document.createElement("div")
        tab_body.append(profile_qa)
        profile_qa.setAttribute("id", "profile_qa")
        profile_qa.setAttribute("class", "profile_qa")

        h2 = document.createElement("h2")
        profile_qa.append(h2)
        h2.innerHTML = "User asked:"
    });

    var user_answers_tab = document.getElementById("user_answers_tab");
    user_answers_tab.addEventListener("click", () => {
        profile_info_tab.className = "tab_other";
        user_questions_tab.className = "tab_other";
        user_answers_tab.className = "tab_current";

        tab_body.innerHTML = ""

        profile_qa = document.createElement("div")
        tab_body.append(profile_qa)
        profile_qa.setAttribute("id", "profile_qa")
        profile_qa.setAttribute("class", "profile_qa")

        h2 = document.createElement("h2")
        profile_qa.append(h2)
        h2.innerHTML = "User answered:"
    });

    document.querySelector("user_questions")
}