// This application demonstrates an unsafe use of document.URL which leads to DOM XSS.

/**
 * Vulnerable function that takes document.URL and sinks it into innerHTML.
 * This is dangerous because an attacker can append malicious scripts to the URL
 * (e.g., #<img src=x onerror=alert(1)>) which will be executed by the browser.
 */
function displayUrlUnsafely() {
    // We decode the URL because browsers often auto-encode characters in document.URL,
    // which might prevent the XSS from triggering in some modern browsers.
    // Decoding it simulates a scenario where the application processes the raw input.
    const url = decodeURIComponent(document.URL);
    const contentDiv = document.getElementById('content');
    
    if (contentDiv) {
        // UNSAFE: document.URL (even decoded) is a source that can be controlled by an attacker.
        // innerHTML is a sink that executes scripts.
        contentDiv.innerHTML = "You are visiting: " + url;
    }
}

// Safe version for comparison
function displayUrlSafely() {
    /** @safe-sinker: The url won't render as html */
    const url = document.URL;
    const displaySpan = document.getElementById('url-display');
    
    if (displaySpan) {
        // SAFE: textContent does not execute scripts.
        displaySpan.textContent = url;
    }
}

displayUrlUnsafely();
displayUrlSafely();
