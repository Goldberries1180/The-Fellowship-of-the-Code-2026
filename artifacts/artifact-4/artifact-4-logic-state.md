# The Fellowship Companion – Artifact IV: Logic & State

## 1. System Capability

**SC-5: Route Decision Support**

The Fellowship Companion implements a structured group decision process for route choices. Any member can initiate a vote, all selected members are notified, and the outcome is determined by majority. In the event of a tie, Frodo holds the tiebreaker vote — but only if he was selected as a voter. If time runs out before all members have voted, the result is resolved based on the votes cast.

This capability was selected in Assignment 2 and implemented as a static interface in Assignment 3. Assignment 4 brings it to life.

### Which system capability are we implementing?

SC-5: Route Decision Support — a structured, multi-step group voting process with explicit state transitions.

### What state does this capability depend on or modify?

The capability depends on and modifies a single shared `state` object:

```javascript
const state = {
    currentUser: 'Frodo',         // simulated active user
    currentScreen: 'screen-empty', // navigation state
    decision: {
        initiator: null,           // who started the vote
        criticality: 'non-critical',
        options: [],               // [{ name, risks, source }]
        voters: [],                // selected members
        deadline: null             // vote end time
    },
    votes: {},                     // { 'Frodo': { option, comment } }
    result: {}                     // { winner, tiebreak, tiebreakByFrodo, timestamp }
};
```

State is modified at each transition: when a vote is created, when a member votes, and when the result is resolved.

### Why does this capability matter for the Fellowship at this stage of the journey?

Route decisions are among the highest-stakes choices the Fellowship faces. The wrong path — chosen without structure, under time pressure, or based on biased information — can cost lives. SC-5 ensures that decisions are made collectively, transparently, and with accountability: every vote is recorded, every source is tagged, and every outcome is traceable.

---

## 2. Implementation

**Source files:**

- [`artifacts/artifact-4/src/interface.html`](../src/interface.html) — five screens in a single file, toggled via JavaScript
- [`artifacts/artifact-4/src/style.css`](../src/style.css) — visual styles, largely carried over from Assignment 3
- [`artifacts/artifact-4/src/logic.js`](../src/logic.js) — all logic and state

### How the interface now works

The five screens from Assignment 3 (empty, new vote, voting, pending, results) are now connected by JavaScript. No page navigation occurs — `showScreen()` toggles CSS classes to show one screen at a time while `state.currentScreen` tracks where the user is.

Each screen is rendered dynamically from state:

- `renderVotingScreen()` — builds option cards from `state.decision.options`
- `renderPendingScreen()` — shows live vote progress from `state.votes`
- `renderResultsScreen()` — resolves and displays the outcome via `resolveVotes()`

### User Switcher

A hidden developer tool (F2 to toggle) simulates multiple Fellowship members using the app. When the active user changes, the app routes them to the correct screen based on their vote status — this allows a full vote cycle to be demonstrated without a backend.

---

## 3. Design Rationale

### How does the logic support the intent and value from Assignment 1?

Assignment 1 identified three core risks TFC addresses: resource risk (poor route choices), participatory risk (decisions made without full input), and cohesion risk (members acting on different information).

The implementation addresses all three directly:

- **Resource risk**: the vote forces structured deliberation before a route is chosen
- **Participatory risk**: voters must be explicitly selected; critical votes automatically include all members
- **Cohesion risk**: every risk entry has a mandatory source tag (dropdown from the Fellowship array), making information provenance visible to all voters

### How does the implemented behavior reflect the flow and wireframe from Assignment 2?

The flow from Assignment 2 defined seven stages: initiation → notification → voting → collection → majority check → tiebreaker → outcome. All seven are implemented:

- Initiation: `collectFormData()` captures the decision and sets the deadline
- Notification: simulated via the User Switcher routing voters to `screen-voting`
- Voting: `renderVotingScreen()` renders options dynamically; submit saves to `state.votes`
- Collection: `updateVoteTimer()` runs on interval; advances on timeout or full participation
- Majority check: `resolveVotes()` counts votes and identifies the winner
- Tiebreaker: Frodo's vote wins ties — but only if he was a selected voter
- Outcome: `renderResultsScreen()` displays winner, vote split, tiebreak note, and timestamp

The wireframes from Assignment 2 defined the screen structure and form layout. The implementation follows them directly: voter selection above options, source dropdown per option, progress bar and timer on the pending screen, and result cards sorted by vote count.

### What constraints or assumptions shaped the logic?

- **No backend, no persistence**: all state lives in memory. The User Switcher exists precisely because there is no authentication — it is a test tool, not a feature.
- **No external libraries**: plain JavaScript throughout, as required.
- **Fixed Fellowship**: the `FELLOWSHIP` array is the single source of truth for voters, source dropdowns, and the user switcher. Changing it updates all three automatically.
- **Criticality affects scope and deadline**: critical votes include all members and last 1 minute (demo); non-critical votes allow voter selection and last 5 minutes. This directly reflects the constraint from Assignment 2.
- **Frodo as tiebreaker only if selected**: if Frodo was excluded from a vote, he cannot override its outcome. This was a deliberate constraint — tiebreaker authority requires participation.

### What did we deliberately not implement?

- **Real multi-user support**: the User Switcher simulates this, but a real implementation would require authentication and a shared data layer.
- **Persistent history**: past decisions are lost on page reload. A decision log (SC-4) is defined in Assignment 1 but out of scope here.
- **Third option support**: the architecture supports it (`options` is an array), but the form is fixed at two options. Extending to three would require UI changes beyond this assignment's scope.
- **Push notifications**: Assignment 2 defined a notification step. Here it is simulated by the User Switcher routing members to the voting screen.