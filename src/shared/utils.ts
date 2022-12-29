export class Utils {
  public static waitUntilTrue(
    test: () => Promise<boolean> | boolean,
    timeOut = 1000
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timerId = setInterval(async () => {
        if (await test()) {
          clearTimeout(timerId);
          return resolve();
        }
      }, 100);
      setTimeout(() => {
        clearTimeout(timerId);
        return reject(new Error("Test timed out.."));
      }, timeOut);
    });
  }
}
