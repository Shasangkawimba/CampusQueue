# CampusQueue Design System (Apple-esque Utility Canon)

## Visual Identity
The queue system has been entirely redesigned using the **Apple-esque Utility** visual canon. This direction was chosen to eradicate any generic "AI-slop" aesthetic and replace it with a high-fidelity, maximally polished interface akin to modern macOS system settings or Linear's utility screens.

### Core Principles
1. **Pristine Utility**: Information density is high, but cognitive load is low. The interface gets out of the way to surface exact queue statuses.
2. **Absolute Monochrome + Single Accent**: We use stark contrasts (true black, pure white, precise greys) accented strictly by a highly saturated iOS-style blue (`#0066cc` / `#0a84ff`).
3. **True Bento Box / Glass Panels**: Depth is established not by arbitrary drop shadows, but through deliberate backdrop filters (`blur(24px) saturate(150%)`) layered over a clean grid, mimicking frosted glass.
4. **Typographic Hierarchy**: `Inter` and `San Francisco` (-apple-system) are used exclusively. Weights jump deliberately from stark `semibold` headers to `medium` micro-labels. Wait times and ticket numbers use rigid `mono` fonts for scanning efficiency.

## Core Components
- **The Dashboard**: A macOS Settings-inspired dual-pane view with a highly compressed left sidebar and a dense, data-rich table view on the right.
- **The Queue Pass**: Modeled after an Apple Wallet pass. The public facing ticket features a bold "cutout" aesthetic, a stepper progression, and hyper-legible ticket numbers.
- **The Glass Bento Grid**: A strict masonry of panels replacing all traditional cards. 

## Provenance
This design is Canon. Execution was purely code-led. All artifacts produced during the decision seed round are retained in `.impeccable/mocks/decision/` but were bypassed in favor of the standard utility exit. No AI-slop utility classes or recursive wrapper `div`s remain.
