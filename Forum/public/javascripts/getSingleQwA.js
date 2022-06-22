questionID = window.location.search.substring(1)

document.addEventListener("DOMContentLoaded", () => loadPage(questionID));

async function loadPage(questionID) {
    let res = await fetch("/question/" + questionID, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });

    res = await res.json();

    questionID = res[0].id
    userID = res[0].userid
    datePosted = res[0].dateposted
    questionText = res[0].questiontext
    explanationText = res[0].explanation
    numberUpvotes = res[0].upvotes
    numberDownvotes = res[0].downvotes
    numberScore = String(parseInt(numberUpvotes) - parseInt(numberDownvotes))

    questionContainer = document.getElementById("question")
    questionContainer.setAttribute("id", questionID)
    questionContainer.setAttribute("style", "width:90%;margin:auto;display:flex;flex-direction:row;border:solid")

    userPanel = document.createElement("div")
    userPanel.setAttribute("id", "userPanel-" + userID)
    userPanel.setAttribute("style", "width:20%;order:1;")
    questionContainer.appendChild(userPanel)

    userLink = document.createElement("a")
    userLink.setAttribute("href", "/profile.html?" + userID)
    userPanel.appendChild(userLink)

    profilePicture = document.createElement("img")
    profilePicture.setAttribute("style", "width:80%;")
    profilePicture.setAttribute("src", "/user/profilePicture/" + userID)
    userLink.appendChild(profilePicture)

    userName = document.createElement("p")
    userNameText = await fetch("/user/name/" + userID, { method: "GET", headers: { 'Content-Type': 'application/json' } })
    userNameText = await userNameText.json()
    userName.innerHTML = userNameText.username
    userLink.appendChild(userName)

    questionPanel = document.createElement("div")
    questionPanel.setAttribute("id", "questionPanel-" + questionID)
    questionPanel.setAttribute("style", "width:60%;order:2")
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
    upvote.addEventListener("click", (questionID) => sendLikeQuestion(questionID))
    votePanel.appendChild(upvote)

    score = document.createElement("p")
    score.innerHTML = numberScore
    votePanel.appendChild(score)

    downvote = document.createElement("img")
    downvote.setAttribute("src", "lib/unten_pfeil.png")
    downvote.setAttribute("style", "width:30%;bottom:0;")
    downvote.addEventListener("click", (questionID) => senddisLikeQuestion(questionID))
    votePanel.appendChild(downvote)

    document.getElementById("answerButton").addEventListener("click", () => sendAnswer(questionID))

    let loggedIn = await isLoggedIn();
    if (!loggedIn[0]){
        document.getElementById("newAnswer").remove()
    }

    loadAnswers(questionID)
}

async function loadAnswers(questionID) {
    res = await fetch("/answer/" + questionID, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    })
    res = await res.json()

    res.sort(function (obj2, obj1) {
        return (obj1.upvotes - obj1.downvotes) - (obj2.upvotes - obj2.downvotes);
    });

    answers = document.getElementById("answers")
    answers.innerHTML = ""

    for (var i = 0; i < res.length; i++) {
        answerID = res[i].id
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

        userPanel = document.createElement("div")
        userPanel.setAttribute("id", "userPanel-" + userID)
        userPanel.setAttribute("style", "width:20%;order:1;")
        answerContainer.appendChild(userPanel)

        userLink = document.createElement("a")
        userLink.setAttribute("href", "/profile.html?" + userID)
        userPanel.appendChild(userLink)

        profilePicture = document.createElement("img")
        profilePicture.setAttribute("style", "width:80%;")
        profilePicture.setAttribute("src", "/user/profilePicture/" + userID)
        userLink.appendChild(profilePicture)

        userName = document.createElement("p")
        userNameText = await fetch("/user/name/" + userID, { method: "GET", headers: { 'Content-Type': 'application/json' } })
        userNameText = await userNameText.json()
        userName.innerHTML = userNameText.username
        userLink.appendChild(userName)

        answerPanel = document.createElement("div")
        answerPanel.setAttribute("id", "answerPanel-" + answerID)
        answerPanel.setAttribute("style", "width:60%;order:2")
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

async function sendAnswer(questionID) {
    answerText = document.getElementById("answerInput").value
    json = { "answerText": answerText }

    fetch("/answer/new/" + questionID, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    })

    document.getElementById("answerInput").value = ""

    loadAnswers(questionID)
}

async function sendLikeAnswer(answerID) {
    id = answerID.path[2].id
    data = {
        "id": id
    }

    await fetch("/answer/like", {
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

    await fetch("/answer/dislike", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    answerID.path[1].children[1].innerHTML = String(parseInt(answerID.path[1].children[1].innerHTML) - 1)
}

async function sendLikeQuestion(questionID) {
    id = questionID.path[2].id
    data = {
        "id": id
    }

    await fetch("/question/like", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    questionID.path[1].children[1].innerHTML = String(parseInt(questionID.path[1].children[1].innerHTML) + 1)
}

async function senddisLikeQuestion(questionID) {
    id = questionID.path[2].id
    data = {
        "id": id
    }

    await fetch("/question/dislike", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    questionID.path[1].children[1].innerHTML = String(parseInt(questionID.path[1].children[1].innerHTML) - 1)
}

async function isLoggedIn() {
    let res = await fetch("/user/isLoggedIn", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });
    res = await res.json()
    if (res.loggedin == "true") {
        return [true, res]
    }
    else {
        return [false, res]
    }
}