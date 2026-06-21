## 1. Selected System Capability

We selected **SC-1 – Inventory & Resource Tracking** from our original
Assignment 1 capability list.

SC-1 lets the group record and monitor their supplies — food, water, and gear —
and makes low levels visible before they become critical. We chose it because it
sits at the opposite end of the same journey SC-5 already supports: where SC-5
(Route Decision Support) decides *where* the Fellowship goes, SC-1 answers whether
they are actually equipped to get there. The two capabilities frame the same
journey from two sides — intent and capacity.

**Extension — Chart.js (library), not an API.** We deliberately chose a library
over an external API call. We looked for an API that would extend SC-1 both
cleanly and meaningfully — weather influencing consumption was our strongest
candidate, echoing Caradhras in SC-5 — but every option either introduced a *new*
capability instead of deepening SC-1, or added network and error-handling
complexity out of proportion to the value it returned. Chart.js instead changes
how the resource state is *read*: the journey-readiness ring and the live bars
turn a set of raw counts into an at-a-glance judgement of preparedness. That is
exactly the "make low levels visible before they become critical" intent of SC-1 —
the extension deepens the capability rather than bolting a new one onto it.

## 2. Mermaid Flow Diagram
```mermaid
%% SC-1 Inventory & Resource Tracking
%% A full pack is a brave heart; an empty one, a long road.
flowchart TD
A([Start]) --> B
B["Member opens Resource Manager<br>Sees rations, gear and journey readiness"]
B --> C
C["System loads inventory state<br>Single source of truth for all items"]
C --> D
D["Member adjusts an item<br>Adds or uses food, water or gear"]
D --> E
E["System updates inventory<br>Recalculates rations (food + water), gear, readiness"]
E --> F
F{Resource below threshold?}
F -- Yes --> G
F -- No, well stocked --> H
G["System flags shortage<br>Names the bottleneck resource"]
G --> H
H["System renders outputs<br>Confidence ring, ration count, item values"]
H --> I
I{Adjust further?}
I -- Yes --> D
I -- No --> J
J([End])
style A fill:#D3D1C7,stroke:#5F5E5A,color:#2C2C2A
style J fill:#D3D1C7,stroke:#5F5E5A,color:#2C2C2A
style F fill:#FAC775,stroke:#854F0B,color:#412402
style I fill:#FAC775,stroke:#854F0B,color:#412402
style B fill:#CECBF6,stroke:#534AB7,color:#26215C
style D fill:#CECBF6,stroke:#534AB7,color:#26215C
style C fill:#9FE1CB,stroke:#0F6E56,color:#04342C
style E fill:#9FE1CB,stroke:#0F6E56,color:#04342C
style G fill:#9FE1CB,stroke:#0F6E56,color:#04342C
style H fill:#9FE1CB,stroke:#0F6E56,color:#04342C
```

## 3. Wireframe
![wireframe](src/Wireframe_RessourceManager.png)

## 4. Implementation files
- [ResourceManager.js](src/resource-manager.js)
- [Interface.html](src/interface.html)
- [Style.css](src/style.css)

## 5. Reflection on system evolution

When we defined SC-1 in Phase 1, we pictured a fairly literal inventory: a list of
items with quantities and a flag when something ran low. Building it at the end of
the iteration changed our understanding in three ways.

**From itemised tracking to derived readiness.** 

Our Phase 1 view treated each
resource as a separate number to watch. Implementing it, we realised the group
doesn't actually care about "8 apples" — they care about whether the food, water
and lembas together add up to enough *rations* to keep going. So the system now
derives meaning from the raw counts: food and water combine into complete rations
(limited by the scarcest ingredient), and rations plus gear roll up into a single
journey-readiness figure. The numbers became inputs to a judgement rather than the
judgement itself.

**A single resource manager, on purpose.**

SC-5 was built around user selection —
members vote, Frodo breaks ties. For SC-1 we deliberately did not carry that model
over. A shared, single inventory removed a whole layer of complexity (per-user
state, conflict resolution) that would not have paid for itself here. It is also
narratively honest: early in the journey the Fellowship travels as one group, and
it is realistic that one member — Sam, in practice — takes ownership of the
provisions. The simplification is a design decision, not a shortcut.

**Where we stopped, and why.**

We know this model breaks down later in the journey.
Once the Fellowship splits into separate groups travelling apart, a single shared
inventory no longer reflects reality — each group would need its own resource state,
and keeping those in sync would require a functional backend and persistence. That
is well beyond the scope of this assignment, so we chose to make the early-journey
assumption explicit rather than build speculative machinery for a stage the course
does not ask us to reach.

The throughline across all three: extending a system does not have to mean reaching
outside it. The most honest extension we found was the one that made our existing
data more legible, not the one that added the most surface area.