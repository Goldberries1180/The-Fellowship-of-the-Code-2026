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
function collectFormData(form) {
    state.decision.options = [
        {
        name: document.getElementById('option1-name').value,
        risks: document.getElementById('option1-risks').value,
        source: document.getElementById('option1-source').value
        },
        {
        name: document.getElementById('option2-name').value,
        risks: document.getElementById('option2-risks').value,
        source: document.getElementById('option2-source').value
        },
    ];
    state.decision.voters = Array.from(
        document.querySelectorAll('input[name="vote"]:checked')
    ).map(cb => cb.value);
}
init();