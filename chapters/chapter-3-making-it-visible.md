# The Red Book of Westmarch – Chapter III: Making It Visible

"*The world is indeed full of peril and in it there are many dark places; but still there is much that is fair.*" - Haldir of Lothlorien

**Table of Contents**
- [The Red Book of Westmarch - Chapter III: Making It Visible](#the-red-book-of-westermarch---chapter-iii-making-it-visible)
  - [Summary](#summary)
  - [Artifact](#artifact)
  - [AI Assistance](#ai-assistance)
  - [Lessons Learned](#lessons-learned) 

---
  
## Summary
This chapter focuses on turning conceptual design into something visible and tangible.
Where Chapter II defined decisions and interactions, this phase was about exposing those ideas visually – through screens, a first design system, and concrete interface patterns.

We explored how structure, color, and hierarchy communicate intent long before logic is implemented. Making our ideas visible also revealed dependencies and inconsistencies that were hidden during conceptual work.

**Learning Outcomes**

Design becomes a shared language only when everyone can see it. Visualising an idea exposes weak points and sparks discussion earlier. The challenge is not only to design beautiful screens but to maintain clarity and structure within the team and the codebase that supports those visuals.

---

## Artifact
**[The Fellowship Companion – Artifact III: Making It Visible](https://github.com/Goldberries1180/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-3/artifact-3-representation.md)**

**Build**

We developed:

- Screen designs in Figma as a foundation for the look & feel
- A manual Figma design system, built by hand since automated generation was not supported
- Initial HTML / CSS implementations of selected screens for testing purposes
- A CSS structure proposal to improve maintainability

The focus was on representing how users perceive and navigate the system — not final aesthetics, but clarity of structure and communication.

**Focus**

- Translating conceptual ideas into visible screens
- Establishing a base for a design system
- Exploring consistency across multiple views
- Understanding how technical structure (CSS) influences visual clarity

---

### AI Assistance

AI was used to support in basic screen design.

**What did we expect?**
To use AI as an assistant for bug‑fixing, syntax help, and idea generation – but not for stylistic or structural decision‑making.

**What actually happened?**

AI assisted during:
- CSS / HTML debugging and code refinement
- Spot‑checks for layout issues
- Guidance and syntax hints during styling tasks

**How did AI help or mislead us?**

**Helpful**
- Quicker debugging of syntax and layout errors
- Idea generation for small layout adjustments
- Reduced trial‑and‑error time during development

**Misleading**
- Occasionally suggested overly generic solutions that conflicted with our naming conventions
- Did not always recognise project‑specific CSS interactions

**What decisions did we make consciously?**
- The design system was created manually in Figma, to keep creative control
- AI support was limited to diagnostic / technical help
- All structural and visual decisions remained with the team

**What would we do differently next time?**
- Establish clearer CSS conventions before coding
- Limit shared CSS files and favour modular structures
- Break up the stylesheet per screen or feature to avoid naming collisions

---

## Lessons Learned

  **Insights**
- Shared CSS in a group project quickly becomes complex and fragile
- Without modularisation, style dependencies cause unintentional side effects
- Clear class naming (e.g. .vote-*, .profile-*) increases traceability
- A visual prototype exposes design discussion points earlier and more productively

**Challenges**
- Maintaining CSS consistency while multiple people edit one file
- Distinguishing experimental styles from production styles
- Managing overlapping edit sessions in shared Figma files
- Aligning naming conventions across design and implementation

**Reflections**
- Modular CSS and per‑feature structure are crucial for maintainability
- Time invested in design‑system discipline pays off in later implementation stages
- AI is best used as a debugging and advisory tool, not a design decision‑maker

---
  
*The Goldberries – 2026*
