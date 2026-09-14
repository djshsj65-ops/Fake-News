/* ================= AUTH STATE ================= */

let isLoggedIn = false;


/* ================= INITIALIZE APP ================= */

function initializeApp() {
    let email = localStorage.getItem("email");
    let password = localStorage.getItem("password");
    
    if (email && password) {
        isLoggedIn = true;
        updateProfileUI();
    } else {
        isLoggedIn = false;
        updateGuestUI();
    }
}


function updateProfileUI() {
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");
    
    document.getElementById("profileSection").style.display = "flex";
    document.getElementById("guestMessage").style.display = "none";
    
    document.getElementById("userName").innerText = name || "User";
    document.getElementById("userEmail").innerText = email || "";
    document.getElementById("settingsEmail").innerText = email || "";
    document.getElementById("avatar").innerText = name ? name.charAt(0).toUpperCase() : "U";
    
    let authBtn = document.getElementById("authBtn");
    authBtn.innerHTML = "🚪 <span>Logout</span>";
    authBtn.onclick = function() { logout(); };
}


function updateGuestUI() {
    document.getElementById("profileSection").style.display = "none";
    document.getElementById("guestMessage").style.display = "block";
    
    let authBtn = document.getElementById("authBtn");
    authBtn.innerHTML = "🔑 <span>Login</span>";
    authBtn.onclick = function() { showLoginPage(); };
}


/* ================= SIGNUP ================= */

function signup() {

    let name =
        document.getElementById("signupName").value;

    let email =
        document.getElementById("signupEmail").value;

    let password =
        document.getElementById("signupPassword").value;


    if (
        name === "" ||
        email === "" ||
        password === ""
    ) {

        alert("Please fill all fields.");

        return;
    }


    localStorage.setItem("name", name);

    localStorage.setItem("email", email);

    localStorage.setItem("password", password);


    alert("Account created successfully!");

    isLoggedIn = true;
    
    hideForms();
    
    updateProfileUI();
    
    // If on history page, stay there; otherwise go to home
    let currentPageSignup = document.querySelector(".page-section.active");
    if (currentPageSignup && currentPageSignup.id === 'history') {
        openPage('history', document.querySelector('.nav-btn[onclick*="history"]'));
    } else {
        openPage('home', document.querySelector('.nav-btn.active'));
    }

}



/* ================= LOGIN ================= */

function login() {

    let email =
        document.getElementById("loginEmail").value;

    let password =
        document.getElementById("loginPassword").value;


    let savedEmail =
        localStorage.getItem("email");

    let savedPassword =
        localStorage.getItem("password");


    if (
        email === savedEmail &&
        password === savedPassword
    ) {

        isLoggedIn = true;
        
        hideForms();
        
        updateProfileUI();
        
        // If on history page, stay there; otherwise go to home
        let currentPageLogin = document.querySelector(".page-section.active");
        if (currentPageLogin && currentPageLogin.id === 'history') {
            openPage('history', document.querySelector('.nav-btn[onclick*="history"]'));
        } else {
            openPage('home', document.querySelector('.nav-btn.active'));
        }

    } else {

        alert(
            "Incorrect email or password."
        );

    }

}



/* ================= PAGES ================= */

function showLoginPage() {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("signupPage").classList.add("hidden");
    document.body.classList.add("modal-open");
}

function showSignup() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signupPage").classList.remove("hidden");
    document.body.classList.add("modal-open");
}

function showLogin() {
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("signupPage").classList.add("hidden");
}

function hideForms() {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("signupPage").classList.add("hidden");
    document.body.classList.remove("modal-open");
}


/* ================= LOGOUT ================= */

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        
        isLoggedIn = false;
        
        updateGuestUI();
        
        openPage('home', document.querySelector('.nav-btn.active'));
        
        alert("You have been logged out!");
    }
}



/* ================= NAVIGATION ================= */

function openPage(page, button) {

    let sections =
        document.querySelectorAll(".page-section");


    sections.forEach(function(section) {

        section.classList.remove("active");

    });


    document
        .getElementById(page)
        .classList.add("active");


    let buttons =
        document.querySelectorAll(".nav-btn");


    buttons.forEach(function(btn) {

        btn.classList.remove("active");

    });


    if (button) {

        button.classList.add("active");

    }


    let titles = {

        home: "Dashboard",

        checker: "News Checker",

        history: "History",

        settings: "Settings"

    };


    document
        .getElementById("topTitle")
        .innerText = titles[page];

    // Handle history page - show login prompt if guest
    if (page === 'history') {
        if (!isLoggedIn) {
            document.getElementById("historyLoginPrompt").style.display = "block";
            document.getElementById("historyCard").style.display = "none";
        } else {
            document.getElementById("historyLoginPrompt").style.display = "none";
            document.getElementById("historyCard").style.display = "block";
        }
    }

}


function closeLoginPrompt() {
    document.getElementById("loginPrompt").classList.add("hidden");
}



/* ================= NEWS ANALYSIS ================= */

function analyzeNews() {

    let text =
        document
            .getElementById("newsText")
            .value
            .trim();


    if (text === "") {

        alert(
            "Please paste a news article first."
        );

        return;

    }


    let fakeWords = [

        "shocking",

        "secret",

        "miracle",

        "you won't believe",

        "breaking",

        "100% true",

        "viral",

        "guaranteed",

        "government hiding",

        "click here"

    ];


    let score = 78;


    let lowerText =
        text.toLowerCase();


    fakeWords.forEach(function(word) {

        if (lowerText.includes(word)) {

            score -= 8;

        }

    });


    if (text.length < 80) {

        score -= 10;

    }


    if (score < 25) {

        score = 25;

    }


    if (score > 95) {

        score = 95;

    }


    let result =
        document.getElementById("result");

    let status =
        document.getElementById("resultStatus");

    let confidence =
        document.getElementById("confidence");

    let bar =
        document.getElementById("progressBar");


    result.classList.remove("hidden");


    confidence.innerText =
        score + "%";


    bar.style.width =
        score + "%";


    if (score >= 60) {

        status.innerText =
            "🟢 Likely Genuine";

    } else {

        status.innerText =
            "🔴 Potentially Misleading";

    }


    /* COUNTERS */

    let storageKey = isLoggedIn ? 'checked' : 'guest_checked';
    let genuineKey = isLoggedIn ? 'genuine' : 'guest_genuine';
    let fakeKey = isLoggedIn ? 'fake' : 'guest_fake';
    
    let checked =
        parseInt(
            (isLoggedIn ? localStorage : sessionStorage).getItem(storageKey) || "0"
        );

    let genuine =
        parseInt(
            (isLoggedIn ? localStorage : sessionStorage).getItem(genuineKey) || "0"
        );

    let fake =
        parseInt(
            (isLoggedIn ? localStorage : sessionStorage).getItem(fakeKey) || "0"
        );


    checked++;


    if (score >= 60) {

        genuine++;

    } else {

        fake++;

    }


    if (isLoggedIn) {
        localStorage.setItem(storageKey, checked);
        localStorage.setItem(genuineKey, genuine);
        localStorage.setItem(fakeKey, fake);
    } else {
        sessionStorage.setItem(storageKey, checked);
        sessionStorage.setItem(genuineKey, genuine);
        sessionStorage.setItem(fakeKey, fake);
    }


    updateStats();


    /* HISTORY */

    let history =
        document.getElementById("historyList");


    let item =
        document.createElement("div");


    item.className = "activity";


    item.innerHTML =

        "<div class='activity-title'>" +

        text.substring(0, 70) +

        "...</div>" +

        "<div class='activity-time'>" +

        "Confidence: " +

        score +

        "%</div>";


    history.prepend(item);


    /* RECENT ACTIVITY */

    let activity =
        document.getElementById("activityList");


    let activityItem =
        document.createElement("div");


    activityItem.className =
        "activity";


    activityItem.innerHTML =

        "<div class='activity-title'>" +

        (score >= 60
            ? "🟢 Likely genuine news"
            : "🔴 Potentially misleading") +

        "</div>" +

        "<div class='activity-time'>" +

        "Just now · " +

        score +

        "% confidence" +

        "</div>";


    activity.prepend(activityItem);

}


/* ================= APP STARTUP ================= */

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});



/* ================= STATS ================= */

function updateStats() {

    let storageKey = isLoggedIn ? 'checked' : 'guest_checked';
    let genuineKey = isLoggedIn ? 'genuine' : 'guest_genuine';
    let fakeKey = isLoggedIn ? 'fake' : 'guest_fake';
    
    let storage = isLoggedIn ? localStorage : sessionStorage;

    document
        .getElementById("checkedCount")
        .innerText =
        storage.getItem(storageKey) || "0";


    document
        .getElementById("genuineCount")
        .innerText =
        storage.getItem(genuineKey) || "0";


    document
        .getElementById("fakeCount")
        .innerText =
        storage.getItem(fakeKey) || "0";

}
