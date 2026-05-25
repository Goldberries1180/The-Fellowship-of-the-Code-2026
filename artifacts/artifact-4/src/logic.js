// ============================================================
// THE FELLOWSHIP COMPANION – Logic & State (Artifact IV)
// SC-5: Route Decision Support
// ============================================================


// ============================================================
// CONSTANTS & STATE
// ============================================================

const FELLOWSHIP = [
    'Aragorn', 'Frodo', 'Sam', 'Merry', 'Pippin',
    'Boromir', 'Gandalf', 'Gimli', 'Legolas'
];

const state = {
    currentUser: 'Frodo',
    currentScreen: 'screen-empty',
    decision: {
        initiator: null,
        criticality: 'non-critical',
        options: [],    // { name, risks, source }
        voters: [],
        deadline: null
    },
    votes: {},          // { 'Frodo': { option, comment } }
    result: {}          // { winner, tiebreak, tiebreakByFrodo }
};


// ============================================================
// SCREEN MANAGEMENT
// ============================================================

function showScreen(screen) {
    state.currentScreen = screen;
    document.querySelectorAll('.screen')
        .forEach(s => s.classList.remove('is-active'));
    document.getElementById(screen).classList.add('is-active');
}


// ============================================================
// FORM: NEW VOTE
// ============================================================

function validateForm() {
    const option1Name = document.getElementById('option1-name').value.trim();
    const option2Name = document.getElementById('option2-name').value.trim();
    const voters = Array.from(document.querySelectorAll('input[name="vote"]:checked'));
    const votersValid = state.decision.criticality === 'critical' || voters.length > 0;
    const isValid = option1Name && option2Name && votersValid;
    document.getElementById('btn-start-voting').disabled = !isValid;
}

function collectFormData() {
    state.decision.initiator = state.currentUser;
    state.decision.options = [
        {
            name: document.getElementById('option1-name').value.trim(),
            risks: document.getElementById('option1-risks').value.trim(),
            source: document.getElementById('option1-source').value
        },
        {
            name: document.getElementById('option2-name').value.trim(),
            risks: document.getElementById('option2-risks').value.trim(),
            source: document.getElementById('option2-source').value
        }
    ];

    // Voters: all Fellowship if critical, else selected checkboxes
    state.decision.voters = state.decision.criticality === 'critical'
        ? [...FELLOWSHIP]
        : Array.from(document.querySelectorAll('input[name="vote"]:checked')).map(cb => cb.value);

    // Deadline: 24h if critical, 1h if non-critical
    const minutes = state.decision.criticality === 'critical' ? 1 : 5;
    state.decision.deadline = new Date(Date.now() + minutes * 60 * 1000);
}


// ============================================================
// VOTE STATS (shared between render functions)
// ============================================================

function getVoteStats() {
    const voted = Object.keys(state.votes).length;
    const total = state.decision.voters.length;
    return {
        initiator: state.decision.initiator,
        voted,
        total,
        percent: total > 0 ? Math.round((voted / total) * 100) : 0,
        title: state.decision.options.map(o => o.name).join(' or ')
    };
}


// ============================================================
// RENDER: VOTING SCREEN
// ============================================================

function renderVotingScreen() {
    const stats = getVoteStats();
    document.getElementById('vote-title').textContent = stats.title;
    document.getElementById('vote-initiator').textContent = stats.initiator;
    document.getElementById('vote-count').textContent = stats.voted;
    document.getElementById('vote-total').textContent = stats.total;

    const container = document.getElementById('vote-options-cards');
    container.innerHTML = '';
    state.decision.options.forEach(option => {
        container.innerHTML += `
            <label class="card card--voting vote-card">
                <input type="radio" name="route" value="${option.name}">
                <span class="vote-card__content">
                    <strong>${option.name}</strong>
                    <span>Known Risks: ${option.risks}</span>
                    <span>Source: ${option.source}</span>
                </span>
            </label>
        `;
    });
}


// ============================================================
// RENDER: PENDING SCREEN
// ============================================================

function renderPendingScreen() {
    const stats = getVoteStats();
    document.getElementById('vote-title_pending').textContent = stats.title;
    document.getElementById('vote_init_pending').textContent = 'Vote initiated by ' + stats.initiator;
    document.getElementById('currentUser_vote').textContent = state.votes[state.currentUser]?.option || '–';
    document.getElementById('collected_votes').textContent = stats.voted;
    document.getElementById('full_votes').textContent = stats.total;
    document.querySelector('.pending-bar__fill').style.width = stats.percent + '%';
    document.getElementById('percent_complete').textContent = stats.percent + '% complete';
    document.getElementById('vote_timer').textContent = 'Vote ends ' + state.decision.deadline.toLocaleTimeString();
}


// ============================================================
// TIMER
// ============================================================

let voteInterval;

function getTimeRemaining() {
    return Math.max(0, Math.ceil((new Date(state.decision.deadline) - new Date()) / 1000));
}

function formatTimeRemaining(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

function updateVoteTimer() {
    const remainingSeconds = getTimeRemaining();
    const allVotesSubmitted = Object.keys(state.votes).length >= state.decision.voters.length;

    document.getElementById('vote_timer').textContent = formatTimeRemaining(remainingSeconds);

    if (remainingSeconds <= 0 || allVotesSubmitted) {
        clearInterval(voteInterval);
        renderResultsScreen();
        showScreen('screen-results');
    }
}


// ============================================================
// VOTE RESOLUTION
// ============================================================

function resolveVotes() {
    const counts = {};
    state.decision.options.forEach(o => counts[o.name] = 0);
    Object.values(state.votes).forEach(v => {
        if (counts[v.option] !== undefined) counts[v.option]++;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const [firstName, firstCount] = sorted[0];
    const [, secondCount] = sorted[1] || [null, 0];

    if (firstCount === secondCount) {
        const frodoVote = state.votes['Frodo'];
        const frodoIsVoter = state.decision.voters.includes('Frodo');
        state.result = {
            winner: (frodoVote && frodoIsVoter) ? frodoVote.option : firstName,
            tiebreak: true,
            tiebreakByFrodo: frodoIsVoter && !!frodoVote
        };
    } else {
        state.result = {
            winner: firstName,
            tiebreak: false
        };
    }
}


// ============================================================
// RENDER: RESULTS SCREEN
// ============================================================

function renderResultsScreen() {
    resolveVotes();
    const allVoted = Object.keys(state.votes).length >= state.decision.voters.length;
    const timeUp = getTimeRemaining() <= 0;
    const voteFinished = allVoted || timeUp;

    const counts = {};
    state.decision.options.forEach(o => counts[o.name] = 0);
    Object.values(state.votes).forEach(v => {
        if (counts[v.option] !== undefined) counts[v.option]++;
    });
    document.getElementById('results-title').textContent = voteFinished
    ? 'The Path is Chosen'
        : 'Current Standings';

    const winner = state.result.winner;

    const sortedOptions = state.decision.options.slice().sort((a, b) => {
        if (a.name === winner) return -1;
        if (b.name === winner) return 1;
        return counts[b.name] - counts[a.name];
    });

    const container = document.getElementById('result-cards-container');
    container.innerHTML = '';
    sortedOptions.forEach(option => {
        const isWinner = option.name === winner;
        container.innerHTML += `
            <article class="card card--results ${isWinner ? 'is-chosen' : 'is-lost'} result-card">
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
            </article>
        `;
    });

    document.getElementById('result-tiebreak').textContent = state.result.tiebreak
        ? state.result.tiebreakByFrodo
            ? 'Tie broken by Frodo.'
            : 'Tie – first option chosen by default.'
        : '';

    document.getElementById('result-timestamp').textContent =
        'Decision recorded at ' + new Date().toLocaleTimeString();
    document.getElementById('btn-new-decision').style.display = voteFinished ? 'block' : 'none';
}


// ============================================================
// POPULATE: DYNAMIC ELEMENTS
// ============================================================

function populateSourceDropdowns() {
    ['option1-source', 'option2-source'].forEach(id => {
        const select = document.getElementById(id);
        FELLOWSHIP.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            select.appendChild(option);
        });
    });
}

function populateVoterCheckboxes() {
    const grid = document.getElementById('checkbox-grid');
    grid.innerHTML = '';

    const addLabel = (member, parent) => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" name="vote" value="${member}" checked> ${member}`;
        label.querySelector('input').addEventListener('change', validateForm);
        parent.appendChild(label);
    };

    if (FELLOWSHIP.length <= 5) {
        FELLOWSHIP.forEach(member => addLabel(member, grid));
    } else {
        const left = document.createElement('div');
        left.className = 'checkbox-column';
        const right = document.createElement('div');
        right.className = 'checkbox-column';
        const half = Math.ceil(FELLOWSHIP.length / 2);
        FELLOWSHIP.forEach((member, i) => addLabel(member, i < half ? left : right));
        grid.appendChild(left);
        grid.appendChild(right);
    }
}

function populateUserSwitcher() {
    const select = document.getElementById('user-select');
    FELLOWSHIP.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        if (member === state.currentUser) option.selected = true;
        select.appendChild(option);
    });
}


// ============================================================
// EVENT LISTENERS
// ============================================================

// Navigation
document.getElementById('new-vote-button')
    .addEventListener('click', () => {
        showScreen('screen-new-vote');
        validateForm();
    });

document.getElementById('btn-back-to-empty')
    .addEventListener('click', () => showScreen('screen-empty'));

// Criticality toggle
const criticalityToggle = document.getElementById('criticality-toggle');
criticalityToggle.addEventListener('change', (e) => {
    state.decision.criticality = e.target.checked ? 'critical' : 'non-critical';
    document.getElementById('voter-selection').style.display = e.target.checked ? 'none' : 'block';
    validateForm();
});

// Form validation on name inputs
['option1-name', 'option2-name'].forEach(id => {
    document.getElementById(id).addEventListener('input', validateForm);
});

// Start vote
document.getElementById('btn-start-voting')
    .addEventListener('click', () => {
        collectFormData();
        renderVotingScreen();
        showScreen('screen-voting');
    });

// Submit vote
document.getElementById('btn-submit-vote')
    .addEventListener('click', () => {
        const selected = document.querySelector('input[name="route"]:checked');
        if (!selected) return;

        state.votes[state.currentUser] = {
            option: selected.value,
            comment: document.getElementById('reason').value.trim()
        };

        renderPendingScreen();
        showScreen('screen-pending');
        clearInterval(voteInterval);
        updateVoteTimer();
        voteInterval = setInterval(updateVoteTimer, 1000);
    });

// See results
document.getElementById('show_results')
    .addEventListener('click', () => {
        renderResultsScreen();
        showScreen('screen-results');
    });

// New decision
document.getElementById('btn-new-decision')
    .addEventListener('click', () => {
        state.decision = { initiator: null, criticality: 'non-critical', options: [], voters: [], deadline: null };
        state.votes = {};
        state.result = {};
        showScreen('screen-new-vote');
    });

// User switcher (F2)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F2') {
        document.getElementById('user-switcher').classList.toggle('is-visible');
    }
});

document.getElementById('user-select')
    .addEventListener('change', (e) => {
        state.currentUser = e.target.value;
        document.getElementById('current-user-badge').textContent = state.currentUser;

        if (state.decision.voters.length > 0) {
            const allVoted = Object.keys(state.votes).length >= state.decision.voters.length;
            const timeUp = getTimeRemaining() <= 0;
            const voteFinished = allVoted || timeUp;

            if (voteFinished) {
                renderResultsScreen();
                showScreen('screen-results');
            } else if (!state.decision.voters.includes(state.currentUser)) {
                showScreen('screen-empty');
            } else if (state.votes[state.currentUser]) {
                renderPendingScreen();
                showScreen('screen-pending');
            } else {
                renderVotingScreen();
                showScreen('screen-voting');
            }
        }
    });


// ============================================================
// INIT
// ============================================================

function init() {
    showScreen('screen-empty');
    populateSourceDropdowns();
    populateVoterCheckboxes();
    populateUserSwitcher();
}

init();