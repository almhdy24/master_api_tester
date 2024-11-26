if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("../../service-worker.js")
        .then(registration => {
            console.log(
                "Service Worker registered successfully:",
                registration
            );
        })
        .catch(error => {
            console.log("Service Worker registration failed:", error);
        });
}

// Helper Functions
const displayResponse = (responseHeaders, responseBody) => {
    const ulResponseHeaders = document.getElementById("responseHeaders");
    const preResponseBody = document.getElementById("responseBody");

    // Display response headers
    ulResponseHeaders.innerHTML = Object.entries(responseHeaders)
        .map(([key, value]) => `<li>${key}: ${value}</li>`)
        .join("");

    // Display response body with collapsible nodes
    preResponseBody.innerHTML = "";
    preResponseBody.appendChild(
        createCollapsibleNode(responseBody, "Response (Click to collapse)")
    );
};

const createCollapsibleNode = (data, key) => {
    const node = document.createElement("div");
    const label = document.createElement("span");

    label.textContent = `${key}: `;
    label.style.cursor = "pointer";
    label.style.color = "blue";
    label.onclick = () => {
        content.style.display =
            content.style.display === "block" ? "none" : "block";
    };
    node.appendChild(label);

    const content = document.createElement("div");
    content.style.display = "none";

    if (typeof data === "object") {
        Object.entries(data).forEach(([childKey, childValue]) => {
            content.appendChild(createCollapsibleNode(childValue, childKey));
        });
    } else {
        node.textContent = `${key}: ${data}`;
    }

    node.appendChild(content);
    return node;
};

// Main Request Function
const sendRequest = async () => {
    const url = document.getElementById("url").value;
    const method = document.getElementById("method").value;
    const params = document.getElementById("params").value;

    // Loading Indicator
    const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.style.display = "block";

    try {
        const response = await fetch(
          url,
            {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: method !== "GET" ? JSON.stringify(params) : null
            }
        );

        const responseBody = await response.json();
        const responseHeaders = response.headers;
        displayResponse(responseHeaders, responseBody);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data.");
    } finally {
        loadingIndicator.style.display = "none";
    }
};

// Event Listener
document.getElementById("sendRequest").addEventListener("click", sendRequest);
