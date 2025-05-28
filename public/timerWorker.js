let targetTime = null;
let interval = null;

self.onmessage = function (e) {
  const { command, data } = e.data;

  console.log({ command, data });

  if (command === "start") {
    targetTime = Date.now() + data.duration * 1000;
    clearInterval(interval);

    interval = setInterval(() => {
      const now = Date.now();
      const remaining = targetTime - now;

      if (remaining <= 0) {
        clearInterval(interval);
        self.postMessage({ type: "finished" });
      } else {
        self.postMessage({ type: "tick", remaining });
      }
    }, 1000); // tick every second
  }

  if (command === "stop") {
    clearInterval(interval);
  }
};
