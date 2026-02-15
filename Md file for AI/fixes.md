# profile-availability-cleanup.md
## Profile Page – Availability State Redundancy Fix

---

## Overview

The Profile card currently displays **multiple visual indicators** representing availability state.

This creates redundancy and weakens UI clarity.

This document defines the issue and the required fix.

---

## Current State (Observed)

There are three availability-related indicators:

1. Top-left toggle button  
   - Green switch labeled “Available”  
   - User-controlled state  

2. Status badge above avatar  
   - Displays “ACTIVE”  
   - Indicates platform presence  

3. Bottom disabled badge  
   - Displays “AVAILABLE”  
   - Non-interactive  

---

## Problem

The bottom “AVAILABLE” badge is redundant.

Reasons:

- Availability is already shown clearly via:
  - The toggle button
  - The visual active state indicator

- The bottom badge:
  - Adds no new information
  - Reduces visual hierarchy
  - Increases UI noise
  - Feels repetitive

---

## Required Change

### REMOVE:

The bottom disabled “AVAILABLE” badge component.

### KEEP:

- The top-left availability toggle (primary control)
- The “ACTIVE” badge near avatar

---

## Design Principle Applied

- Avoid redundant state representation
- Maintain clear visual hierarchy
- One primary state control is sufficient
- Supporting indicators should not duplicate meaning

---

## Technical Scope

Frontend only.

Do NOT:
- Modify availability state logic
- Modify database
- Remove toggle functionality
- Remove ACTIVE badge

Only remove the redundant UI element.

---

## Likely Code Location

Search for conditional rendering similar to:

```js
{isAvailable && (
  <Badge disabled>AVAILABLE</Badge>
)}
