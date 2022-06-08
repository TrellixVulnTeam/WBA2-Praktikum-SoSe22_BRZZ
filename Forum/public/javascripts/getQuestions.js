likebutton = document.getElementsByClassName("bild_oben");
dislikebutton = document.getElementsByClassName("bild_unten");
categorie = document.getElementsByTagName("h1")[1].innerText;

document.addEventListener("DOMContentLoaded", sendForm);

for (let i = 0; i <= likebutton.length; i++) {
    likebutton[i].addEventListener("click", sendLike);
    dislikebutton[i].addEventListener("click", senddisLike);
}

async function sendForm() {

    data = {
        "categorie": categorie
    }

    let res = await fetch("http://localhost:3000/questions", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    res = await res.json();

    console.log(res);

    for (i = 0; i <= res.length; i++) {
        //Komischer Fehler???
        var questiontext = String(res[i]['questiontext']);
        var explanation = String(res[i]['explanation']);
        console.log(questiontext);
        console.log(explanation);
    }
}

async function sendLike() {
    //Wie bekomme ich die QuestionID der Frage die Like/Dislike bekommt?
    console.log("Like!");
    data = {
        "id": "nV1y6Ex3OTPEtajMZks28"
    }

    await fetch("http://localhost:3000/like", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

async function senddisLike() {
    console.log("DisLike!");
    data = {
        "id": "nV1y6Ex3OTPEtajMZks28"
    }

    await fetch("http://localhost:3000/dislike", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

}