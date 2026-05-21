# Reading the Runes – Code Analysis

## Description

We analysed a small **Hobbit Rations Tracker**. The application shows the current number of available rations. A user can enter an amount and then either add this amount to the tracker or eat this amount from the available rations.

The intended behaviour is:

- adding rations increases the available amount
- eating rations decreases the available amount
- the screen always shows the current ration count
- the Eat button should not allow the user to eat more rations than available

Improvement proposal: [reading_the_runes.html](reading_the_runes.html)

## Identified Issues

### 1. Rations were handled as text instead of numbers

**Where:**  
In the original code, the initial value was stored as a string:

```js
let rations = "10";
```

The input value was also read as text:

```js
const value = amountInput.value;
rations = rations + value;
```

**Current:**  
The Add button appeared to work because the screen changed after clicking it. But it did not perform a real addition. Since both values were strings, JavaScript joined them together:

```js
"10" + "5" // "105"
```

The Eat button behaved differently because it used subtraction:

```js
rations = rations - value;
```

This only worked because JavaScript is quite forgiving here. With the `-` operator, JavaScript tries to convert text values into numbers automatically. So the Eat calculation could work by accident, while the Add calculation produced the wrong result.

**Issue:**  
The code mixed text and number logic. This made the two buttons behave differently and made the state unreliable. In a larger system, this could affect later calculations, reports, or saved data.

**Expected:**  
We store the current ration count as a number:

```js
let rations = 10;
```

We also read the input with `valueAsNumber` and store it in a local variable inside each click handler:

```js
const rationAmount = rationInput.valueAsNumber;
```

---

### 2. The status text had no single source of truth

**Where:**  
In the original code, the starting value existed in HTML and JavaScript:

```html
<p id="status">Rations available: 10</p>
```

```js
let rations = "10";
```

**Current:**  
The same value was written in two places. If one value changed later and the other one did not, the UI and the JavaScript state could show different information.

**Issue:**  
There was no clear single source of truth. This makes the code harder to maintain.

**Expected:**  
We leave the status element empty in HTML:

```html
<p id='status'></p>
```

The value is stored in JavaScript and written to the screen with `updateStatus()`:

```js
function updateStatus() {
    statusElement.textContent = `Current Rations: ${rations}`;
}

updateStatus();
```

---

### 3. The Eat button updated the UI before changing the state

**Where:**  
In the original Eat button logic, `updateStatus()` was called before the ration value changed:

```js
const value = amountInput.value;

updateStatus();

if (rations - value < 0) {
    alert("Not enough rations!");
} else {
    rations = rations - value;
}
```

**Current:**  
The UI was updated before the subtraction happened. The internal value could change, but the visible status still showed the old number.

**Issue:**  
The interface and the internal state could get out of sync. For the user, the Eat button looked broken because the visible number did not change immediately.

**Expected:**  
We first validate the input, then check if enough rations are available, then update the value, and only then update the status:

```js
if (rations >= rationAmount) {
    rations = rations - rationAmount;
    updateStatus();
}
```

---

### 4. Input was not validated before changing the state

**Where:**  
The original code used the input value directly in both button handlers.

**Current:**  
The user could enter values that do not make sense for rations, for example an empty value, decimals, `0`, or negative numbers.

**Issue:**  
Invalid values could break the ration count. For example, an empty input can become `NaN`. Negative values are also dangerous: adding `-5` would reduce rations, while eating `-5` would increase them.

**Expected:**  
We validate the input at the beginning of both click handlers:

```js
if (!Number.isInteger(rationAmount) || rationAmount <= 0) {
    alert("Please enter a whole number greater than 0.");
    return;
}
```

The `return` stops the function before `rations` can be changed.

---

### 5. The input type did not support the intended interaction well

**Where:**  
The original code used a text input:

```html
<input id="amount" type="text" placeholder="Amount">
```

**Current:**  
A text field accepts values that are not meaningful for a ration amount.

**Issue:**  
The interface did not guide the user towards entering a number. This made invalid input more likely.

**Expected:**  
We changed the input to a number input and added a minimum value:

```html
<input type="number" id='rationInput' placeholder='Enter rations' min="1">
```

The HTML input improves the interface, while the JavaScript validation protects the actual logic.

---

### 6. The Eat button did not reflect the current state

**Where:**  
The original Eat button stayed active even when no rations were left.

**Current:**  
The user could still try to eat rations and only received feedback after the invalid action.

**Issue:**  
The UI did not communicate which actions were currently possible.

**Expected:**  
We update the button state inside `updateStatus()`:

```js
if (rations==0) {
    eatButton.disabled = true;
}
else {
    eatButton.disabled = false;
}
```

When rations reach `0`, the Eat button becomes inactive. When rations are added again, it becomes active again.

---

### 7. The input stayed filled after an action

**Where:**  
In the original version, the input field was not cleared after clicking Add or Eat.

**Current:**  
The old input value stayed visible. The user could click again and repeat the same action by accident.

**Issue:**  
The UI did not clearly show that the action was completed.

**Expected:**  
We clear the input after both actions:

```js
rationInput.value = '';
```

---

## AI Assistance Reflection

We first analysed and tested the code ouself. We then used AI to check whether our findings were technically correct and whether we had missed important problems. 

The AI could explain possible issues but could not decide which ones were most relevant for the assignment. We had to decide ourself which findings were meaningful code-analysis issues. What worked well, was to ask AI for deeper explainations for 1 of the issues we spotted during testing the application but couldn´t find the routcause in the code.

We also used AI while rewriting the code step by step. This way we were able to get feedback to the code we wrote step by step instead of rewriting the full solution at once. 

The final analysis is based on all 3 steps: manual testing, AI-assisted review and code re-writing.
