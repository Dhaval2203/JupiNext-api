export const diffInSeconds = (start, end) =>
    Math.floor((new Date(end) - new Date(start)) / 1000);
