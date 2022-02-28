// Mint start date in index.js
export const mintDate = new Date(Date.UTC(2022, 1, 27, 13, 35, 0));

// nav start date in minigame.js
// export const navStart = new Date(Date.UTC(2022, 1, 21, 16, 35, 0))
export const navStart = Date.now();

// nav end date in minigame.js
// export const navEnd = new Date(Date.UTC(2022, 1, 21, 16, 35, 0))
export const navEnd = Date.now() + 300000;
