async function loadPage(cathegory) {
    document.getElementById("cathegory").innerHTML = cathegory

    let res = await fetch("/questions/" + cathegory, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });

    res = await res.json();

    res.sort(function(obj2, obj1) {
        return (obj1.upvotes - obj1.downvotes) - (obj2.upvotes - obj2.downvotes);
    });

    body = document.getElementsByTagName("body")[0]

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

        userPanel = document.createElement("div")
        userPanel.setAttribute("id", "userPanel-" + userID)
        userPanel.setAttribute("style", "width:20%;order:1;")
        questionContainer.appendChild(userPanel)

        profilePicture = document.createElement("img")
        profilePicture.setAttribute("style", "width:80%;")
        profilePicture.setAttribute("src", "/profilePicture/" + userID)
        userPanel.appendChild(profilePicture)

        userName = document.createElement("p")
        userNameText = await fetch("/username/" + userID, {method:"GET", headers: { 'Content-Type': 'application/json' }})
        userNameText = await userNameText.json()
        userName.innerHTML = userNameText.username
        userPanel.appendChild(userName)

        questionPanel = document.createElement("div")
        questionPanel.setAttribute("id", "questionPanel-" + questionID)
        questionPanel.setAttribute("style", "width:60%;order:2")
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

cathegory = window.location.search.substring(1)

document.addEventListener("DOMContentLoaded", () => loadPage(cathegory));
