# algo.lab

Step through classic algorithms and watch the code, the data and the variables move together.

Pick an algorithm and press play. Every step highlights the lines being executed, redraws the array, tree or graph, updates the memory and the variables, and explains in plain words what just happened.

## What is inside

| Algorithm      | Structure          | Languages                         |
| -------------- | ------------------ | --------------------------------- |
| Bubble Sort    | Array              | TypeScript, Python, Java, C++, Go |
| Selection Sort | Array              | TypeScript, Python, Java, C++, Go |
| BST Search     | Binary search tree | TypeScript, Python, Java, C++, Go |
| BST Insert     | Binary search tree | TypeScript, Python, Java, C++, Go |
| BST Delete     | Binary search tree | TypeScript, Python, Java, C++, Go |
| BFS            | Graph              | TypeScript, Python, Java, C++, Go |

The studio has a timeline you can scrub, a history you can click, a memory and variables panel, and light and dark themes.

| Key     | Action                |
| ------- | --------------------- |
| `Space` | Play or pause         |
| `←` `→` | Previous or next step |
| `Home`  | First step            |
| `End`   | Last step             |
| `⌘K`    | Search the algorithms |

## Getting started

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

| Script                    | What it does                                      |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Start the development server                      |
| `npm run build`           | Type-check and build for production               |
| `npm run preview`         | Serve the production build locally                |
| `npm test`                | Run the test suite once                           |
| `npm run test:watch`      | Run the tests on every change                     |
| `npm run verify:snippets` | Run every displayed snippet and check its results |
| `npm run lint`            | Lint with type-aware rules                        |
| `npm run format`          | Format every file with Prettier                   |
| `npm run format:check`    | Check formatting without changing anything        |

## How it works

The whole design is four small ideas.

**An algorithm is a pure function that returns a trace.** `trace(input)` runs the real algorithm and records a `Step` at every interesting moment. A step is plain data, and each field feeds one part of the screen:

| Field                           | Where it shows                                         |
| ------------------------------- | ------------------------------------------------------ |
| `region`                        | The highlighted lines of code and the line indicator   |
| `state`                         | The stage and the memory panel                         |
| `caption`                       | The short summary at the end of the timeline           |
| `explanation`                   | The "What is happening" paragraph under the code       |
| `historyEntry`                  | One line in the history                                |
| `variables` / `activeVariables` | The variables panel, with the ones in use highlighted  |
| `counters`                      | The counters in the timeline, such as comparisons made |

**A snippet translates a trace into one language.** Each algorithm ships its source code in one or more languages. A snippet says which lines each region covers and what each variable is called in that language. Tracers never mention line numbers or variable names, so the same trace drives every language, and switching language keeps your place. Captions and explanations are rich text: `code(...)` marks a value, and `linesOf("region")` becomes "line 4" or "lines 5–7" for the language on screen.

**A snippet has to work.** The code on screen is not just text: `npm run verify:snippets` builds a small program around each snippet, runs it in its own language, and compares the results with what the tracer produced for the same inputs.

**A view draws a state.** `VisualState` is a union of `ArrayState`, `TreeState` and `GraphState`, and each one has a React component that renders it.

Nothing mutable sits in between. Playing, scrubbing the timeline and switching language all come down to showing `steps[stepIndex]`.

## Project structure

```
src/
  algorithms/
    algorithm.ts      Algorithm, Step, Snippet and defineAlgorithm
    richText.ts       rich, code and linesOf for captions and explanations
    categories.ts     groups shown in the sidebar
    languages.ts      languages a snippet can be written in
    index.ts          the catalog shown in the interface
    bubble-sort/
      index.ts        metadata, snippets, region and variable mappings
      trace.ts        the instrumented algorithm
      typescript.txt  the code shown in the panel
  structures/         one folder per data structure: state, layout and view
  components/         the pieces of the studio
  hooks/              playback, keyboard shortcuts and theme
  lib/                random helpers, storage and the syntax highlighter
verification/
  cases.ts            inputs for each algorithm, with results taken from its tracer
  languages/          one adapter per language: how to call a snippet and run it
  preludes/           support code placed around a snippet, per language
  snippets.verify.ts  runs every snippet of the catalog
```

## Adding an algorithm

Say you want linear search.

1. Create `src/algorithms/linear-search/` and save the code to display as `typescript.txt`.

2. Write `trace.ts`. List the regions of the code you want to highlight and the variables worth watching, then run the algorithm and record a step whenever something worth showing happens.

   ```ts
   import type {
     Step,
     StepDescription,
     VariableValue,
   } from "@/algorithms/algorithm";
   import { code, linesOf, rich } from "@/algorithms/richText";
   import type { ArrayState } from "@/structures/array/arrayState";

   export type LinearSearchRegion =
     "signature" | "compare" | "found" | "notFound";

   export type LinearSearchVariable = "target" | "index";

   export interface LinearSearchInput {
     values: readonly number[];
     target: number;
   }

   type LinearSearchStep = Step<
     LinearSearchRegion,
     ArrayState,
     LinearSearchVariable
   >;

   interface LinearSearchStepDescription extends StepDescription<
     LinearSearchRegion,
     LinearSearchVariable
   > {
     comparedIndices?: readonly number[];
   }

   export function traceLinearSearch({
     values,
     target,
   }: LinearSearchInput): LinearSearchStep[] {
     const steps: LinearSearchStep[] = [];
     const variables: Record<LinearSearchVariable, VariableValue> = {
       target,
       index: null,
     };
     let comparisonCount = 0;

     function record({
       comparedIndices = [],
       activeVariables = [],
       ...description
     }: LinearSearchStepDescription): void {
       steps.push({
         ...description,
         activeVariables,
         variables: { ...variables },
         counters: [{ label: "cmp", value: comparisonCount }],
         state: {
           kind: "array",
           name: "values",
           values,
           comparedIndices,
           sortedIndices: [],
         },
       });
     }

     record({
       region: "signature",
       caption: rich`look for ${code(target)}`,
       historyEntry: `linearSearch(values, ${target})`,
       explanation: rich`Linear search checks every position in order until it finds the target.`,
     });

     for (const [valueIndex, value] of values.entries()) {
       variables.index = valueIndex;
       comparisonCount++;

       if (value === target) {
         record({
           region: "found",
           caption: rich`${code(`${value} = ${target}`)} → found`,
           historyEntry: `cmp(${valueIndex}) → found`,
           comparedIndices: [valueIndex],
           activeVariables: ["index"],
           explanation: rich`${code(`values[${valueIndex}]`)} holds the target, so the search returns ${code(valueIndex)} (${linesOf("found")}).`,
         });
         return steps;
       }

       record({
         region: "compare",
         caption: rich`${code(`${value} ≠ ${target}`)} → next`,
         historyEntry: `cmp(${valueIndex}) → next`,
         comparedIndices: [valueIndex],
         activeVariables: ["index"],
         explanation: rich`${code(`values[${valueIndex}] = ${value}`)} is not the target (${linesOf("compare")}), so the search moves on.`,
       });
     }

     variables.index = null;

     record({
       region: "notFound",
       caption: rich`${code(target)} is not here`,
       historyEntry: "return -1",
       explanation: rich`Every position was checked and none of them holds ${code(target)}.`,
     });

     return steps;
   }
   ```

3. Write `index.ts`. It describes the algorithm, says how to create a random input, and gives each snippet its region and variable mappings.

   ```ts
   import { defineAlgorithm, line } from "@/algorithms/algorithm";
   import { pickRandom } from "@/lib/random";
   import { createRandomArray } from "@/structures/array/randomArray";
   import { traceLinearSearch, type LinearSearchInput } from "./trace";
   import typescriptCode from "./typescript.txt?raw";

   function createInput(): LinearSearchInput {
     const values = createRandomArray();

     return { values, target: pickRandom(values) };
   }

   export const linearSearch = defineAlgorithm({
     id: "linear-search",
     name: "Linear Search",
     category: "searching",
     complexity: "O(n)",
     traits: ["unsorted input"],
     createInput,
     trace: traceLinearSearch,
     snippets: [
       {
         languageId: "typescript",
         code: typescriptCode,
         regions: {
           signature: line(1),
           compare: line(3),
           found: line(4),
           notFound: line(7),
         },
         variableNames: {
           target: "target",
           index: "index",
         },
       },
     ],
   });
   ```

   The compiler checks the mappings: a region the tracer uses but the snippet forgets, a misspelled region inside `linesOf`, or an unknown variable is a type error. A variable that a language does not have can simply be left out of `variableNames`, and its chip is not shown.

4. Add `linearSearch` to the list in `src/algorithms/index.ts`. It shows up in the sidebar under its category, and `catalog.test.ts` starts checking that its regions point at real lines.

5. Add a `trace.test.ts` next to the tracer. Tracers are pure functions, so the tests are short. `bubble-sort/trace.test.ts` is a good model.

6. Add the algorithm to `verification/cases.ts`: a few inputs, each with the result its tracer ends on. `npm run verify:snippets` then runs your snippet against them.

To offer an existing algorithm in another language, add the code as a new `.txt` file and one more entry in `snippets`, then run `npm run verify:snippets`.

For a language the project does not know yet, also add it to `languages.ts`, give it a grammar in `src/lib/shikiHighlighter.ts`, and write its adapter in `verification/languages/`. The compiler refuses a language without an adapter, so nothing reaches the screen unverified.

## Verifying snippets

```sh
npm run verify:snippets
```

TypeScript and Python need nothing beyond `npm install`: TypeScript is compiled with the project's own compiler, and Python runs on Pyodide. Other languages use the toolchain on your machine, and a language you do not have installed is skipped with a note. CI has every toolchain and runs in strict mode, where a missing one is a failure.

| Language   | Runs with             |
| ---------- | --------------------- |
| TypeScript | `typescript` from npm |
| Python     | Pyodide from npm      |
| Java       | `java` on your `PATH` |
| C++        | `g++` on your `PATH`  |
| Go         | `go` on your `PATH`   |

An adapter says how to find the function in a snippet, how to write each kind of argument in that language, and how to run the resulting program. Arrays are enough for sorting; trees and graphs also need a prelude that defines the node type and builds the structure. When a check fails, the report names the call that went wrong and, for compile errors, prints the program that was run.

## Adding a data structure

1. Create `src/structures/<name>/` with a state type that has its own `kind`, and a view component that renders it.
2. Add the state to the `VisualState` union in `src/structures/visualState.ts`.
3. Add a case to `StructureView.tsx` and to `MemorySection.tsx`. The compiler points out the missing cases if you forget.

## Conventions

- Names say what things are, in full words. The linter rejects one-letter identifiers other than `x` and `y`.
- No comments. If a piece of code needs one, rename or extract until it does not.
- Tracers are pure. They never change their input, and every step carries its own snapshot.
- Step texts stay language-neutral: refer to lines with `linesOf`, avoid variable names that only exist in one snippet, and avoid literals such as `null` or `true`, which change from one language to the next. A variable that points at nothing holds `emptyReference`.
- Run `npm run lint`, `npm run format` and `npm test` before opening a pull request. CI runs the same checks.

## License

[MIT](LICENSE)
