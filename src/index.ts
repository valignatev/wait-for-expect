// Used to avoid using Jest's fake timers.
// See https://github.com/TheBrainFamily/wait-for-expect/issues/4 for more info
const { setTimeout } = typeof window !== "undefined" ? window : global;

/**
 * Waits for the expectation to pass and returns a Promise
 *
 * @param  expectation  Function  Expectation that has to complete without throwing
 * @param  timeout  Number  Maximum wait interval, 4500ms by default
 * @param  interval  Number  Wait-between-retries interval, 50ms by default
 * @return  Promise  Promise to return a callback result
 */
const waitForExpect = function waitForExpect(
  expectation: () => void,
  timeout = 4500,
  interval = 50
) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const rejectOrRerun = (error: Error) => {
      if (Date.now() - startTime >= timeout) {
        reject(error);
        return;
      }
      // eslint-disable-next-line no-use-before-define
      setTimeout(runExpectation, interval);
    };
    function runExpectation() {
      try {
        Promise.resolve(expectation())
          .then(() => resolve())
          .catch(rejectOrRerun);
      } catch (error) {
        rejectOrRerun(error);
      }
    }
    setTimeout(runExpectation, 0);
  });
};

export default waitForExpect;
