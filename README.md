### browser-hive-compute
A compatibility layer for using [gpujs-hive-compute](https://github.com/HarshKhandeparkar/gpujs-hive-compute) in the browser!

### Table of Contents
- [Usage](#usage)
- [Caveats](#caveats)
- [License](LICENSE)

### Usage
You can get the latest dist files in the [releases page](https://github.com/HarshKhandeparkar/browser-hive-compute). The release version corresponds to the release version of the main library.
You also need to include [gpu.js](https://github.com/gpujs/gpu.js) dist separately.

Include the dist files in HTML, at the end of the body.
```html
  <script src="path/to/gpu.browser.min.js"></script> <!--GPU.js dist-->
  <script src="path/to/gpujs-hive-compute-browser.min.js"></script> <!-- Browser Hive Compute dist-->
  <script src="path/to/your-js-file.js"></script> <!-- This file contains the main code and HAS TO BE included after the above two dist files -->
</body>
```

You can access the `hiveHelp` method under the global namespace `GPUsHiveCompute`. `hiveRun` is not available, read [caveats](#caveats).

Read the `hiveHelp` docs [here](https://github.com/gpujs-hive-compute).

```js
const gpu = new GPU();

hiveHelp(
  gpu,
  url,
  logFunction // Same as gpujs-hive-compute, read the docs.
)
```

See the example in `demo/`. You can also directly use the `demo/index.html` to run in a browser, if you want a simple UI.

### Caveats
- `runHive` cannot run in a browser since it needs to start a *server*.

****
#### Thank You!
> Open Source by Harsh Khandeparkar