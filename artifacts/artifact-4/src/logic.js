// ============================================================
// THE FELLOWSHIP COMPANION – Logic & State (Artifact IV)
// SC-5: Route Decision Support
// ============================================================

// ============================================================
// CONSTANTS
// ============================================================

const FELLOWSHIP = [
    'Frodo', 'Sam', 'Merry', 'Pippin',
    'Gandalf', 'Aragorn', 'Legolas', 'Gimli', 'Boromir'
];

const TIEBREAKER = 'Frodo';

// ============================================================
// STATE
// ============================================================

const state = {
    currentUser: 'Frodo',
    currentScreen: 'empty',

    decision: {
        initiator: null,
        criticality: 'non-critical',
        options: [],   // [{ name, risks, source }]
        voters: [],    // ['Frodo', 'Sam', ...]
        deadline: null // Date object
    },

    votes: {}
    // { 'Frodo': { option: 'Caradhras', comment: '...' } }
};

// ============================================================
// SCREEN MANAGEMENT
// ============================================================

function showScreen(name) {
    document.querySelectorAll('.screen')
        .forEach(s => s.classList.remove('is-active'));
    document.getElementById(`screen-${name}`)
        .classList.add('is-active');
    state.currentScreen = name;
}

// ============================================================
// USER SWITCHER (Dev Tool – F2)
// ============================================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'F2') {
        document.getElementById('user-switcher')
            .classList.toggle('is-visible');
    }
});

document.getElementById('user-select')
    .addEventListener('change', (e) => {
        state.currentUser = e.target.value;
        updateGreeting();
    });

function updateGreeting() {
    document.getElementById('user-name').textContent = `Hello, ${state.currentUser}`;
    document.getElementById('vote-initiator').textContent = state.currentUser;
}

// ============================================================
// INIT – Befüllt dynamische Elemente beim Laden
// ============================================================

function init() {
    populateVoterCheckboxes();
    populateSourceDropdowns();
    populateUserSwitcher();
    updateGreeting();
}

function populateUserSwitcher() {
    const select = document.getElementById('user-select');
    FELLOWSHIP.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        select.appendChild(option);
    });
}

function populateVoterCheckboxes() {
    const container = document.getElementById('voter-checkboxes');
    const left = document.createElement('div');
    left.className = 'checkbox-column';
    const right = document.createElement('div');
    right.className = 'checkbox-column';

    FELLOWSHIP.forEach((member, i) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'vote';
        input.value = member;
        input.checked = true;
        input.addEventListener('change', validateForm);
        label.appendChild(input);
        label.appendChild(document.createTextNode(member));

        if (i < 5) left.appendChild(label);
        else right.appendChild(label);
    });

    container.appendChild(left);
    container.appendChild(right);
}

function populateSourceDropdowns() {
    ['option-1-source', 'option-2-source'].forEach(id => {
        const select = document.getElementById(id);
        FELLOWSHIP.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            select.appendChild(option);
        });
    });
}

// ============================================================
// SCREEN: EMPTY
// ============================================================

document.getElementById('btn-create-decision')
    .addEventListener('click', () => {
        showScreen('new-vote');
    });

// ============================================================
// SCREEN: NEW VOTE
// ============================================================

document.getElementById('btn-back-from-new-vote')
    .addEventListener('click', () => {
        showScreen('empty');
    });

// Criticality Toggle
document.getElementById('criticality-toggle')
    .addEventListener('change', (e) => {
        state.decision.criticality = e.target.checked ? 'critical' : 'non-critical';

        const labelActive = document.getElementById('label-non-critical');
        const labelInactive = document.getElementById('label-critical');

        if (e.target.checked) {
            labelActive.classList.remove('new-switch__option--active');
            labelActive.classList.add('new-switch__option--inactive');
            labelInactive.classList.remove('new-switch__option--inactive');
            labelInactive.classList.add('new-switch__option--active');
        } else {
            labelActive.classList.add('new-switch__option--active');
            labelActive.classList.remove('new-switch__option--inactive');
            labelInactive.classList.add('new-switch__option--inactive');
            labelInactive.classList.remove('new-switch__option--active');
        }

        validateForm();
    });

// Validation – Button nur aktiv wenn alle Felder ausgefüllt
function validateForm() {
    const option1Name = document.getElementById('option-1-name').value.trim();
    const option1Risks = document.getElementById('option-1-risks').value.trim();
    const option2Name = document.getElementById('option-2-name').value.trim();
    const option2Risks = document.getElementById('option-2-risks').value.trim();

    const voters = Array.from(
        document.querySelectorAll('#voter-checkboxes input:checked')
    ).map(cb => cb.value);

    const isValid =
        option1Name !== '' &&
        option1Risks !== '' &&
        option2Name !== '' &&
        option2Risks !== '' &&
        voters.length > 0;

    document.getElementById('btn-start-vote').disabled = !isValid;
    document.getElementById('validation-hint').style.display = isValid ? 'none' : 'block';
}

// Input listeners für Live-Validierung
['option-1-name', 'option-1-risks', 'option-2-name', 'option-2-risks']
    .forEach(id => {
        document.getElementById(id)
            .addEventListener('input', validateForm);
    });

// Form Submit – startet die Abstimmung
document.getElementById('form-new-vote')
    .addEventListener('submit', (e) => {
        e.preventDefault();

        // State befüllen
        state.decision.initiator = state.currentUser;
        state.decision.options = [
            {
                name: document.getElementById('option-1-name').value.trim(),
                risks: document.getElementById('option-1-risks').value.trim(),
                source: document.getElementById('option-1-source').value
            },
            {
                name: document.getElementById('option-2-name').value.trim(),
                risks: document.getElementById('option-2-risks').value.trim(),
                source: document.getElementById('option-2-source').value
            }
        ];
        state.decision.voters = Array.from(
            document.querySelectorAll('#voter-checkboxes input:checked')
        ).map(cb => cb.value);

        // Deadline basierend auf Criticality
        const hours = state.decision.criticality === 'critical' ? 24 : 1;
        state.decision.deadline = new Date(Date.now() + hours * 60 * 60 * 1000);

        // Votes zurücksetzen
        state.votes = {};

        renderVotingScreen();
        showScreen('voting');
    });

// ============================================================
// SCREEN: VOTING
// ============================================================

document.getElementById('btn-back-from-voting')
    .addEventListener('click', () => {
        showScreen('new-vote');
    });

function renderVotingScreen() {
    const { options, initiator, voters } = state.decision;
    const votedCount = Object.keys(state.votes).length;

    document.getElementById('vote-title').textContent =
        options.map(o => o.name).join(' or ') + '?';
    document.getElementById('vote-initiator').textContent = initiator;
    document.getElementById('vote-count').textContent = votedCount;
    document.getElementById('vote-total').textContent = voters.length;

    // Option Cards rendern
    const container = document.getElementById('vote-options-container');
    container.innerHTML = '';

    options.forEach(option => {
        const label = document.createElement('label');
        label.className = 'card card--voting vote-card';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'route';
        input.value = option.name;
        input.addEventListener('change', () => {
            document.getElementById('btn-submit-vote').disabled = false;
        });

        const content = document.createElement('span');
        content.className = 'vote-card__content';
        content.innerHTML = `
            <strong>${option.name}</strong>
            <span>Known Risks: <b>${option.risks}</b></span>
            <span>Source: ${option.source}</span>
        `;

        label.appendChild(input);
        label.appendChild(content);
        container.appendChild(label);
    });
}

document.getElementById('btn-submit-vote')
    .addEventListener('click', () => {
        const selected = document.querySelector('#vote-options-container input[name="route"]:checked');
        if (!selected) return;

        const comment = document.getElementById('reason').value.trim();

        // Vote speichern
        state.votes[state.currentUser] = {
            option: selected.value,
            comment: comment
        };

        renderPendingScreen();
        showScreen('pending');
    });

// ============================================================
// SCREEN: PENDING
// ============================================================

function renderPendingScreen() {
    const { options, initiator, voters, deadline } = state.decision;
    const votedCount = Object.keys(state.votes).length;
    const percent = Math.round((votedCount / voters.length) * 100);

    document.getElementById('pending-title').textContent =
        options.map(o => o.name).join(' or ') + '?';
    document.getElementById('pending-initiator').textContent = initiator;
    document.getElementById('pending-your-vote').textContent =
        state.votes[state.currentUser]?.option || '–';
    document.getElementById('pending-voted').textContent = votedCount;
    document.getElementById('pending-total').textContent = voters.length;
    document.getElementById('pending-percent').textContent = `${percent}% complete`;
    document.getElementById('pending-bar-fill').style.width = `${percent}%`;
    document.getElementById('pending-deadline').textContent =
        deadline ? deadline.toLocaleTimeString() : '–';
}

// Simuliert die restlichen Votes (Demo-Zwecke)
document.getElementById('btn-simulate-votes')
    .addEventListener('click', () => {
        const { voters, options } = state.decision;

        voters.forEach(voter => {
            if (!state.votes[voter]) {
                // Zufällige Option wählen
                const randomOption = options[Math.floor(Math.random() * options.length)];
                state.votes[voter] = { option: randomOption.name, comment: '' };
            }
        });

        renderPendingScreen();
    });

document.getElementById('btn-see-results')
    .addEventListener('click', () => {
        resolveVotes();
        renderResultScreen();
        showScreen('result');
    });

// ============================================================
// VOTE RESOLUTION – Mehrheit / Tiebreaker
// ============================================================

function resolveVotes() {
    const { options, voters } = state.decision;

    // Stimmen zählen
    const counts = {};
    options.forEach(o => counts[o.name] = 0);

    Object.values(state.votes).forEach(vote => {
        if (counts[vote.option] !== undefined) {
            counts[vote.option]++;
        }
    });

    // Gewinner ermitteln
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [firstName, firstCount] = sorted[0];
    const [, secondCount] = sorted[1] || [null, 0];

    let winner = firstName;
    let tiebreak = false;

    // Gleichstand – Frodo entscheidet
    if (firstCount === secondCount) {
        tiebreak = true;
        const frodoVote = state.votes[TIEBREAKER];
        winner = frodoVote ? frodoVote.option : options[0].name;
    }

    state.result = {
        winner,
        counts,
        tiebreak,
        timestamp: new Date()
    };
}

// ============================================================
// SCREEN: RESULT
// ============================================================

function renderResultScreen() {
    const { winner, counts, tiebreak, timestamp } = state.result;
    const { options } = state.decision;

    const container = document.getElementById('result-cards-container');
    container.innerHTML = '';

    // Optionen sortiert nach Stimmen
    const sorted = options.slice().sort((a, b) => counts[b.name] - counts[a.name]);

    sorted.forEach(option => {
        const isWinner = option.name === winner;
        const article = document.createElement('article');
        article.className = `card card--results ${isWinner ? 'is-chosen' : 'is-lost'} result-card`;
        article.innerHTML = `
            <div class="result-card__content">
                <div class="result-card__left">
                    ${isWinner ? '<span class="result-card__badge">Chosen</span>' : ''}
                    <h2 class="result-card__route-type">${isWinner ? 'Chosen Route' : 'Alternative Route'}</h2>
                    <p class="result-card__route-name">${option.name}</p>
                </div>
                <div class="result-card__right">
                    <strong class="result-card__votes">${counts[option.name]} votes</strong>
                </div>
            </div>
        `;
        container.appendChild(article);
    });

    // Tiebreaker Hinweis
    const tiebreakNote = document.getElementById('result-tiebreak-note');
    tiebreakNote.textContent = tiebreak
        ? `Decided by ${TIEBREAKER} as tiebreaker.`
        : '';

    // Timestamp
    document.getElementById('result-timestamp').textContent =
        `Decision recorded at ${timestamp.toLocaleTimeString()}`;
}

document.getElementById('btn-new-decision')
    .addEventListener('click', () => {
        // State zurücksetzen
        state.decision = {
            initiator: null,
            criticality: 'non-critical',
            options: [],
            voters: [],
            deadline: null
        };
        state.votes = {};
        state.result = {};

        // Form zurücksetzen
        document.getElementById('form-new-vote').reset();
        document.getElementById('btn-start-vote').disabled = true;
        document.getElementById('validation-hint').style.display = 'block';

        showScreen('empty');
    });

// ============================================================
// START
// ============================================================

init();