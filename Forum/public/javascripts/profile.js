id = window.location.search.substring(1);

document.addEventListener("DOMContentLoaded", main);

async function getUserName(){
    let res = await fetch("/username", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });
    res = await res.json()
    return res.username
}

async function getProfileData(id){
    let res = await fetch("/profileData/" + id, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });
    res = await res.json();
    return res;
}

function updateProfilePicture(){
    let newProfilePic = document.getElementById("newProfilePic").files[0];
    let formData = new FormData();
        
    formData.append("photo", newProfilePic);
    fetch('/profilePicture', {method: "POST", body: formData});
}

function loadProfileInfo() {
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
    p.innerHTML = profileData.questions.length

    p = document.createElement("p")
    profile_right.append(p)
    p.innerHTML = profileData.answers.length

    p = document.createElement("p")
    profile_right.append(p)
    p.innerHTML = profileData.userdata.joindate
}

async function loadQuestionTab(){
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

    res =  profileData.questions;
    
    questionbody = document.createElement("div");
    profile_qa.append(questionbody)

    body = questionbody

    for (var i = 0; i < res.length; i++){
        questionID = res[i].id
        userID = res[i].userid
        datePosted = res[i].dateposted
        questionText = res[i].questiontext
        explanationText = res[i].explanation
        numberUpvotes = res[i].upvotes
        numberDownvotes = res[i].downvotes
        numberScore = String(parseInt(numberUpvotes) - parseInt(numberDownvotes))

        questionContainer = document.createElement("div")
        questionContainer.setAttribute("id", questionID)
        questionContainer.setAttribute("style", "width:90%;margin:auto;display:flex;flex-direction:row;border:solid")
        body.appendChild(questionContainer)
        body.appendChild(document.createElement("br"))

        questionPanel = document.createElement("div")
        questionPanel.setAttribute("id", "questionPanel-" + questionID)
        questionPanel.setAttribute("style", "width:80%;order:2;padding:5%")
        questionPanel.addEventListener("click", (questionID) => openQuestion(questionID))
        questionContainer.appendChild(questionPanel)

        question = document.createElement("h2")
        question.innerHTML = questionText
        questionPanel.appendChild(question)

        explanation = document.createElement("p")
        explanation.innerHTML = explanationText
        questionPanel.appendChild(explanation)

        metadata = document.createElement("p")
        metadata.innerHTML = "posted on: " + datePosted + " ID: " + questionID
        questionPanel.appendChild(metadata)

        votePanel = document.createElement("div")
        votePanel.setAttribute("id", "votePanel")
        votePanel.setAttribute("style", "width:20%;order:3;text-align:center;")
        questionContainer.appendChild(votePanel)

        upvote = document.createElement("img")
        upvote.setAttribute("src", "lib/oben_pfeil.png")
        upvote.setAttribute("style", "width:32%;top:10px;")
        upvote.addEventListener("click", (questionID) => sendLike(questionID))
        votePanel.appendChild(upvote)

        score = document.createElement("p")
        score.innerHTML = numberScore
        votePanel.appendChild(score)

        downvote = document.createElement("img")
        downvote.setAttribute("src", "lib/unten_pfeil.png")
        downvote.setAttribute("style", "width:30%;bottom:0;")
        downvote.addEventListener("click", (questionID) => senddisLike(questionID))
        votePanel.appendChild(downvote)
    }
}

async function sendLike(questionID) {
    id = questionID.path[2].id
    data = {
        "id": id
    }

    await fetch("http://localhost:3000/likeQuestion", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    questionID.path[1].children[1].innerHTML = String(parseInt(questionID.path[1].children[1].innerHTML) + 1)
}

async function senddisLike(questionID) {
    id = questionID.path[2].id
    data = {
        "id": id
    }

    await fetch("http://localhost:3000/dislikeQuestion", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    questionID.path[1].children[1].innerHTML = String(parseInt(questionID.path[1].children[1].innerHTML) - 1)
}

async function openQuestion(questionID){
    id = questionID.path[2].id
    for (var i = 0; i < questionID.path.length; i++){
        if (questionID.path[i].id){
            if (questionID.path[i].id.includes("questionPanel-")){
                id = questionID.path[i].id.replace("questionPanel-", "")
                break
            }
        }
    }
    window.location = "/frage_antwort.html?" + id
}

async function openQuestionFromAnswer(questionID){
    id = questionID.path[2].id
    for (var i = 0; i < questionID.path.length; i++){
        if (questionID.path[i].id){
            if (questionID.path[i].id.includes("answerPanel-")){
                id = questionID.path[i].id.replace("answerPanel-", "")
                break
            }
        }
    }
    for (var i = 0; i < profileData.answers.length; i++){
        if(id == profileData.answers[i].id){
            id = profileData.answers[i].questionid
            break
        }
    }
    window.location = "/frage_antwort.html?" + id
}

async function loadAnswerTab(){
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

    res = profileData.answers;

    answers = document.createElement("div")
    profile_qa.append(answers)

    for (var i = 0; i < res.length; i++){
        answerID = res[i].id
        questionID = res[i].questionid
        userID = res[i].userid
        datePosted = res[i].dateposted
        answerText = res[i].answertext
        numberUpvotes = res[i].upvotes
        numberDownvotes = res[i].downvotes
        numberScore = String(parseInt(numberUpvotes) - parseInt(numberDownvotes))

        answerContainer = document.createElement("div")
        answerContainer.setAttribute("id", answerID)
        answerContainer.setAttribute("style", "width:90%;margin:auto;display:flex;flex-direction:row;border:solid")
        answers.appendChild(answerContainer)
        answers.appendChild(document.createElement("br"))

        answerPanel = document.createElement("div")
        answerPanel.setAttribute("id", "answerPanel-" + answerID)
        answerPanel.setAttribute("style", "width:80%;order:2")
        answerPanel.addEventListener("click", (questionID) => openQuestionFromAnswer(questionID))
        answerContainer.appendChild(answerPanel)

        answer = document.createElement("p")
        answer.innerHTML = answerText
        answerPanel.appendChild(answer)

        metadata = document.createElement("p")
        metadata.innerHTML = "posted on: " + datePosted + " ID: " + answerID
        answerPanel.appendChild(metadata)

        votePanel = document.createElement("div")
        votePanel.setAttribute("id", "votePanel")
        votePanel.setAttribute("style", "width:20%;order:3;text-align:center;")
        answerContainer.appendChild(votePanel)

        upvote = document.createElement("img")
        upvote.setAttribute("src", "lib/oben_pfeil.png")
        upvote.setAttribute("style", "width:32%;top:10px;")
        upvote.addEventListener("click", (answerID) => sendLikeAnswer(answerID))
        votePanel.appendChild(upvote)

        score = document.createElement("p")
        score.innerHTML = numberScore
        votePanel.appendChild(score)

        downvote = document.createElement("img")
        downvote.setAttribute("src", "lib/unten_pfeil.png")
        downvote.setAttribute("style", "width:30%;bottom:0;")
        downvote.addEventListener("click", (answerID) => senddisLikeAnswer(answerID))
        votePanel.appendChild(downvote)
    }
}

async function sendLikeAnswer(answerID) {
    id = answerID.path[2].id
    data = {
        "id": id
    }

    await fetch("/likeAnswer", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    answerID.path[1].children[1].innerHTML = String(parseInt(answerID.path[1].children[1].innerHTML) + 1)
}

async function senddisLikeAnswer(answerID) {
    id = answerID.path[2].id
    data = {
        "id": id
    }

    await fetch("/dislikeAnswer", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    answerID.path[1].children[1].innerHTML = String(parseInt(answerID.path[1].children[1].innerHTML) - 1)
}

async function main() {
    profileData = await getProfileData(id);

    document.getElementById("username").innerHTML = profileData.userdata.username;
    document.getElementById("profilePicture").setAttribute("src", "/profilePicture/" + id)
    document.getElementById("btn_upload_profile_pic").addEventListener("click", updateProfilePicture)
    
    var tab_body = document.getElementById("tab_body");

    var profile_info_tab = document.getElementById("profile_info_tab");
    profile_info_tab.addEventListener("click", loadProfileInfo);

    var user_questions_tab = document.getElementById("user_questions_tab")
    user_questions_tab.addEventListener("click", loadQuestionTab);

    var user_answers_tab = document.getElementById("user_answers_tab");
    user_answers_tab.addEventListener("click",loadAnswerTab);

    document.querySelector("user_questions")
    loadProfileInfo();
}