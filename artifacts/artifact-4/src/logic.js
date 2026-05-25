const FELLOWSHIP = [
    'Aragorn', 'Frodo', 'Sam', 'Merry', 'Pippin',
    'Boromir', 'Gandalf', 'Gimli', 'Legolas'
];
const state = {
    currentUser: 'Frodo',
    currentScreen: 'screen-empty',
    decision: {
        options: [
            // { name: '', risks: '', source: '' }
        ],
        voters: []
    },
    votes: {}
    // { 'Frodo': { option: 'Caradhras', comment: '' } }
}
function showScreen(screen) {
    state.currentScreen = screen;
    document.querySelectorAll('.screen')
        .forEach(s => s.classList.remove('is-active'));
    document.getElementById(screen).classList.add('is-active');
}
function init() {
    showScreen('screen-empty');
}
document.getElementById('new-vote-button')
    .addEventListener('click', () => {
        showScreen('screen-new-vote');
    });
document.getElementById('btn-back-to-empty')
    .addEventListener('click', () => {
        showScreen('screen-empty');
});
document.getElementById('btn-start-voting')
    .addEventListener('click', () => {
        showScreen('screen-voting');
    });
document.getElementById('criticality-toggle')
    .addEventListener('change', (e) => {
        state.decision.criticality = e.target.checked ? 'critical' : 'non-critical';
    })
function collectFormData() {
    state.decision.options = [
        {
        name: document.getElementById('option1-name').value.trim(),
        risks: document.getElementById('option1-risks').value.trim(),
        source: document.getElementById('option1-source').value.trim()
        },
        {
        name: document.getElementById('option2-name').value.trim(),
        risks: document.getElementById('option2-risks').value.trim(),
        source: document.getElementById('option2-source').value.trim()
        },
    ];

    state.decision.voters = Array.from(
        document.querySelectorAll('input[name="vote"]:checked')
    ).map(cb => cb.value);

    // Deadline change based on criticality
    const hours = state.decision.criticality === 'critical' ? 24 : 1;
    state.decision.deadline = new Date(Date.now() + hours * 60 * 60 * 1000);
}
document.getElementById('btn-start-voting')
    .addEventListener('click', () => {
        collectFormData();
        renderVotingScreen();
        showScreen('screen-voting');
});
function renderVotingScreen() {
    document.getElementById('vote-title').textContent =
        state.decision.options.map(o => o.name).join(' or ');

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
    })}

let voteInterval;

document.getElementById('btn-submit-vote')
    .addEventListener('click', () => {
        const selected = document.querySelector('input[name="route"]:checked');
        if (!selected) return;
        const comment = document.getElementById('reason').value.trim();

        state.votes[state.currentUser] = {
            option: selected.value,
            comment: comment
        };
        const criticalityToggle = document.getElementById('criticality-toggle'); //Set Deadline for Voting depending on critical-setting
        const voteDurationSeconds = criticalityToggle.checked ? 60 : 300;
        state.decision.deadline = new Date(Date.now() + voteDurationSeconds * 1000);

        renderPendingScreen();
        showScreen('screen-pending');
        clearInterval(voteInterval);
        updateVoteTimer();
        voteInterval = setInterval(updateVoteTimer, 1000);
    });


function getTimeRemaining() {
    const now = new Date();
    const deadline = new Date(state.decision.deadline);
    const remainingSeconds = Math.max(0, Math.ceil((deadline - now) / 1000)); //Calculate remaining seconds until deadline, ensuring it doesn't go negative
    return remainingSeconds;
}

function formatTimeRemaining(seconds) { //function to format remaining time in MM:SS format
    const minutes = Math.floor(seconds / 60); //Calculate whole minutes from total seconds
    const remainingSeconds = seconds % 60; //Modulo operator to get remaining seconds after calculating minutes

    return String(minutes).padStart(2, '0') + ':' + String(remainingSeconds).padStart(2, '0'); //Format minutes and seconds as two-digit strings and concatenate with colon
}

function updateVoteTimer() {
    const remainingSeconds = getTimeRemaining(); //Get remaining seconds until voting deadline
    const allVotesSubmitted = Object.keys(state.votes).length >= state.decision.voters.length; //Check if all voters have submitted their votes by comparing the number of votes with the number of voters

    document.getElementById('vote_timer').textContent = formatTimeRemaining(remainingSeconds); //Update the timer display with formatted remaining time
    if (remainingSeconds <= 0 || allVotesSubmitted) { //Check if time has run out or if all votes have been submitted
        clearInterval(voteInterval);
        showScreen('screen-results'); //Automatically show results screen when timer reaches zero
    }
}

function renderPendingScreen() {
    document.getElementById('vote-title_pending').textContent =
        state.decision.options.map(o => o.name).join(' or ');
    document.getElementById('vote_init_pending').textContent = 'Vote initiated by ' + state.currentUser;
    document.getElementById('currentUser_vote').textContent = state.votes[state.currentUser].option;
    document.getElementById('collected_votes').textContent = Object.keys(state.votes).length;
    document.getElementById('full_votes').textContent = state.decision.voters.length;
    const percent = Math.round(Object.keys(state.votes).length / state.decision.voters.length * 100);
    document.querySelector('.pending-bar__fill').style.width = percent + '%';
    document.getElementById('percent_complete').textContent = percent + '% complete';
    document.getElementById('vote_timer').textContent = 'Vote ends ' + state.decision.deadline.toLocaleTimeString();
}
document.getElementById('show_results')
    .addEventListener('click', () => {
        showScreen('screen-results');
});
init();