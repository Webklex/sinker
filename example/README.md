# Unsafe `document.URL` Demo

This demo application demonstrates how using `document.URL` unsafely can lead to DOM-based Cross-Site Scripting (XSS).

## The Vulnerability

In `src/index.ts`, the function `displayUrlUnsafely` takes the value of `document.URL` and directly assigns it to the `innerHTML` property of an element. Note that we use `decodeURIComponent(document.URL)` to ensure the payload is processed as HTML, as modern browsers often auto-encode characters in the URL:

```typescript
function displayUrlUnsafely() {
    const url = decodeURIComponent(document.URL);
    const contentDiv = document.getElementById('content');
    
    if (contentDiv) {
        // UNSAFE: document.URL is a source that can be controlled by an attacker.
        // innerHTML is a sink that executes scripts.
        contentDiv.innerHTML = "You are visiting: " + url;
    }
}
```

Since an attacker can control the fragment part of the URL (the part after `#`), they can inject malicious HTML/JavaScript that the browser will execute when it's assigned to `innerHTML`.

## How to Run

1.  Navigate to the `example` directory:
    ```bash
    cd example
    ```
2.  Install dependencies and build the project:
    ```bash
    npm install
    npm run build
    ```
3.  Run the sinker scanner:
    ```bash
    npm run sinker
    ```
4.  Serve the application:
    ```bash
    npm run serve
    ```
    Or use the shorthand to build and serve:
    ```bash
    npm start
    ```

## How to Demonstrate the XSS

Once the page is open, append the following payload to the URL in your browser's address bar:

`#<img src=x onerror=alert('XSS_from_document.URL')>`

The full URL would look something like:
`http://localhost:3000/#<img src=x onerror=alert('XSS_from_document.URL')>`

When you reload or press enter, an alert box should appear, proving that the script injected via the URL was executed.

## The Safe Way

The `displayUrlSafely` function shows the correct way to handle such data by using `textContent`, which treats the input as literal text and does not execute any HTML or scripts:

```typescript
function displayUrlSafely() {
    const url = document.URL;
    const displaySpan = document.getElementById('url-display');
    
    if (displaySpan) {
        // SAFE: textContent does not execute scripts.
        displaySpan.textContent = url;
    }
}
```
