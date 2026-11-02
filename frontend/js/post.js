
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("createPostForm");

    if (!form) return;

    if (!requireLogin()) return;

    const imageInput = document.getElementById("imageUrl");
    const preview = document.getElementById("imagePreview");
    const message = document.getElementById("postMessage");

    imageInput.addEventListener("input", () => {

        const url = imageInput.value.trim();

        preview.src = url;

        preview.classList.toggle("hidden", !url);

    });

    form.addEventListener("submit", async event => {

        event.preventDefault();

        const postData = {
            image_url: imageInput.value.trim(),
            caption: document.getElementById("caption").value.trim()
        };

        try {

            await apiRequest("/posts", "POST", postData);

            message.textContent = "Post shared successfully!";
            message.style.color = "green";

            form.reset();

            preview.classList.add("hidden");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (error) {

            message.textContent = error.message;
            message.style.color = "red";

        }

    });

});
