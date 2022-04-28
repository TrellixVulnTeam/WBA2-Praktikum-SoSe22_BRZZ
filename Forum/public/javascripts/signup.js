first_name_input = document.getElementById("first_name");
submitbutton = document.getElementById("submit");

submitbutton.addEventListener("click", sendForm);

function sendForm(){
    text = first_name_input.value
    data = {
        "id": text
    }

    fetch("http://localhost:3000/test", {
        method: "POST",
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(data)
    })
}