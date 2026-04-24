let questions = [];
let currentQuestion = {};
let show = false;

fetch('/data/questions.json')
    .then(res => res.json())
    .then(data => {
        questions = data;
        loadQuestion();
    });

function loadQuestion() {

    let selectedCategory = document.getElementById("categoryFilter").value;
    let searchText = document.getElementById("searchBox").value.toLowerCase();

    let filtered = questions.filter(q => {

        let matchCategory = selectedCategory === "All" || q.category === selectedCategory;

        let matchSearch = q.question.toLowerCase().includes(searchText);

        return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
        document.getElementById("questionBox").innerHTML = "No match found";
        return;
    }

    currentQuestion = filtered[Math.floor(Math.random() * filtered.length)];

    show = false;

    document.getElementById("questionBox").innerHTML = `
        <h5 class="text-primary">${currentQuestion.category}</h5>
        <p><b>Q:</b> ${currentQuestion.question}</p>
    `;

    updateProgress();
    updateDailyCount();
}

function toggleAnswer() {

    if (!show) {
        document.getElementById("questionBox").innerHTML += `
            <hr>
            <p><b>Short:</b> ${currentQuestion.shortAnswer}</p>
            <p><b>Detailed:</b> ${currentQuestion.detailedAnswer}</p>

            ${currentQuestion.code ? `<pre><code class="language-csharp">${currentQuestion.code}</code></pre>` : ''}
            ${currentQuestion.query ? `<pre><code class="language-sql">${currentQuestion.query}</code></pre>` : ''}
        `;
        show = true;
    }

    Prism.highlightAll();
}


function markWeak() {

    let weakQuestions = JSON.parse(localStorage.getItem("weak")) || [];

    // duplicate avoid
    if (!weakQuestions.some(q => q.id === currentQuestion.id)) {
        weakQuestions.push(currentQuestion);
        localStorage.setItem("weak", JSON.stringify(weakQuestions));
        alert("Marked as weak!");
    } else {
        alert("Already marked!");
    }
}

function updateProgress() {
    let seen = JSON.parse(localStorage.getItem("seen")) || [];

    if (!seen.includes(currentQuestion.id)) {
        seen.push(currentQuestion.id);
        localStorage.setItem("seen", JSON.stringify(seen));
    }

    document.getElementById("progress").innerText =
        `Progress: ${seen.length} / ${questions.length}`;
}

function getTodayKey() {
    return new Date().toISOString().split('T')[0];
}

function updateDailyCount() {

    let today = getTodayKey();

    let data = JSON.parse(localStorage.getItem("daily")) || {};

    if (!data[today]) {
        data = { [today]: [] }; // reset new day
    }

    if (!data[today].includes(currentQuestion.id)) {
        data[today].push(currentQuestion.id);
    }

    localStorage.setItem("daily", JSON.stringify(data));

    document.getElementById("daily").innerText =
        `Daily: ${data[today].length} / 10`;
}