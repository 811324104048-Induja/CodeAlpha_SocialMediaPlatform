

function renderPosts(containerId, posts) {

    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(posts) || posts.length === 0) {
        container.textContent = "No posts available.";
        return;
    }

    const currentUser = getCurrentUser();

    posts.forEach(post => {

        const card = document.createElement("div");
        card.className = "post-card";

        // POST HEADER
        const header = document.createElement("div");
        header.className = "post-header";

        const username = document.createElement("div");
        username.className = "post-user";
        username.textContent = "@" + (post.username || "user");

        header.appendChild(username);

        // DELETE OPTION - ONLY FOR POST OWNER
        if (
            currentUser &&
            String(currentUser.id) === String(post.user_id)
        ) {

            const menuButton = document.createElement("button");
            menuButton.className = "post-menu-button";
            menuButton.textContent = "⋮";
            menuButton.type = "button";
            menuButton.title = "Post options";

            const menu = document.createElement("div");
            menu.className = "post-menu hidden";

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-post-button";
            deleteButton.textContent = "🗑 Delete Post";
            deleteButton.type = "button";

            menuButton.onclick = () => {
                menu.classList.toggle("hidden");
            };

            deleteButton.onclick = async () => {

                const confirmDelete = confirm(
                    "Are you sure you want to delete this post?"
                );

                if (!confirmDelete) return;

                try {

                    await apiRequest(
                        `/posts/${post.id}`,
                        "DELETE"
                    );

                    card.remove();

                    alert("Post deleted successfully! 💜");

                } catch (error) {

                    alert(error.message || "Unable to delete post.");

                }

            };

            menu.appendChild(deleteButton);

            header.append(menuButton, menu);

        }

        // POST IMAGE
        const image = document.createElement("img");
        image.className = "post-image";
        image.src = post.image_url || "";
        image.alt = "Post image";

        // POST BODY
        const body = document.createElement("div");
        body.className = "post-body";

        const caption = document.createElement("p");
        caption.className = "post-caption";
        caption.textContent = post.caption || "";

        const actions = document.createElement("div");
        actions.className = "post-actions";

        const likeButton = document.createElement("button");
        likeButton.textContent = post.liked_by_me ? "♥ Liked" : "♡ Like";

        const likeCount = document.createElement("span");
        likeCount.className = "post-count";

        likeCount.textContent =
            `${post.likes_count || post.like_count || 0} likes`;

        likeButton.onclick = () => {
            toggleLike(post, likeButton, likeCount);
        };

        const commentButton = document.createElement("button");
        commentButton.textContent = "💬 Comments";

        const commentsPanel = document.createElement("div");
        commentsPanel.className = "comments-panel hidden";

        const commentsList = document.createElement("div");
        commentsList.className = "comments-list";

        const commentForm = document.createElement("form");
        commentForm.className = "comment-form";

        const commentInput = document.createElement("input");
        commentInput.placeholder = "Write a comment...";
        commentInput.required = true;

        const sendButton = document.createElement("button");
        sendButton.textContent = "Send";
        sendButton.type = "submit";

        commentForm.append(commentInput, sendButton);

        commentForm.onsubmit = async event => {

            event.preventDefault();

            await submitComment(
                post.id,
                commentInput,
                commentsList
            );

        };

        commentButton.onclick = async () => {

            commentsPanel.classList.toggle("hidden");

            if (!commentsPanel.classList.contains("hidden")) {
                await loadComments(post.id, commentsList);
            }

        };

        actions.append(likeButton, commentButton);

        body.append(actions, caption, likeCount);

        commentsPanel.append(commentsList, commentForm);

        card.append(header, image, body, commentsPanel);

        container.appendChild(card);

    });

}


// HOME FEED
async function loadFeed() {

    try {

        const result = await apiRequest("/posts/feed");

        renderPosts("feedPosts", result.posts || result);

    } catch (error) {

        document.getElementById("feedPosts").textContent = error.message;

    }
}


// EXPLORE
async function loadExplore() {

    try {

        const result = await apiRequest("/posts/explore");

        renderPosts("explorePosts", result.posts || result);

    } catch (error) {

        document.getElementById("explorePosts").textContent = error.message;

    }
}


// SPOTLIGHT
async function loadSpotlight() {

    try {

        const result = await apiRequest("/posts/spotlight");

        renderPosts("spotlightPosts", result.posts || result);

    } catch (error) {

        document.getElementById("spotlightPosts").textContent = error.message;

    }
}


// CHANGE SECTION
function showSection(section) {

    const sections = [
        "feedSection",
        "exploreSection",
        "spotlightSection"
    ];

    sections.forEach(id => {
        document.getElementById(id).classList.add("hidden");
    });

    document.getElementById(section + "Section").classList.remove("hidden");

    if (section === "feed") loadFeed();
    if (section === "explore") loadExplore();
    if (section === "spotlight") loadSpotlight();
}


// USER SEARCH
async function searchPeople() {

    const query = document.getElementById("userSearch").value.trim();

    const resultBox = document.getElementById("searchResults");

    if (!query) {
        resultBox.classList.add("hidden");
        return;
    }

    try {

        const result = await apiRequest(
            `/users/search?q=${encodeURIComponent(query)}`
        );

        const users = result.users || result;

        resultBox.innerHTML = "";
        resultBox.classList.remove("hidden");

        if (!Array.isArray(users) || users.length === 0) {
            resultBox.textContent = "No users found.";
            return;
        }

        users.forEach(user => {

            const link = document.createElement("a");

            link.href = `profile.html?id=${user.id}`;
            link.textContent = `${user.name} (@${user.username})`;

            link.className = "person-row";

            resultBox.appendChild(link);

        });

    } catch (error) {

        resultBox.textContent = error.message;

    }
}


document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("feedPosts")) return;

    if (!requireLogin()) return;

    loadFeed();

    document.getElementById("exploreNav").onclick = event => {
        event.preventDefault();
        showSection("explore");
    };

    document.getElementById("spotlightNav").onclick = event => {
        event.preventDefault();
        showSection("spotlight");
    };

    document.getElementById("userSearch").addEventListener(
        "input",
        searchPeople
    );

});
