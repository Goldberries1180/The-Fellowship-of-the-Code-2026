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
    populateSourceDropdowns();
    populateVoterCheckboxes();
    populateUserSwitcher();
}
document.getElementById('new-vote-button')
    .addEventListener('click', () => {
        showScreen('screen-new-vote');
    });
document.getElementById('btn-back-to-empty')
    .addEventListener('click', () => {
        showScreen('screen-empty');
});

const criticalityToggle = document.getElementById('criticality-toggle'); //Set Deadline for Voting depending on critical-setting
    criticalityToggle.addEventListener('change', (e) => {
        state.decision.criticality = e.target.checked ? 'critical' : 'non-critical';
        document.getElementById('voter-selection').style.display = e.target.checked ? 'none' : 'block';
    });
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

    if (state.decision.criticality === 'critical') {
        state.decision.voters = FELLOWSHIP;
    }
    else {
        state.decision.voters = Array.from(
            document.querySelectorAll('input[name="vote"]:checked')
        ).map(cb => cb.value);
    }
    // Deadline change based on criticality
    const hours = state.decision.criticality === 'critical' ? 24 : 1;
    state.decision.deadline = new Date(Date.now() + hours * 60 * 60 * 1000);
}
document.getElementById('btn-start-voting')
    .addEventListener('click', () => {
        collectFormData();
        renderVotingScreen();
        showScreen('screen-voting');

        const voteDurationSeconds = criticalityToggle.checked ? 60 : 300;
        state.decision.deadline = new Date(Date.now() + voteDurationSeconds * 1000);
});
function getVoteStats() {
    return {
        initiator: state.currentUser,
        voted: Object.keys(state.votes).length,
        total: state.decision.voters.length,
        percent: Math.round(Object.keys(state.votes).length / state.decision.voters.length * 100),
        title: state.decision.options.map(o => o.name).join(' or ')
    };
}
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
    const stats = getVoteStats();
    document.getElementById('vote-title_pending').textContent = stats.title;
    document.getElementById('vote_init_pending').textContent = 'Vote initiated by ' + stats.initiator;
    document.getElementById('currentUser_vote').textContent = state.votes[state.currentUser].option;
    document.getElementById('collected_votes').textContent = stats.voted;
    document.getElementById('full_votes').textContent = stats.total;
    document.querySelector('.pending-bar__fill').style.width = stats.percent + '%';
    document.getElementById('percent_complete').textContent = stats.percent + '% complete';
    document.getElementById('vote_timer').textContent = 'Vote ends ' + state.decision.deadline.toLocaleTimeString();
}
document.getElementById('show_results')
    .addEventListener('click', () => {
        showScreen('screen-results');
});
function populateSourceDropdowns() {
    ['option1-source', 'option2-source'].forEach(id => {
        const select = document.getElementById(id);
        FELLOWSHIP.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            select.appendChild(option);
        });
    })}
function populateVoterCheckboxes() {
    const grid = document.getElementById('checkbox-grid');
    grid.innerHTML = '';

    if (FELLOWSHIP.length <= 5) {
        FELLOWSHIP.forEach(member => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="vote" value="${member}" checked>${member}></input>`;
            grid.appendChild(label);
        })
    }
    else {
        const left =document.createElement('div');
        left.className = 'checkbox-column';
        const right = document.createElement('div');
        right.className = 'checkbox-column';

        const half = Math.ceil(FELLOWSHIP.length / 2);

        FELLOWSHIP.forEach((member, i) => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="vote" value="${member}" checked>${member}</input>`;
            if (i < half) left.appendChild(label);
            else right.appendChild(label);
        });
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
        if (!state.decision.voters.includes(state.currentUser)) {
            showScreen('screen-empty');
        } else if (state.votes[state.currentUser]) {
            showScreen('screen-pending');
            renderPendingScreen();
        } else {
            showScreen('screen-voting');
            renderVotingScreen();
        }
    }
    });
init();