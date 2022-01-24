# playwright-issue-11566

## Run
```bash
docker build -t testcontainer:latest .
docker run testcontainer:latest
```

## Reproduce the bug
Comment out [line 11](https://github.com/hrueger/playwright-issue-11566/blob/ce4e967fa21ac1164f02ae6a6434fb71a260f977/src/index.ts#L11) and uncomment [line 13](https://github.com/hrueger/playwright-issue-11566/blob/ce4e967fa21ac1164f02ae6a6434fb71a260f977/src/index.ts#L13) in [src/index.ts](src/index.ts) and run the steps above again.

Chromium produces this:
```
docker run testcontainer:latest

> playwright-issue-11566@1.0.0 production
> ts-node src/index.ts

Starting headless browser...
Starting express server...
Server started on port 8080!
Loading 3D Renderer...
-----> [.WebGL-0x3e4e003d1b00]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels
Renderer loaded!
-----> [.WebGL-0x3e4e003d1b00]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels
-----> [.WebGL-0x3e4e003d1b00]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels
-----> [.WebGL-0x3e4e003d1b00]GL Driver Message (OpenGL, Performance, GL_CLOSE_PATH_NV, High): GPU stall due to ReadPixels (this message will no longer repeat)
```
Everything works as expected.

Firefox, however, produces the following output:
```
docker run testcontainer:latest        

> playwright-issue-11566@1.0.0 production
> ts-node src/index.ts

Starting headless browser...
Starting express server...
Server started on port 8080!
Loading 3D Renderer...
-----> [JavaScript Warning: "WebGL warning: <Create>: WebglAllowWindowsNativeGl:false restricts context creation on this system." {file: "http://localhost:8080/serveRenderer/webgl-demo.js" line: 10}]
-----> [JavaScript Warning: "Failed to create WebGL context: WebGL creation failed: 
* WebglAllowWindowsNativeGl:false restricts context creation on this system. ()
* Exhausted GL driver options. (FEATURE_FAILURE_WEBGL_EXHAUSTED_DRIVERS)" {file: "http://localhost:8080/serveRenderer/webgl-demo.js" line: 10}]
Renderer loaded!
```

## Disclaimer
WebGL Example taken from https://github.com/mdn/webgl-examples/tree/gh-pages/tutorial/sample7