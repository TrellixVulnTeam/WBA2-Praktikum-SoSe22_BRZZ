document.addEventListener("DOMContentLoaded", main);

function main() {
    console.log("DOMContentLoaded")
    
    var profile_info_tab = document.getElementById("profile_info");
    profile_info_tab.addEventListener("click", () => {
        profile_info_tab.className = "tab_current";
        user_questions_tab.className = "tab_other";
        user_answers_tab.className = "tab_other";
    });

    var user_questions_tab = document.getElementById("user_questions")
    user_questions_tab.addEventListener("click", () => {
        profile_info_tab.className = "tab_other";
        user_questions_tab.className = "tab_current";
        user_answers_tab.className = "tab_other";
    });

    var user_answers_tab = document.getElementById("user_answers");
    user_answers_tab.addEventListener("click", () => {
        profile_info_tab.className = "tab_other";
        user_questions_tab.className = "tab_other";
        user_answers_tab.className = "tab_current";
    });

    document.querySelector("user_questions")
}