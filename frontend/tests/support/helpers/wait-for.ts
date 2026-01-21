export const waitFor = async (condition: () => Promise<boolean> | boolean, timeout = 5000, interval = 100): Promise<void> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        if (await condition()) return;
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error(`Condition not met within ${timeout}ms`);
};
