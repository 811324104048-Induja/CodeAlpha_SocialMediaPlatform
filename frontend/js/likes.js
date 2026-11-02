
async function toggleLike(post, button, countElement) {

    const alreadyLiked = Boolean(post.liked_by_me);

    try {

        if (alreadyLiked) {

            await apiRequest(`/likes/${post.id}`, "DELETE");

            post.liked_by_me = false;
            post.like_count = Math.max(0, Number(post.like_count || 0) - 1);

            button.textContent = "♡ Like";

        } else {

            await apiRequest(`/likes/${post.id}`, "POST");

            post.liked_by_me = true;
            post.like_count = Number(post.like_count || 0) + 1;

            button.textContent = "♥ Liked";

        }

        countElement.textContent = `${post.like_count} likes`;

    } catch (error) {

        alert(error.message);

    }

}
