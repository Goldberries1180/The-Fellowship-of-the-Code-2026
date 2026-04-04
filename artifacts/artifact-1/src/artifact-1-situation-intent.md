# The Fellowship Companion – Artifact I: Situation & Intent

*"I will take the Ring, though I do not know the way." — Frodo Baggins, The Fellowship of the Ring*

---

## Table of Contents

- [1. Situation](#1-situation)
- [2. Intent](#2-intent)
- [3. Value](#3-value)
- [4. System Capabilities](#4-system-capabilities)
- [5. Assumptions & Constraints](#5-assumptions--constraints)

---

## 1. Situation

The Fellowship stands at the foot of the Misty Mountains, blocked by an unnatural storm. Five hobbits are among its members — resourceful, loyal, and determined, but without the experience of seasoned warriors or wizards. They face a critical and unresolved decision: push over Caradhras, or descend into the Mines of Moria. The problem they face is threefold:

**Route uncertainty:** Neither option is safe, and the group lacks reliable intelligence about what lies ahead on either path. A wrong decision cannot easily be reversed — it costs time, supplies, and potentially lives. Information is incomplete and contested, and key members of the Fellowship disagree on the right path forward.

**Survival and supply pressure:** The hobbits carry limited food and supplies from the Shire. These deplete daily, and resupply opportunities are scarce and unpredictable. Without a shared system to track what they have, the group risks running critically short with no warning — and no plan.

**Coordination and cohesion:** Five hobbits making decisions together is harder than it sounds. Responsibilities are unspoken, tasks are forgotten under stress, and the group can lose track of one another in unfamiliar or dangerous terrain.

**Why this is non-trivial:** Each challenge compounds the others. A detour drains supplies faster. Hunger undermines decision-making. A member falling behind puts the whole group at risk. Without a system that connects routing, survival, and coordination, the group is always reacting — never preparing.

---

## 2. Intent

The Fellowship Companion supports Frodo and the hobbits in maintaining awareness of their current situation — their position, remaining resources, route options, and group status — so they can make informed decisions at each stage of the journey. It exists because the hobbits lack the experience and contextual knowledge that other Fellowship members have, making even basic planning decisions uncertain and risky without structure.

The decisions remain with the hobbits — the system helps them see clearly before they decide.

The application explicitly does not cover combat support, calling for external rescue, communication with Rivendell or anyone outside the Fellowship, or general Middle Earth knowledge.

---

## 3. Value

Without this tool, the group relies on memory, verbal agreements, and improvised coordination. Food is tracked mentally. Tasks are assumed rather than assigned. Key decisions — like which route to take — are made without a structured view of the trade-offs. Without visibility of their resources, the Fellowship risks committing to a route they cannot sustain, potentially getting stranded with no warning.

Furthermore, because the hobbits make up nearly half the Fellowship but lack the experience and situational awareness of other members, decisions default to authority rather than the best available option. This exclusion weakens group cohesion over time. In the worst case, disengaged hobbits wander off or separate unnecessarily — making them vulnerable to capture and putting the entire mission at risk.

In short: the tool does not make the journey easier — it makes it less likely to fail due to things the group could have seen coming.

---

## 4. System Capabilities

**SC-1 – Inventory & Resource Tracking**
The system must allow the group to record and monitor their current supplies: food, water, and equipment. It must make low levels visible before they become critical, and support the group in understanding what they still have — and what they are running out of.

**SC-2 – Food Sourcing Support**
The system must help the group identify and plan opportunities to obtain food along the journey. This includes logging known sources, flagging when resupply is urgently needed, and supporting rationing decisions when supplies run low.

**SC-3 – Task & Responsibility Management**
The system must enable the group to assign tasks to specific members and track whether those tasks are completed. Every member must be able to see what they and others are responsible for.

**SC-4 – Group Location & Cohesion Tracking**
The system must give every member visibility into where the group is and where each companion is — especially in situations where the group risks being separated. No hobbit should be lost without the others knowing.

**SC-5 – Route Decision Support**
The system must provide a structured way to compare route options, document the risks and trade-offs of each, and record what the group decided and why — ensuring critical choices are made with shared information, not assumption or authority alone.

**SC-6 – Journey Progress Tracking**
The system must allow the group to track their progress toward Mordor: waypoints reached, stages remaining, and notable events encountered. This supports ongoing planning and maintains a shared sense of where they stand on the journey.

---

## 5. Assumptions & Constraints

### Assumptions

**Information bias**
- *Assumption:* Information entered into the system reflects the personal experience and bias of the member providing it, not objective fact.
- *Implication:* The system must indicate the source of each piece of information so users can weigh its reliability accordingly.

**Trust between members**
- *Assumption:* Not all Fellowship members share information honestly or with the group's best interest in mind (e.g. Boromir's susceptibility to the Ring, distrust between Gimli and Legolas).
- *Implication:* The system cannot treat all inputs as equally reliable and may need to consider access controls or per-user information visibility.

**Device availability**
- *Assumption:* Smartphone-like devices exist and function in Middle Earth.
- *Implication:* The system is designed for a mobile interface and does not need to account for alternative input methods.

**Update regularity**
- *Assumption:* Information is updated regularly, ideally at rest points like the evening campfire — but updates are not always possible in crisis situations.
- *Implication:* The system must handle outdated or missing data gracefully, flagging when information was last updated so users know how current it is.

**Technical literacy**
- *Assumption:* All Fellowship members have sufficient technical literacy to use a simple browser-based tool without prior training.
- *Implication:* The system does not need to account for onboarding or special accessibility features beyond basic usability.

### Constraints

**No network infrastructure**
- *Constraint:* Middle Earth has no cell towers or network infrastructure. The system must operate on peer-to-peer connections.
- *Implication:* Real-time synchronisation cannot be guaranteed. The system must function with potentially outdated local data.

**Limited userbase**
- *Constraint:* The userbase is limited to a maximum of 9 Fellowship members.
- *Implication:* The system cannot rely on crowd-sourced data, historical patterns, or external knowledge — all information is limited to what these 9 people know and enter.

**Hostile environment limits usage**
- *Constraint:* The system can only be actively used when environmental conditions permit. The Fellowship cannot be expected to input or access information during combat, extreme weather, or other crisis situations.
- *Implication:* The system must be designed for intermittent use and not depend on real-time input to remain functional. Interactions must be fast and simple.

**Enemy awareness**
- *Constraint:* The group must remain undetected. The system must not communicate outside the Fellowship.
- *Implication:* The system stores no information that could endanger the group if discovered.

**Information incompleteness**
- *Constraint:* The hobbits rarely have full information — data is often partial or estimated (e.g. "roughly 2 days of food left", "enemies suspected but unconfirmed ahead").
- *Implication:* The system must remain useful when data is incomplete and must not require precision to function.

---

*The Goldberries – 2026*
