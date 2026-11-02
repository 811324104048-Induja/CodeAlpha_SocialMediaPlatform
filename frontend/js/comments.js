
async function loadComments(postId, container) {

    try {

        const result = await apiRequest(`/comments/${postId}`);

        const comments = result.comments || result;

        container.innerHTML = "";

        if (!Array.isArray(comments) || comments.length === 0) {
            container.textContent = "No comments yet.";
            return;
        }

        comments.forEach(comment => {

            const div = document.createElement("div");

            div.className = "comment-row";

            const username = document.createElement("strong");
            username.textContent = `@${comment.username || "user"} `;

            const text = document.createElement("span");
            text.textContent = comment.comment_text || "";

            div.append(username, text);

            container.appendChild(div);

        });

    } catch (error) {

        container.textContent = error.message;

    }

}


async function submitComment(postId, input, container) {

    const comment = input.value.trim();

    if (!comment) return;

    try {

        await apiRequest(`/comments/${postId}`, "POST", {
            comment_text: comment
        });

        input.value = "";

        await loadComments(postId, container);

    } catch (error) {

        alert(error.message);

    }

}
