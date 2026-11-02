
document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("profileInfo")) return;

    if (!requireLogin()) return;

    loadProfile();

});


async function loadProfile() {

    const params = new URLSearchParams(window.location.search);

    const userId = params.get("id") || getCurrentUser()?.id;

    const container = document.getElementById("profileInfo");

    if (!userId) {
        container.textContent = "Profile not found.";
        return;
    }

    try {

        const result = await apiRequest(`/users/${userId}`);

       const user = result.user || result;
const stats = result.stats || {};
const posts = result.posts || user.posts || [];

        const currentUser = getCurrentUser();

        const ownProfile =
            String(currentUser?.id) === String(userId);

        container.innerHTML = `
            <img
                class="profile-avatar"
                src="${user.profile_image || 'https://placehold.co/120x120'}"
                alt="Profile photo"
            >

            <div class="profile-main">

                <h2>${escapeHTML(user.name || "")}</h2>

                <p class="profile-handle">
                    @${escapeHTML(user.username || "")}
                </p>

                <p class="profile-bio">
                    ${escapeHTML(user.bio || "No bio added yet.")}
                </p>

               <div class="profile-stats">

    <span>
        <strong>${stats.posts_count || 0}</strong>
        Posts
    </span>

    <a href="followers.html?id=${userId}&type=followers">
        <strong>${stats.followers_count || 0}</strong>
        Followers
    </a>

    <a href="followers.html?id=${userId}&type=following">
        <strong>${stats.following_count || 0}</strong>
        Following
    </a>

</div>

                <div id="profileButtons" class="profile-buttons"></div>

            </div>
        `;

        renderPosts("profilePosts", posts);

        const buttons = document.getElementById("profileButtons");

        if (ownProfile) {

            const editButton = document.createElement("button");

            editButton.className = "secondary-button";
            editButton.textContent = "Edit Profile";

            editButton.onclick = () => showEditProfile(user);

            buttons.appendChild(editButton);

        } else {

            const followButton = document.createElement("button");

            followButton.className = "primary-button";

            let following = await getFollowStatus(userId);

            followButton.textContent = following
                ? "Following"
                : "Follow";

            followButton.onclick = async () => {

                try {

                    await changeFollow(userId, following);

                    following = !following;

                    followButton.textContent = following
                        ? "Following"
                        : "Follow";

                } catch (error) {

                    alert(error.message);

                }

            };

            buttons.appendChild(followButton);

        }

    } catch (error) {

        container.textContent = error.message;

    }

}


// EDIT PROFILE
function showEditProfile(user) {

    const modal = document.createElement("div");

    modal.className = "edit-modal";

    modal.innerHTML = `
        <form class="edit-form" id="editProfileForm">

            <h2>Edit Profile</h2>

            <label>Name</label>
            <input id="editName" value="${escapeHTML(user.name || "")}" required>

            <label>Bio</label>
            <textarea id="editBio">${escapeHTML(user.bio || "")}</textarea>

            <label>Profile Image URL</label>
            <input id="editPhoto" value="${escapeHTML(user.profile_image || "")}">

            <button class="primary-button" type="submit">
                Save Changes
            </button>

            <button class="secondary-button" type="button" id="cancelEdit">
                Cancel
            </button>

            <p id="editMessage"></p>

        </form>
    `;

    document.body.appendChild(modal);

    document.getElementById("cancelEdit").onclick = () => {
        modal.remove();
    };

    document.getElementById("editProfileForm").onsubmit =
        async event => {

            event.preventDefault();

            try {

                await apiRequest(
                    "/users/profile/update",
                    "PUT",
                    {
                        name: document.getElementById("editName").value.trim(),
                        bio: document.getElementById("editBio").value.trim(),
                        profile_image: document.getElementById("editPhoto").value.trim()
                    }
                );

                modal.remove();

                loadProfile();

            } catch (error) {

                document.getElementById("editMessage").textContent =
                    error.message;

            }

        };

}


function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

}
