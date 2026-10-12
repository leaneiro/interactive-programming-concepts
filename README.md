# Interactive Programming Concepts

Step through classic algorithms and watch the code and the data structure move together.

Pick an algorithm and press play. Every step highlights the lines being executed, explains what is happening in plain words, and redraws the array, tree or graph.

## What is inside

| Algorithm      | Structure          | Languages          |
| -------------- | ------------------ | ------------------ |
| Bubble Sort    | Array              | TypeScript, Python |
| Selection Sort | Array              | TypeScript         |
| BST Search     | Binary search tree | TypeScript         |
| BST Insert     | Binary search tree | TypeScript         |
| BST Delete     | Binary search tree | TypeScript         |
| Graph BFS      | Graph              | TypeScript         |

Playback has play and pause, step forward and back, restart, a new random input, and a speed slider. The interface has light and dark themes and a resizable code panel.

## Getting started

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev
```

| Script                 | What it does                               |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the development server               |
| `npm run build`        | Type-check and build for production        |
| `npm run preview`      | Serve the production build locally         |
| `npm test`             | Run the test suite once                    |
| `npm run test:watch`   | Run the tests on every change              |
| `npm run lint`         | Lint with type-aware rules                 |
| `npm run format`       | Format every file with Prettier            |
| `npm run format:check` | Check formatting without changing anything |

## How it works

The whole design is three small ideas.

**An algorithm is a pure function that returns a trace.** `trace(input)` runs the real algorithm and records a `Step` at every interesting moment. A step is plain data:

```ts
interface Step {
  region: string;
  note: string;
  state: VisualState;
}
```

`region` names the part of the code that is running, `note` explains it, and `state` is a complete snapshot of what to draw.

**A snippet maps regions to lines.** Each algorithm ships its source code in one or more languages, and each snippet says which lines a region covers. Tracers never mention line numbers, so the same trace drives every language, and switching language keeps your place.

**A view draws a state.** `VisualState` is a union of `ArrayState`, `TreeState` and `GraphState`, and each one has a React component that renders it.

Nothing mutable sits in between. Playing, stepping back and switching language all come down to showing `steps[stepIndex]`.

## Project structure

```
src/
  algorithms/
    algorithm.ts      Algorithm, Step, Snippet and defineAlgorithm
    languages.ts      languages a snippet can be written in
    index.ts          the catalog shown in the interface
    bubble-sort/
      index.ts        name, snippets and the region-to-lines mapping
      trace.ts        the instrumented algorithm
      typescript.txt  the code shown in the panel
  structures/         one folder per data structure: state, layout and view
  components/         interface pieces
  hooks/              playback, theme and the resizable panel
  lib/                random helpers, storage and the syntax highlighter
```

## Adding an algorithm

Say you want linear search.

1. Create `src/algorithms/linear-search/` and save the code to display as `typescript.txt`.

2. Write `trace.ts`. List the regions of the code you want to highlight, then run the algorithm and record a step whenever something worth showing happens.

   ```ts
   import type { Step } from "@/algorithms/algorithm";
   import type { ArrayState } from "@/structures/array/arrayState";

   export type LinearSearchRegion =
     "signature" | "compare" | "found" | "notFound";

   export interface LinearSearchInput {
     values: readonly number[];
     target: number;
   }

   type LinearSearchStep = Step<LinearSearchRegion, ArrayState>;

   export function traceLinearSearch({
     values,
     target,
   }: LinearSearchInput): LinearSearchStep[] {
     const steps: LinearSearchStep[] = [];

     function record(
       region: LinearSearchRegion,
       note: string,
       highlightedIndices: readonly number[] = [],
     ): void {
       steps.push({
         region,
         note,
         state: { kind: "array", values, highlightedIndices },
       });
     }

     record("signature", `Look for ${target}`);

     for (const [valueIndex, value] of values.entries()) {
       record("compare", `Is ${value} equal to ${target}?`, [valueIndex]);

       if (value === target) {
         record("found", `Found it at index ${valueIndex}`, [valueIndex]);
         return steps;
       }
     }

     record("notFound", `${target} is not in the array`);

     return steps;
   }
   ```

3. Write `index.ts`. It names the algorithm, says how to create a random input, and maps every region to lines of the snippet.

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
       },
     ],
   });
   ```

   The compiler checks the mapping: a region that the tracer uses but the snippet forgets, or a misspelled one, is a type error.

4. Add `linearSearch` to the list in `src/algorithms/index.ts`. It shows up in the interface, and `catalog.test.ts` starts checking that its regions point at real lines.

5. Add a `trace.test.ts` next to the tracer. Tracers are pure functions, so the tests are short. The existing ones are good models.

To offer an existing algorithm in another language, add the code as a new `.txt` file and one more entry in `snippets`. For a language the project does not know yet, also add it to `languages.ts` and give it a grammar in `src/lib/shikiHighlighter.ts`.

## Adding a data structure

1. Create `src/structures/<name>/` with a state type that has its own `kind`, and a view component that renders it.
2. Add the state to the `VisualState` union in `src/structures/visualState.ts`.
3. Add a case to `StructureView.tsx`. The compiler points out the missing case if you forget.

## Conventions

- Names say what things are, in full words. The linter rejects one-letter identifiers other than `x` and `y`.
- No comments. If a piece of code needs one, rename or extract until it does not.
- Tracers are pure. They never change their input, and every step carries its own snapshot.
- Run `npm run lint`, `npm run format` and `npm test` before opening a pull request. CI runs the same checks.

## License

[MIT](LICENSE)
