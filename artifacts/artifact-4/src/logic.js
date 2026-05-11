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
init();