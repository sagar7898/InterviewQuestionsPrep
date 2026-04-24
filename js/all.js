let allQuestionsData = [];

fetch('/data/questions.json')
    .then(res => res.json())
    .then(data => {
        allQuestionsData = data;
        renderQuestions(data);
    });
function renderQuestions(questions) {

    let grouped = {};

    // group by category
    questions.forEach(q => {
        if (!grouped[q.category]) {
            grouped[q.category] = [];
        }
        grouped[q.category].push(q);
    });

    let html = "";

    for (let category in grouped) {

        html += `<h4 class="mt-4 text-primary">${category}</h4>`;

        grouped[category].forEach(q => {

            html += `
                <div class="card mb-2">
                    <div class="card-body">

                        <p><b>Q ${q.id} : </b> ${q.question}</p>

                        <button class="btn btn-sm btn-success" 
                                onclick="toggleAnswer(this)">
                            Show Answer
                        </button>

                        <div class="answer mt-2 d-none">
                            <p><b>Short:</b> ${q.shortAnswer}</p>
                            <p>${q.detailedAnswer}</p>

                            ${q.code ? `<pre><code class="language-csharp">${q.code}</code></pre>` : ''}
                            ${q.query ? `<pre><code class="language-sql">${q.query}</code></pre>` : ''}
                        </div>

                    </div>
                </div>
            `;
        });
    }

    document.getElementById("allQuestions").innerHTML = html;
    Prism.highlightAll();
}

function toggleAnswer(btn) {

    let answerDiv = btn.nextElementSibling;

    if (answerDiv.classList.contains("d-none")) {
        answerDiv.classList.remove("d-none");
        btn.innerText = "Hide Answer";
    } else {
        answerDiv.classList.add("d-none");
        btn.innerText = "Show Answer";
    }
}

function applyFilter() {

    let selected = document.getElementById("categoryFilter").value;

    let filtered = selected === "All"
        ? allQuestionsData
        : allQuestionsData.filter(q => q.category === selected);

    renderQuestions(filtered);
}