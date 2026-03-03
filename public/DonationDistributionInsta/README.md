# Donation Distribution gallery

The **Donation Distribution** page (`/donation-distribution`) now shows posts **directly from Instagram** using embeds. You don’t need to download or host any image files.

- Each grid cell loads the real Instagram post in an iframe from `https://www.instagram.com/p/{postId}/embed/`.
- Post IDs are defined in `src/app/donation-distribution/page.js` (the `ai` object).
- Clicking a cell opens a larger embed in a modal with a “View on Instagram” link.

No files need to be placed in this folder. You can leave it empty or remove it if you prefer.
