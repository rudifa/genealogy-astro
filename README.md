# genealogy-astro

#### A simple genealogy graph viewer + editor built with Astro

## Features

- **Interactive Family Tree:** View and edit your family tree visually, in your browser.
- **Persons**: The family tree consists of persons, each with their _Name_ and optionally their _Mother_, _Father_ and _Info_.
- **Multi-Tree Management:** Create and manage multiple family trees, all within your browser.
- **Easy Editing:** Add, edit, and remove people with a simple dialog. Add and remove family trees.
- **Multilingual:** Full user experience in English, French, and German.
- **Persistent Storage:** Your work is automatically saved in your browser's local storage.
- **Responsive Design:** Works on desktop, laptop, tablet, and mobile.
- **Live Demo:** Published on Vercel at [genealogy-astro.vercel.app](https://genealogy-astro.vercel.app/)
- **File Download/Upload:** Save your trees to your computer or tablet for backup or sharing, and load them back anytime.
- **Print Tree:** Print the displayed family tree graph.

## Missing features

- Load multiple files and merge them

## Possible features

- add photo/image to a person

## Screenshot

![Example family tree](img/example-family-tree.png)

## Implementation Details

- The revised implementation uses a global appState object (based on a State module).
- appState provides subscribe/notify event handling.
- appState exposes action functions for Astro component scripts to update the data model.
- Components subscribe to state changes, call actions, and access data via appState.

This pattern is commonly known as the Observer pattern (for the subscribe/notify mechanism) combined with a centralized state management approach. In frontend development, this is often referred to as a "state container" or "store" pattern. Popular libraries like Redux, Zustand, or Vuex use similar concepts.

In summary, the revised implementation uses a global state container with observer/event subscription, sometimes called a "reactive store" or "observable state management."

This implementation is conceptually similar to how SwiftUI manages state and UI updates, though there are differences in language and framework specifics:

- Both use a centralized state management approach:
  - In this app, appState acts as a global store with subscribe/notify (observer pattern).
  - In SwiftUI, @State, @ObservedObject, and @EnvironmentObject provide reactive state containers.

- Both enable components (views) to subscribe to state changes and automatically update when the state changes.

- Both encourage unidirectional data flow:
  - Actions/methods update the state, which then notifies subscribers (components/views) to re-render.

Key differences:

- SwiftUI’s reactivity and view updates are built into the language and framework, with property wrappers and automatic view invalidation.
- This implementation is manual, using JavaScript/TypeScript and custom observer logic.
