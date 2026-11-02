
async function getFollowStatus(userId) {

    const result = await apiRequest(
        `/follows/${userId}/status`
    );

    return Boolean(result.isFollowing ?? result.following);

}


async function changeFollow(userId, following) {

    if (following) {

        await apiRequest(`/follows/${userId}`, "DELETE");

    } else {

        await apiRequest(`/follows/${userId}`, "POST");

    }

}


// LOAD FOLLOWERS OR FOLLOWING
async function loadPeopleList() {

    const params = new URLSearchParams(window.location.search);

    const userId = params.get("id");

    const type = params.get("type") === "following"
        ? "following"
        : "followers";

    const title = document.getElementById("listTitle");
    const container = document.getElementById("peopleList");

    if (!container || !userId) return;

    title.textContent = type === "followers"
        ? "Followers"
        : "Following";

    try {

        const result = await apiRequest(
            `/users/${userId}/${type}`
        );

        const people = result.users || result[type] || result;

        container.innerHTML = "";

        if (!Array.isArray(people) || people.length === 0) {
            container.textContent = `No ${type} found.`;
            return;
        }

        people.forEach(person => {

            const row = document.createElement("div");
            row.className = "person-row";

            const link = document.createElement("a");

            link.href = `profile.html?id=${person.id || person.user_id}`;

            link.textContent =
                `${person.name || ""} (@${person.username || ""})`;

            row.appendChild(link);

            container.appendChild(row);

        });

    } catch (error) {

        container.textContent = error.message;

    }

}


document.addEventListener("DOMContentLoaded", () => {

    if (document.getElementById("peopleList")) {

        if (!requireLogin()) return;

        loadPeopleList();

    }

});
