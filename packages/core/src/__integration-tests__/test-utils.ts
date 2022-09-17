export const wait = async (timeMs?: number) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(null), timeMs || 200);
  });
};
