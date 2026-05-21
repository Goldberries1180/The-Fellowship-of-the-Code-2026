# Reading the Runes – Code Analysis

## Description

The application is a small **Hobbit Rations Tracker**. It displays the currently available number of rations and allows the user to either add rations or eat rations by entering an amount into an input field.

The intended behaviour is as follows:

- adding rations should increase the available amount
- eating rations should decrease the available amount
- the app should warn the user when they try to eat more rations than are available

## Identified Issues

### 1. Rations are stored and handled as text instead of numbers

**Where:**  
This starts with the initial state:

```js
let rations = "10";
```

It also happens in the Add Rations button logic:

```js
const value = amountInput.value;
rations = rations + value;
```

**Current:**  
`rations` is stored as a string, and `amountInput.value` is also a string because form input values from the DOM are text by default. When the user clicks **Add Rations**, the `+` operator does not reliably perform numeric addition. Instead, it joins the two strings together.

Example:

```js
"10" + "5" // "105"
```

So if the user enters `5`, the app displays `Rations available: 105` instead of `Rations available: 15`.

**Why this issue matters:**  
The displayed ration count is wrong. The app appears to work because the status text updates, but the calculation behind it is incorrect.

The code mixes numeric logic with string values. The Eat Rations button uses subtraction, and JavaScript tries to convert strings to numbers automatically in that case. That means the two buttons behave differently even though both are supposed to work with the same type of data.

In a larger system, this would be risky because corrupted state could spread to other parts of the application, such as storage, reporting, validation, or other calculations.

**Expected / Fix:**  
The ration count should be stored as a number, not a string. The user input should be converted to a number before it is used in calculations.

Example direction:

```js
let rations = 10;
const amount = Number(amountInput.value);
```

---

### 2. User input is not validated

**Where:**  
This affects both button handlers:

```js
const value = amountInput.value;
```

The value is used directly without checking whether it is a valid amount.

**Current:**  
The user can enter values that do not make sense for a ration tracker, for example:

- letters such as `f`
- an empty value
- negative numbers
- decimal numbers
- very large values

When a letter is used with the Eat Rations button, the calculation can result in `NaN`, because the value cannot be converted into a number.

**Why this issue matters:**  
For the user, the app can suddenly display broken or confusing results. If the status becomes `NaN`, the user can no longer understand how many rations are available.

This could cause later bugs because invalid data is allowed into the application state. Once the state is invalid, every later calculation becomes unreliable.

In a larger system, this would be risky because other features might depend on the ration count being a valid number. For example, a save function, inventory overview, warning system, or multiplayer state could all be affected by one invalid input.

**Expected / Fix:**  
The app should validate the input before using it. It should only accept positive whole numbers. Invalid input should be rejected with clear feedback.

The input type could also be changed from `text` to `number`, but validation in JavaScript is still needed because the HTML input type alone is not enough.

---

### 3. The Eat Rations button updates the UI before changing the state

**Where:**  
This happens in the Eat Rations event listener:

```js
eatButton.addEventListener("click", () => {
    const value = amountInput.value;

    updateStatus();

    if (rations - value < 0) {
        alert("Not enough rations!");
    } else {
        rations = rations - value;
    }
});
```

**Current:**  
The app updates the status text before it checks whether enough rations are available and before it subtracts the eaten rations.

For example, if there are `10` rations and the user eats `3`, the app first displays `Rations available: 10`. Then it changes the internal value to `7`, but the UI is not updated again afterwards. The internal state and the visible UI are no longer in sync.

Eating the last available ration should not trigger the alert in this exact code if the data is still valid. For example, `1 - 1` is `0`, not less than `0`. The real issue is that the UI update happens too early, so the screen can show the old value after a successful action.

**Why this issue matters:**  
For the user, the interface gives wrong feedback. 

In a larger system, this is risky because other parts of the UI might update based on outdated information. For example, a button could stay enabled even though no rations are left.

**Expected / Fix:**  
The correct order should be:

1. read and validate the input
2. check whether the action is allowed
3. update the state
4. update the UI

The status should only be updated after the ration count has actually changed.

---

### 4. The initial ration value is duplicated in HTML and JavaScript

**Where:**  
The initial value appears in the HTML:

```html
<p id="status">Rations available: 10</p>
```

It also appears in JavaScript:

```js
let rations = "10";
```

**Current:**  
The same starting value is written in two different places. If the default ration count changes later, both places need to be updated manually.

**Why this issue matters:**  
For the user, this could create inconsistent information. For example, the HTML might show `10`, while the JavaScript state starts with another value.

This could cause later bugs because there is no single source of truth. Developers could update one value and forget the other.

In a larger system, duplicated state is risky because it makes maintenance harder. The more places that store the same information, the easier it is for the application to become inconsistent.

**Expected / Fix:**  
The ration count should have one source of truth. A better approach would be to store the starting value in JavaScript and call `updateStatus()` once when the page loads.

---

### 5. The input field is not cleared after an action

**Where:**  
This affects both Add Rations and Eat Rations. After clicking either button, the value remains in the input field.

**Current:**  
If the user enters `3` and clicks a button, the `3` stays in the input. The user can accidentally click the same button again and repeat the action.

**Why this issue matters:**  
For the user, this increases the chance of accidental actions. The interface does not clearly show that the previous action is complete.

In a larger system, this would be risky for any interaction that changes important data. If actions are not clearly completed, users may duplicate changes by mistake.

**Expected / Fix:**  
After a successful action, the app should clear the input field. It could also move focus back to the input so the next value can be entered easily.

---

### 6. Button state and feedback are inconsistent

**Where:**  
The Eat Rations button is always active:

```html
<button id="eat">Eat Rations</button>
```

Feedback for invalid actions is shown with an alert:

```js
alert("Not enough rations!");
```

**Current:**  
The user can click **Eat Rations** even when there are no rations left. The app also uses a browser alert instead of showing feedback directly in the interface.

**Why this issue matters:**  
For the user, this creates unnecessary friction. The app allows an action and only afterwards says that the action is not possible.

The UI does not reflect the current state of the application. Buttons should usually communicate what actions are currently available.

In a larger system, this is risky because users may repeatedly trigger invalid actions. It also makes the interface harder to extend, for example if there are different warning states or more complex inventory rules.

**Expected / Fix:**  
The Eat Rations button could be disabled when the ration count is `0`. Feedback could be shown as inline text near the input instead of using an alert.

---

### 7. Some naming and structure could be clearer

**Where:**  
The variable name `value` is used in both handlers:

```js
const value = amountInput.value;
```

**Current:**  
The name `value` is very general. It does not clearly communicate that the value represents a ration amount entered by the user.

There is also repeated logic in the two button handlers, especially around reading input and updating the status.

**Why this issue matters:**  
For the user, this does not cause an immediate visible problem. However, it affects maintainability.

This could cause later bugs because vague names make it easier to misunderstand the code. If more features are added later, it may become unclear whether `value` refers to user input, current rations, a change amount, or something else.


**Expected / Fix:**  
A clearer name such as `amount` or `rationAmount` would make the code easier to understand.

Shared logic, such as parsing and validating the input, could be moved into a helper function. However, the code should not be over-abstracted too early. The main priority is to fix the state, validation, and UI update order first.

## Notes on My Initial Analysis


## AI Assistance Reflection

We first analysed and tested the code ouself. We then used AI to check whether our findings were technically correct and whether we had missed important problems. 

The AI could explain possible issues but could not decide which ones were most relevant for the assignment. We had to decide ourself which findings were meaningful code-analysis issues and which ones were more general UX improvements. What worked well, was to ask AI for deeper explainations for 1 of the issues we spotted during testing the application but couldn´t find the routcause in the code.

The final analysis is based on both manual testing and AI-assisted review.
