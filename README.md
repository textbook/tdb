# TDB - test-driven Befunge

In this kata we're going to implement an interpreter for a simple programming language named [Befunge]. It's based on [this kata], but provides a more detailed test suite to allow you to test-drive your implementation.

## Setup

Clone this repository to your local machine and run `npm install` to install the dependencies.

You will edit `index.js` with your implementation, and `index.test.js` to remove `.skip` from each test as you go along.

You can run `npm test` (or `npm run test`, `npm t`) to run the tests in `index.test.js`. Once you've un-`.skip`ped all of the tests and they all pass, run `npm run validate`.

## Approach

This kata is set up to use a test-driven development (TDD) approach. Each iteration of the process looks like:

- **Red** - write a failing test
- **Green** - write the simplest code that gets the test to pass
- **Refactor** - clean up the code, keeping all of the tests passing

It can be difficult when you're new to TDD to plot a course through all of the possible functionality and write high quality tests, so the full test suite is already provided. That means that the **Red** step here is actually: delete the next `.skip` to enable the  next test (the first test is already enabled, so your first action will be to write some implementation to get it passing).

## Stack

A Befunge interpreter stores state in a data structure called the _stack_. The [stack] is a last-in, first-out (LIFO) collection that needs to support two operations\*:

- **Push** a value to the top of the stack:
    - `[ 1 2 3 ]` -> push a `4` to the top -> `[ 1 2 3 4 ]`
- **Pop** a value from the top of the stack:
    - `[ 1 2 3 ]` -> pop the `3` from the top -> `[ 1 2 ]`
    - `[ ]` -> pop from an empty stack gives `0` -> `[ ]`

In this case we're not going to worry about the maximum size of the stack. The stack must _always_ contain numbers - don't store any strings in it.

\* _The stack you use may support other operations, but these are the only two that Befunge requires._

## Code

A Befunge program is a series of characters on a 2D grid. This is represented in our tests as a string, e.g. `"74 |\n   @\n   #\n   ."` represents the program:

| ↓ y \ x → | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| 0 | `7` | `4` | ` ` | <code>&#124;</code> |
| 1 | ` ` | ` ` | ` ` | `@` |
| 2 | ` ` | ` ` | ` ` | `#` |
| 3 | ` ` | ` ` | ` ` | `.` |

## Interpreter

By default, the interpreter traverses the code from left to right, starting with the first character of the first row (x=0, y=0). Each character is an "instruction" that controls the behaviour of the program. Each step of the program runs as follows:

- Read the instruction from the current location
- Execute the instruction
- Move to the next location based on the current direction

If the new location is out of bounds, either horizontally or vertically, the interpreter "wraps" back around to the other side of the code.

The full instruction set is listed below, but to run through one of the examples from the test suite (from level 4, _"can conditionally move vertically"_):

 0. Start:

    ```none
    [7]4   |
           @
           #
           .
    ```

    Direction: `→`, stack: `[ ]`, output: `""`

 1. Push `7` to stack then move right:

    ```
     7[4]  |
           @
           #
           .
    ```

    Direction: `→`, stack: `[ 7 ]`, output: `""`

 2. Push `4` to stack then move right

    ```
     7 4[ ]|
           @
           #
           .
    ```
    Direction: `→`, stack: `[ 7 4 ]`, output: `""`

 3. Do nothing then move right

    ```
     7 4  [|]
           @
           #
           .
    ```

    Direction: `→`, stack: `[ 7 4 ]`, output: `""`

 4. Pop `4` from stack, change direction to up then move up (wrapping around)

    ```
     7 4   |
           @
           #
          [.]
    ```

    Direction: `↑`, stack: `[ 7 ]`, output: `""`

 5. Pop `7` from stack, send to output then move up

    ```
     7 4   |
           @
          [#]
           .
    ```

    Direction: `↑`, stack: `[ ]`, output: `"7"`

 6. Skip one cell in the current direction then move up

    ```
     7 4  [|]
           @
           #
           .
    ```

    Direction: `↑`, stack: `[ ]`, output: `"7"`
    
 7. Pop `0` from stack, change direction to down then move down

    ```
     7 4   |
          [@]
           #
           .
    ```

    Direction: `↓`, stack: `[ ]`, output: `"7"`
    
 8. End program and return output -> `"7"`

## Instruction set

The table below shows the full instruction set, in the order it's introduced by the test cases.

<table>
  <thead>
    <tr>
      <th>Instruction</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2"><strong>Level 1</strong> - horizontal movement</td>
    </tr>
    <tr>
      <td><code>@</code></td>
      <td>End the program and return the output.</td>
    </tr>
    <tr>
      <td><code> </code>&nbsp;(empty space)</td>
      <td>Do nothing.</td>
    </tr>
    <tr>
      <td><code>.</code></td>
      <td>Pop the top value from the stack and add it to the output.</td>
    </tr>
    <tr>
      <td><code>0</code>-<code>9</code> (digits)</td>
      <td>Push the value to the top of the stack, as a number.</td>
    </tr>
    <tr>
      <td><code>#</code></td>
      <td>Skip the next instruction (i.e. move an extra step in the current direction).</td>
    </tr>
    <tr>
      <td><code>&lt;</code></td>
      <td>Change current direction to right-to-left.</td>
    </tr>
    <tr>
      <td><code>_</code></td>
      <td>Pop the top value from stack, change current direction to left-to-right if the value is 0 otherwise right-to-left.</td>
    </tr>
    <tr>
      <td><code>&gt;</code></td>
      <td>Change current direction to left-to-right.</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Level 2</strong> - stack manipulation</td>
    </tr>
    <tr>
      <td><code>$</code></td>
      <td>Pop the top value from the stack and discard it.</td>
    </tr>
    <tr>
      <td><code>!</code></td>
      <td>Logical not - pop the top value from the stack and push 1 if the value is 0 otherwise 0 to the top of the stack.</td>
    </tr>
    <tr>
      <td><code>:</code></td>
      <td>Duplicate the value at the top of the stack (e.g. <code>[ 1 2 ]</code> to <code>[ 1 2 2 ]</code>).</td>
    </tr>
    <tr>
      <td><code>\</code></td>
      <td>Swap the two values at the top of the stack (e.g. <code>[ 1 2 3 ]</code> to <code>[ 1 3 2 ]</code>).</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Level 3</strong> - arithmetic</td>
    </tr>
    <tr>
      <td><code>+</code></td>
      <td>Pop the top two values from the stack and push their sum to the top of the stack (e.g. <code>[ 4 2 ]</code> to <code>[ 6 ]</code>).</td>
    </tr>
    <tr>
      <td><code>*</code></td>
      <td>Pop the top two values from the stack and push their product to the top of the stack (e.g. <code>[ 4 2 ]</code> to <code>[ 8 ]</code>).</td>
    </tr>
    <tr>
      <td><code>-</code></td>
      <td>Pop the top two values from the stack and push their difference to the top of the stack (e.g. <code>[ 4 2 ]</code> to <code>[ 2 ]</code>).</td>
    </tr>
    <tr>
      <td><code>/</code></td>
      <td>Pop the top two values from the stack and push their ratio, as an integer and rounded towards zero, to the top of the stack (e.g. <code>[ 5 2 ]</code> to <code>[ 2 ]</code>).</td>
    </tr>
    <tr>
      <td><code>%</code></td>
      <td>Pop the top two values from the stack and push the remainder of their division to the top of the stack (e.g. <code>[ 5 2 ]</code> to <code>[ 1 ]</code>).</td>
    </tr>
    <tr>
      <td><code>`</code> (backtick)</td>
      <td>Pop the top two values from the stack and push 1 if the second is larger than the first otherwise 0 to the top of the stack (e.g. <code>[ 5 2 ]</code> to <code>[ 1 ]</code>).</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Level 4</strong> - vertical movement</td>
    </tr>
    <tr>
      <td><code>v</code></td>
      <td>Change current direction to top-to-bottom.</td>
    </tr>
    <tr>
      <td><code>^</code></td>
      <td>Change current direction to bottom-to-top.</td>
    </tr>
    <tr>
      <td><code>|</code></td>
      <td>Pop the top value from stack, change current direction to top-to-bottom if the value is 0 otherwise bottom-to-top.</td>
    </tr>
    <tr>
      <td><code>?</code></td>
      <td>Change current direction to a random selection from left-to-right, right-to-left, top-to-bottom and bottom-to-top.</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Level 5</strong> - string mode</td>
    </tr>
    <tr>
      <td><code>"</code></td>
      <td>Toggle string mode on or off - in string mode, instead of reading characters as instructions, their ASCII codes are pushed to the top of the stack.</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Level 6</strong> - store and retrieve</td>
    </tr>
    <tr>
      <td><code>g</code></td>
      <td>Pop the top two values y and x from the stack and push the ASCII code of the character on row y, column x of the program to the top of the stack.</td>
    </tr>
    <tr>
      <td><code>p</code></td>
      <td>Pop the top three values y, x and v from the stack and set the character with the ASCII code of v as the instruction on row y, column x of the program.</td>
    </tr>
  </tbody>
</table>

  [Befunge]: https://en.wikipedia.org/wiki/Befunge
  [stack]: https://en.wikipedia.org/wiki/Stack_(abstract_data_type)
  [this kata]: https://www.codewars.com/kata/526c7b931666d07889000a3c/
