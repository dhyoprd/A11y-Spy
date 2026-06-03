# Project Brief: A11y-Spy

## Project Name

A11y-Spy

## One-Line Description

A11y-Spy is a VS Code extension that detects accessibility issues in web code in real time and helps developers fix them before they reach production.

## Background

Web accessibility is often checked too late in the development process. Many teams only audit accessibility near release time, while solo developers may skip it completely.

This creates preventable barriers for users with disabilities.

A11y-Spy solves this by moving accessibility feedback directly into the editor, where developers already spend most of their time.

## Problem Statement

Developers need fast, clear, and contextual accessibility feedback while coding, not only after deployment or during manual audits.

## Target Users

Primary users:

- Frontend developers.
- Web developers.
- UI engineers.
- Students learning HTML, CSS, and React.
- Open-source maintainers.

Secondary users:

- Accessibility advocates.
- QA engineers.
- Design system teams.
- Developer educators.

## Goals

- Help developers catch accessibility issues earlier.
- Reduce common accessibility mistakes.
- Make WCAG guidance easier to understand.
- Provide quick fixes for safe and basic issues.
- Encourage accessibility-first development habits.

## Non-Goals

A11y-Spy is not intended to replace:

- Full accessibility audits.
- Screen reader testing.
- Manual keyboard testing.
- Browser-based accessibility tools.
- Legal compliance review.

## MVP Scope

The first version focuses on:

- Missing `alt` attributes on image elements.
- Low text/background color contrast.
- Basic quick fixes.
- Diagnostics inside VS Code.
- Documentation for contributors.

## Success Metrics

- Extension can detect missing image alt attributes in HTML, JSX, and TSX.
- Extension can warn about low contrast in basic CSS.
- Extension provides at least one safe quick fix.
- Rules have automated tests.
- New contributors can run the project locally using documentation.
