(() => {
  const MAX_WORKERS = 5;
  let workerCount = 0;
  let sharedWorkerCount = 0;

  const originalWorker = window.Worker;
  const originalSharedWorker = window.SharedWorker;

  window.Worker = function (...args) {
    if (workerCount >= MAX_WORKERS) {
      console.warn(`[AntiCrash] Max ${MAX_WORKERS} Web Workers reached. Blocked.`);
      throw new Error("[AntiCrash] Web Worker limit reached. Blocked.");
    }
    const worker = new originalWorker(...args);
    workerCount++;

    const originalTerminate = worker.terminate;
    worker.terminate = function () {
      workerCount--;
      return originalTerminate.apply(worker, arguments);
    };

    return worker;
  };

  window.SharedWorker = function (...args) {
    if (sharedWorkerCount >= MAX_WORKERS) {
      console.warn(`[AntiCrash] Max ${MAX_WORKERS} Shared Workers reached. Blocked.`);
      throw new Error("[AntiCrash] Shared Worker limit reached. Blocked.");
    }
    const shared = new originalSharedWorker(...args);
    sharedWorkerCount++;
    return shared;
  };

  console.log("[AntiCrash] Worker Protection active");
})();
