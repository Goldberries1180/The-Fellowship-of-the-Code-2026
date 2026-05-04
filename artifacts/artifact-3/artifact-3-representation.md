# The Fellowship Companion – Artifact III: Representation

*The Goldberries – 2026*

---

## Table of Contents

- [1. Selected System Capability](#1-selected-system-capability)
- [2. Static Interface Implementation](#2-static-interface-implementation)
- [3. Design Rationale](#3-design-rationale)

---

## 1. Selected System Capability

**SC-5 – Route Decision Support**

The system provides a structured way to compare route options, document the risks and trade-offs of each, and record what the group decided and why — ensuring critical choices are made with shared information, not assumption or authority alone.

**Why this capability matters at this stage of the journey:**
The Fellowship stands at exactly the kind of decision point SC-5 is built for: two routes, contested information, and members with different experience and bias. Without a structured process, the decision defaults to whoever speaks loudest. SC-5 gives every member — including the hobbits — equal visibility and an equal voice before the group commits to a path.

---

## 2. Static Interface Implementation

The implementation consists of five screens, each represented as a separate HTML file sharing a single CSS file. Navigation between screens is handled via static HTML links.

→ Supporting code: [`src/style.css`](src/style.css)

**Note:** The assignment brief specifies a single `interface.html` file. Given that SC-5 has five distinct states, each requiring its own screen, we made a deliberate decision to split the implementation across five HTML files. This better reflects the flow defined in Assignment 2 and makes the capability navigable as a static prototype.

### Screens

**[`src/voting_empty.html`](src/voting_empty.html) – Empty State**
The entry point of the flow. Shown when no active decision exists. Provides a starting screen that the wireframes assumed but did not explicitly define.

**[`src/new_voting.html`](src/new_voting.html) – New Route Decision (Initiator)**
The member who initiates the decision names the options, sets criticality, documents known risks, tags a source for each option, and selects who should vote. The source field is a dropdown limited to Fellowship members. An info icon with tooltip explains the criticality toggle. The "Who should vote?" section appears above the route options.

**[`src/voting_screen.html`](src/voting_screen.html) – Route Decision (Voter)**
All notified members see the same screen: the question, the options with their risks and sources, and an optional comment field. Members select an option before submitting.

**[`src/pending.html`](src/pending.html) – Waiting**
After submitting a vote, the member sees their own choice confirmed and a live count of how many members have responded. The result is not shown until the vote closes.

**[`src/result.html`](src/result.html) – Outcome**
Once the vote closes, all members see the result: the winning route, the vote split, and the losing option for reference. The outcome is logged in the journey record.

---

## 3. Design Rationale

**How does this interface support the intent and value defined in Assignment 1?**
The interface is built around the core value from Assignment 1: reducing poor decisions made under uncertainty by replacing authority-driven choices with structured, visible group input. Every screen reinforces this — the creation screen forces the initiator to document risks and tag a source before sending, the voting screen shows every member the same information simultaneously, and the outcome screen makes the result and vote split visible to all. No single member can dominate the process through the interface.

**How does it reflect the wireframe from Assignment 2?**
The four core screens map directly to the wireframes: creation, voting, waiting, and outcome. One addition was made — an empty state as a defined entry point, since the wireframes assumed the user was already in the flow. The "Who should vote?" section was moved above the route options based on lecturer feedback from Assignment 2. The criticality toggle received an info icon with a tooltip to address the feedback that its meaning was not self-evident in the wireframe.

**What was deliberately not implemented yet?**
The toggle does not switch states, form inputs are not validated, links between screens are static and do not carry state, and no data is persisted. These are all JavaScript concerns and outside the scope of this assignment. The interface represents structure and hierarchy — not behavior.

**What assumptions or constraints shaped your decisions?**
A shared `style.css` governs all screens to ensure visual consistency — the same typography, spacing, and components appear throughout. The dark color scheme reflects the tone of Middle Earth and the constraint from Assignment 1 that the system must not draw attention or endanger the group. The source dropdown remains limited to Fellowship members, consistent with the closed userbase constraint established in Assignment 1.

---

*Stored in `artifacts/artifact-3/artifact-3-representation.md`*
*Supporting files: `artifacts/artifact-3/src/new_voting.html` · `artifacts/artifact-3/src/voting_screen.html` · `artifacts/artifact-3/src/pending.html` · `artifacts/artifact-3/src/result.html` · `artifacts/artifact-3/src/voting_empty.html` · `artifacts/artifact-3/src/style.css`*
