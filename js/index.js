const displayResponse = (responseHeaders, responseBody) => {
    const ulResponseHeaders = document.getElementById("responseHeaders");
    const preResponseBody = document.getElementById("responseBody");

    // Display response headers as a list
    const headersList = Object.entries(responseHeaders).map(([key, value]) => {
        return `${key}: ${value}`;
    });
    ulResponseHeaders.innerHTML = headersList
        .map(header => `<li>${header}</li>`)
        .join("");

    // Display response body with collapsible nodes
    preResponseBody.innerHTML = "";
    preResponseBody.appendChild(
        createCollapsibleNode(responseBody, "Response (Click to collapse)")
    );
};

const createCollapsibleNode = (data, key) => {
    const node = document.createElement("div");
    if (typeof data === "object") {
        const label = document.createElement("span");
        label.textContent = key + ": ";
        label.style.cursor = "pointer";
        label.style.color = "blue";
        label.onclick = () => {
            content.style.display =
                content.style.display === "block" ? "none" : "block";
        };
        node.appendChild(label);

        const content = document.createElement("div");
        content.style.display = "none";

        Object.entries(data).forEach(([childKey, childValue]) => {
            content.appendChild(createCollapsibleNode(childValue, childKey));
        });

        node.appendChild(content);
    } else {
        node.textContent = `${key}: ${data}`;
    }
    return node;
};

document.getElementById("sendRequest").addEventListener("click", () => {
    // Your existing code for sending the request
    const url = document.getElementById("url").value;
    const method = document.getElementById("method").value;
    const params = document.getElementById("params").value;

    const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.style.display = "block";

    let requestBody;
    try {
        requestBody = JSON.parse(params);
    } catch (error) {
        console.error("Invalid JSON object in request body");
        document.getElementById("responseHeaders").textContent =
            "Invalid JSON object in request body";
        loadingIndicator.style.display = "none";
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        loadingIndicator.style.display = "none";

        if (xhr.status >= 200 && xhr.status < 300) {
            const responseHeaders = xhr
                .getAllResponseHeaders()
                .split("\n")
                .reduce((acc, header) => {
                    const [key, value] = header.split(":");
                    if (key && value) {
                        acc[key.trim()] = value.trim();
                    }
                    return acc;
                }, {});

            const responseBody = JSON.parse(xhr.responseText);
            displayResponse(responseHeaders, responseBody);
        } else {
            console.error("Request failed with status: " + xhr.status);
            document.getElementById("responseHeaders").textContent =
                "Request failed with status: " + xhr.status;
        }
    };

    xhr.onerror = function () {
        console.error("Request failed");
        document.getElementById("responseHeaders").textContent =
            "Request failed";
        loadingIndicator.style.display = "none";
    };

    xhr.send(JSON.stringify(requestBody));
});
