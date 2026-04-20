# The Red Book of Westmarch - Chapter II: Deciding
"*All we have to decide is what to do with the time that is given us.*" – Gandalf

**Table of Contents**
- [The Red Book of Westmarch - Chapter II: Deciding](#the-red-book-of-westmarch---chapter-ii-deciding)
  - [Summary](#summary)
  - [Artifact](#artifact)
  - [AI Assistance](#ai-assistance)
  - [Lessons Learned](#lessons-learned)

---

## Summary

This chapter reflects how we translated the conceptual foundation from Chapter I into a concrete interaction design.
The focus was on one selected capability — SC-5: Route Decision Support — and how it can be expressed through a structured flow and screens.

Wireframes and a flow diagram represent the full interaction — from initiating a decision to recording the outcome. Defining the system behaviour in full made the complexity of the feature tangible in a way the concept alone did not.

**Learning Outcomes**

Turning a concept into an interaction design makes visible where decisions still need to be made — and those decisions cannot be delegated to AI. We learnt that wireframe scope needs to be agreed before work starts, not worked out along the way. Tools need to be mastered before the work begins — in this phase, Mermaid. Figma was new to parts of the team, which added coordination overhead that shared tool familiarity would have reduced.

---

## Artifact

**[The Fellowhip Companion - Artifact II: Deciding](../artifacts/artifact-2/src/artifact-2-deciding.md)**

**Build**

We developed:

- Four wireframes showing the full interaction across four key screens:
  - Adding a decision
  - Voting
  - Waiting
  - Outcome
- A flow diagram describing:
  - Creating a new vote
  - The voting process
  - Handling incomplete participation
  - Decision logic (majority, timeout, tiebreaker)

The wireframes focus on how users interact with the system; the flow diagram defines how the system behaves in the background.
Four wireframes were necessary — the feature has four distinct states, and each requires its own screen to function.

**Focus**

- Turning a concept into a working interaction  
- Designing for group decisions, not individual use  
- Giving structure without taking over the decision  
- Keeping the system in a supporting role, not a judging one  
- Deciding how much detail the wireframes and flow needed  

---

### AI Assistance  

AI was used to support the technical creation of the flow diagram, but not to define its logic.  

**What did we expect?**  
We expected AI to help with Mermaid syntax while keeping all flow logic and structure defined by us.  

**What actually happened?**  
AI was used exclusively to assist with the flow diagram. It helped generate Mermaid code, which accelerated the process.
Because we had already familiarised ourselves with Mermaid syntax beforehand, we were able to review, debug, and correct the output effectively. The actual flow logic was fully defined by the team. Wireframes were created in Figma without any AI support.  

**How did AI help or mislead us?**  

**Helpful**  
- Accelerated the generation of Mermaid syntax and reduced time on formatting
- Provided a working starting point that could be corrected rather than built from scratch

**Misleading**  
- AI filled ambiguous gaps silently — it did not flag uncertainty, which required careful manual review to catch
- AI used outdated or incorrect Mermaid syntax, which required manual correction

**What decisions did we make consciously?**  
- AI was used only for technical assistance in flowchart creation — not for defining logic or structure
- The interaction flow and all decision rules were defined entirely by the team
- Wireframing was done in Figma without AI to retain full control over design decisions
- All generated Mermaid code was manually reviewed and corrected before use

**What would we do differently next time?**  
- Define the full flow logic by hand sketches before generating any diagram code — AI performs better with a fully specified input

---

## Lessons Learned

**Insights**
- A clear conceptual foundation makes translating into interaction significantly easier — ambiguities that survive Chapter I are exposed in Chapter II
- Drawing a flow by hand is faster and more productive than working directly in Mermaid; sketching reveals structure, Mermaid enforces syntax
- The appropriate level of detail in a wireframe is not obvious
- Delivering multiple wireframes was a conscious and justified choice — one screen can hardly represent a multi-state feature

**Challenges**
- Determining the right level of wireframe detail — too rough loses meaning, too polished wastes time
- Defining how far to scope the content was harder than expected
- Work distribution was difficult due to overlapping and interdependent tasks

**Reflections**
- Wireframes are open to interpretation — alignment on the expected level of detail before starting is essential
- Flow diagrams are harder to create than they look, but they enforce a kind of rigour that no other artefact does
- AI works best when the problem and structure are already fully defined — it accelerates execution, not thinking
- Prior tool familiarity reduces friction and improves output quality; the time investment pays off within the same project

---

*The Goldberries – 2026*
