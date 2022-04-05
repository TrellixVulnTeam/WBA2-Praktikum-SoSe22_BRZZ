function profile_info() {
    document.getElementById("center_column").innerHTML = '\
    <div class="tab_bar">\
        <div class="tab_current">\
            <button id="profile_info" onclick="profile_info()">Profile info</button>\
        </div>\
        <div class="tab_other">\
            <button id="user_questions" onclick="user_questions()">User Questions</button>\
        </div>\
        <div class="tab_other">\
            <button id="user_answers" onclick="user_answers()">User Answers</button>\
        </div>\
    </div>\
    <div class="profile_left">\
        <p>Questions:</p>\
        <p>Answers:</p>\
        <p>Member since:</p>\
    </div>\
    <div class="profile_right">\
        <p>0</p>\
        <p>0</p>\
        <p>05.04.2022</p>\
    </div>'
}

function user_questions() {
    document.getElementById("center_column").innerHTML = '\
    <div class="tab_bar">\
        <div class="tab_other">\
            <button id="profile_info" onclick="profile_info()">Profile info</button>\
        </div>\
        <div class="tab_current">\
            <button id="user_questions" onclick="user_questions()">User Questions</button>\
        </div>\
        <div class="tab_other">\
            <button id="user_answers" onclick="user_answers()">User Answers</button>\
        </div>\
    </div>\
    <div class="profile_qa">\
        <h1>user_1234 asked:</h1>\
    </div>\
    '
}

function user_answers() {
    document.getElementById("center_column").innerHTML = '\
    <div class="tab_bar">\
        <div class="tab_other">\
            <button id="profile_info" onclick="profile_info()">Profile info</button>\
        </div>\
        <div class="tab_other">\
            <button id="user_questions" onclick="user_questions()">User Questions</button>\
        </div>\
        <div class="tab_current">\
            <button id="user_answers" onclick="user_answers()">User Answers</button>\
        </div>\
    </div>\
    <div class="profile_qa">\
        <h1>user_1234 anwered:</h1>\
    </div>\
    '
}