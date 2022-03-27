# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [0.1.2](https://github.com/jscutlery/devkit/compare/microwave-0.1.1...microwave-0.1.2) (2022-03-27)



## [0.1.1](https://github.com/jscutlery/devkit/compare/microwave-0.1.0...microwave-0.1.1) (2021-12-23)


### Bug Fixes

* **microwave:** 🐞 remove invalid deps & peerDeps ([bb58f67](https://github.com/jscutlery/devkit/commit/bb58f67cce541d5a52662ba83ad4eb74eeb7b4ad))



# 0.1.0 (2021-12-22)


### Bug Fixes

* **microwave:** 🐞 fix asapStrategy coalescing ([088c5f0](https://github.com/jscutlery/devkit/commit/088c5f0caa06a314fcf4a753d802b9c6f55a7467))
* **microwave:** 🐞 fix ngOnInit & ngOnDestroy binding ([8d58ed9](https://github.com/jscutlery/devkit/commit/8d58ed95895a03e6e019f24971bb9a9e27a2c896))


### Features

* **microwave:** ✨ add async strategy ([616fb4c](https://github.com/jscutlery/devkit/commit/616fb4c004a8b773d9ff415a6494f6a671763b7d))
* **microwave:** ✨ add initialized$ to strategy devkit ([a8d8e13](https://github.com/jscutlery/devkit/commit/a8d8e133bc8b822b18aa8935c25d2aa77a8c78b1))
* **microwave:** ✨ add proper support for strategy customization ([be0cc74](https://github.com/jscutlery/devkit/commit/be0cc74a077422da30800a08668381c2cabdaed6))
* **microwave:** ✨ add requestAnimationFrame strategy ([c1a5094](https://github.com/jscutlery/devkit/commit/c1a5094234baad6a52afe98ec0312b3217388843))
* **microwave:** ✨ add syncStrategy ([051412f](https://github.com/jscutlery/devkit/commit/051412f936f3244c747e5350539601f78a4570ba))
* **microwave:** ✨ allow custom strategies ([ae088ca](https://github.com/jscutlery/devkit/commit/ae088ca424a1cf0ecc4c9dbde95ce8ce68753aa9))
* **microwave:** ✨ allow watch in constructor ([ab31b3e](https://github.com/jscutlery/devkit/commit/ab31b3efb7a83ba6545c729ad707ba447a9cd773))
* **microwave:** ✨ detach change detector ([5b7c086](https://github.com/jscutlery/devkit/commit/5b7c086cbb697f406e8ce7d5645ba01e6cef4f66))
* **microwave:** ✨ initialized$ & destroyed$ complete on first emit ([2e2e13f](https://github.com/jscutlery/devkit/commit/2e2e13f9f455db57b563c39df788ef90dafc67b2))
* **microwave:** ✨ stop watching changes on destroy ([636947b](https://github.com/jscutlery/devkit/commit/636947bd99eb7f2acd75ce2d143ada2109929a29))
* **microwave:** ✨ trigger change detection after one tick ([6d5010e](https://github.com/jscutlery/devkit/commit/6d5010edf1ff369d2bd407a69c41c14998d0fe9d))
* **microwave:** ✨ trigger change detection on field change ([0b8e4a0](https://github.com/jscutlery/devkit/commit/0b8e4a0c23bd864c37aa7460424acb37e97c31a7))
* **microwave:** ✨ watch fields ([d1330b9](https://github.com/jscutlery/devkit/commit/d1330b904fe1453bb2cbaa7be799447e14791653))
* **microwave:** ✨ watch throws error if component is not microwaved ([d8c2c79](https://github.com/jscutlery/devkit/commit/d8c2c795d2ff350b85728b5ba5fd53342e65f2f0))


### Performance Improvements

* **microwave:** ⚡️ skip change detection if prop's value doesn't change ([4f5a5e6](https://github.com/jscutlery/devkit/commit/4f5a5e69e27767e32296b6a58c81cb66020a3d20))
