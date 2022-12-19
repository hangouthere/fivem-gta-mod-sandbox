# ENV

Add build proc as another container, use docker-compose profiles

# Utils

* Finish separating into their own modules
* Identify how to `exports` them for other resources to consume/use

# WhatAmI

* Needs more cleanup from prototype
* Identify
* Clean up text generation functions
  * They feel too tied to the impl, needs to be generic enough to apply FOV text to any entity easily... Close, but not quite there yet
* Identify a better way to visualize targeted entity
  * Store targeted entity beyond scope of current process.
* More features!
  * Do things to aforementioend targeted entity!
    * Kill, tp, etc!
  * Visualize inner/outer view distance changes?
  * Clean up current console/chat output to something non-junky looking
  * Create HELP feature for Resource
* Whatever cleanup necessary to isolate as it's *own* Resource, and deliverables.
  * Be sure to mark dependencies in `fxmanifest.lua`!

# Documentation

* Make sure all code itself is documented to some degree!
* docker parent project, and this project need dev control updates
* Need to update docs for docker proj to have tidbit about some env vars
  * `NO_LICENSE=1` && `NO_DEFAULT_CONFIG=1` together to enable txadmin
  * To disable use of txadmin, must supply either `NO_LICENSE=1`, or supply `LICENSE_KEY` env var
    * This is due to the docker image we're basing off, and simply because
* Documentation about RCON flow
  * Alternative is supplying your own command via env var.


# Generic Proxy Idea
* Consider similar to auth'd routes
* Use a temp short-lived token, maybe even JWT
* Do a simple `globalThis` check for existing method prior to exec
  * return native error response (can I do this?)
  * https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/onNet-server/
  * https://docs.fivem.net/docs/scripting-reference/runtimes/javascript/functions/emitNet-client/
