// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/Preloader.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Preloader = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Preloader = /*#__PURE__*/function () {
  function Preloader(options) {
    _classCallCheck(this, Preloader);

    this.assets = {};

    var _iterator = _createForOfIteratorHelper(options.assets),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var asset = _step.value;
        this.assets[asset] = {
          loaded: 0,
          complete: false
        };
        this.load(asset);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    this.container = options.container;

    if (options.onprogress == undefined) {
      this.onprogress = onprogress;
      this.domElement = document.createElement("div");
      this.domElement.style.position = "absolute";
      this.domElement.style.top = "0";
      this.domElement.style.left = "0";
      this.domElement.style.width = "100%";
      this.domElement.style.height = "100%";
      this.domElement.style.background = "#000";
      this.domElement.style.opacity = "0.7";
      this.domElement.style.display = "flex";
      this.domElement.style.alignItems = "center";
      this.domElement.style.justifyContent = "center";
      this.domElement.style.zIndex = "1111";
      var barBase = document.createElement("div");
      barBase.style.background = "#aaa";
      barBase.style.width = "50%";
      barBase.style.minWidth = "250px";
      barBase.style.borderRadius = "10px";
      barBase.style.height = "15px";
      this.domElement.appendChild(barBase);
      var bar = document.createElement("div");
      bar.style.background = "#2a2";
      bar.style.width = "50%";
      bar.style.borderRadius = "10px";
      bar.style.height = "100%";
      bar.style.width = "0";
      barBase.appendChild(bar);
      this.progressBar = bar;

      if (this.container != undefined) {
        this.container.appendChild(this.domElement);
      } else {
        document.body.appendChild(this.domElement);
      }
    } else {
      this.onprogress = options.onprogress;
    }

    this.oncomplete = options.oncomplete;
    var loader = this;

    function onprogress(delta) {
      var progress = delta * 100;
      loader.progressBar.style.width = "".concat(progress, "%");
    }
  }

  _createClass(Preloader, [{
    key: "checkCompleted",
    value: function checkCompleted() {
      for (var prop in this.assets) {
        var asset = this.assets[prop];
        if (!asset.complete) return false;
      }

      return true;
    }
  }, {
    key: "progress",
    get: function get() {
      var total = 0;
      var loaded = 0;

      for (var prop in this.assets) {
        var asset = this.assets[prop];

        if (asset.total == undefined) {
          loaded = 0;
          break;
        }

        loaded += asset.loaded;
        total += asset.total;
      }

      return loaded / total;
    }
  }, {
    key: "load",
    value: function load(url) {
      var loader = this;
      var xobj = new XMLHttpRequest();
      xobj.open("GET", url, true);

      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          loader.assets[url].complete = true;

          if (loader.checkCompleted()) {
            if (loader.domElement != undefined) {
              if (loader.container != undefined) {
                loader.container.removeChild(loader.domElement);
              } else {
                document.body.removeChild(loader.domElement);
              }
            }

            loader.oncomplete();
          }
        }
      };

      xobj.onprogress = function (e) {
        var asset = loader.assets[url];
        asset.loaded = e.loaded;
        asset.total = e.total;
        loader.onprogress(loader.progress);
      };

      xobj.send(null);
    }
  }]);

  return Preloader;
}();

exports.Preloader = Preloader;
},{}],"src/Easing.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Easing = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Easing = /*#__PURE__*/function () {
  // t: current time, b: begInnIng value, c: change In value, d: duration
  function Easing(start, end, duration) {
    var startTime = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var type = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "linear";

    _classCallCheck(this, Easing);

    this.b = start;
    this.c = end - start;
    this.d = duration;
    this.type = type;
    this.startTime = startTime;
  }

  _createClass(Easing, [{
    key: "value",
    value: function value(time) {
      this.t = time - this.startTime;
      return this[this.type]();
    }
  }, {
    key: "linear",
    value: function linear() {
      return this.c * (this.t / this.d) + this.b;
    }
  }, {
    key: "inQuad",
    value: function inQuad() {
      return this.c * (this.t /= this.d) * this.t + this.b;
    }
  }, {
    key: "outQuad",
    value: function outQuad() {
      return -this.c * (this.t /= this.d) * (this.t - 2) + this.b;
    }
  }, {
    key: "inOutQuad",
    value: function inOutQuad() {
      if ((this.t /= this.d / 2) < 1) return this.c / 2 * this.t * this.t + this.b;
      return -this.c / 2 * (--this.t * (this.t - 2) - 1) + this.b;
    }
  }, {
    key: "projectile",
    value: function projectile() {
      var c = this.c;
      var b = this.b;
      var t = this.t;
      this.t *= 2;
      var result;
      var func;

      if (this.t < this.d) {
        result = this.outQuad();
        func = "outQuad";
      } else {
        this.t -= this.d;
        this.b += c;
        this.c = -c;
        result = this.inQuad();
        func = "inQuad";
      }

      console.log("projectile: " + result.toFixed(2) + " time:" + this.t.toFixed(2) + " func:" + func);
      this.b = b;
      this.c = c;
      this.t = t;
      return result;
    }
  }, {
    key: "inCubic",
    value: function inCubic() {
      return this.c * (this.t /= this.d) * this.t * this.t + this.b;
    }
  }, {
    key: "outCubic",
    value: function outCubic() {
      return this.c * ((this.t = this.t / this.d - 1) * this.t * this.t + 1) + this.b;
    }
  }, {
    key: "inOutCubic",
    value: function inOutCubic() {
      if ((this.t /= this.d / 2) < 1) return this.c / 2 * this.t * this.t * this.t + this.b;
      return this.c / 2 * ((this.t -= 2) * this.t * this.t + 2) + this.b;
    }
  }, {
    key: "inQuart",
    value: function inQuart() {
      return this.c * (this.t /= this.d) * this.t * this.t * this.t + this.b;
    }
  }, {
    key: "outQuart",
    value: function outQuart() {
      return -this.c * ((this.t = this.t / this.d - 1) * this.t * this.t * this.t - 1) + this.b;
    }
  }, {
    key: "inOutQuart",
    value: function inOutQuart() {
      if ((this.t /= this.d / 2) < 1) return this.c / 2 * this.t * this.t * this.t * this.t + this.b;
      return -this.c / 2 * ((this.t -= 2) * this.t * this.t * this.t - 2) + this.b;
    }
  }, {
    key: "inQuint",
    value: function inQuint() {
      return this.c * (this.t /= this.d) * this.t * this.t * this.t * this.t + this.b;
    }
  }, {
    key: "outQuint",
    value: function outQuint() {
      return this.c * ((this.t = this.t / this.d - 1) * this.t * this.t * this.t * this.t + 1) + this.b;
    }
  }, {
    key: "inOutQuint",
    value: function inOutQuint() {
      if ((this.t /= this.d / 2) < 1) return this.c / 2 * this.t * this.t * this.t * this.t * this.t + this.b;
      return this.c / 2 * ((this.t -= 2) * this.t * this.t * this.t * this.t + 2) + this.b;
    }
  }, {
    key: "inSine",
    value: function inSine() {
      return -this.c * Math.cos(this.t / this.d * (Math.PI / 2)) + this.c + this.b;
    }
  }, {
    key: "outSine",
    value: function outSine() {
      return this.c * Math.sin(this.t / this.d * (Math.PI / 2)) + this.b;
    }
  }, {
    key: "inOutSine",
    value: function inOutSine() {
      return -this.c / 2 * (Math.cos(Math.PI * this.t / this.d) - 1) + this.b;
    }
  }, {
    key: "inExpo",
    value: function inExpo() {
      return this.t == 0 ? this.b : this.c * Math.pow(2, 10 * (this.t / this.d - 1)) + this.b;
    }
  }, {
    key: "outExpo",
    value: function outExpo() {
      return this.t == this.d ? this.b + this.c : this.c * (-Math.pow(2, -10 * this.t / this.d) + 1) + this.b;
    }
  }, {
    key: "inOutExpo",
    value: function inOutExpo() {
      if (this.t == 0) return this.b;
      if (this.t == this.d) return this.b + this.c;
      if ((this.t /= this.d / 2) < 1) return this.c / 2 * Math.pow(2, 10 * (this.t - 1)) + this.b;
      return this.c / 2 * (-Math.pow(2, -10 * --this.t) + 2) + this.b;
    }
  }, {
    key: "inCirc",
    value: function inCirc() {
      return -this.c * (Math.sqrt(1 - (this.t /= this.d) * this.t) - 1) + this.b;
    }
  }, {
    key: "outCirc",
    value: function outCirc() {
      return this.c * Math.sqrt(1 - (this.t = this.t / this.d - 1) * this.t) + this.b;
    }
  }, {
    key: "inOutCirc",
    value: function inOutCirc() {
      if ((this.t /= this.d / 2) < 1) return -this.c / 2 * (Math.sqrt(1 - this.t * this.t) - 1) + this.b;
      return this.c / 2 * (Math.sqrt(1 - (this.t -= 2) * this.t) + 1) + this.b;
    }
  }, {
    key: "inElastic",
    value: function inElastic() {
      var s = 1.70158,
          p = 0,
          a = this.c;
      if (this.t == 0) return this.b;
      if ((this.t /= this.d) == 1) return this.b + this.c;
      if (!p) p = this.d * 0.3;

      if (a < Math.abs(this.c)) {
        a = this.c;

        var _s = p / 4;
      } else {
        var _s2 = p / (2 * Math.PI) * Math.asin(this.c / a);
      }

      return -(a * Math.pow(2, 10 * (this.t -= 1)) * Math.sin((this.t * this.d - s) * (2 * Math.PI) / p)) + this.b;
    }
  }, {
    key: "outElastic",
    value: function outElastic() {
      var s = 1.70158,
          p = 0,
          a = this.c;
      if (this.t == 0) return this.b;
      if ((this.t /= this.d) == 1) return this.b + this.c;
      if (!p) p = this.d * 0.3;

      if (a < Math.abs(this.c)) {
        a = this.c;

        var _s3 = p / 4;
      } else {
        var _s4 = p / (2 * Math.PI) * Math.asin(this.c / a);
      }

      return a * Math.pow(2, -10 * this.t) * Math.sin((this.t * this.d - s) * (2 * Math.PI) / p) + this.c + this.b;
    }
  }, {
    key: "inOutElastic",
    value: function inOutElastic() {
      var s = 1.70158,
          p = 0,
          a = this.c;
      if (this.t == 0) return this.b;
      if ((this.t /= this.d / 2) == 2) return this.b + this.c;
      if (!p) p = this.d * (0.3 * 1.5);

      if (a < Math.abs(this.c)) {
        a = this.c;

        var _s5 = p / 4;
      } else {
        var _s6 = p / (2 * Math.PI) * Math.asin(this.c / a);
      }

      if (this.t < 1) return -0.5 * (a * Math.pow(2, 10 * (this.t -= 1)) * Math.sin((this.t * this.d - s) * (2 * Math.PI) / p)) + this.b;
      return a * Math.pow(2, -10 * (this.t -= 1)) * Math.sin((this.t * this.d - s) * (2 * Math.PI) / p) * 0.5 + this.c + this.b;
    }
  }, {
    key: "inBack",
    value: function inBack() {
      var s = 1.70158;
      return this.c * (this.t /= this.d) * this.t * ((s + 1) * this.t - s) + this.b;
    }
  }, {
    key: "outBack",
    value: function outBack() {
      var s = 1.70158;
      return this.c * ((this.t = this.t / this.d - 1) * this.t * ((s + 1) * this.t + s) + 1) + this.b;
    }
  }, {
    key: "inOutBack",
    value: function inOutBack() {
      var s = 1.70158;
      if ((this.t /= this.d / 2) < 1) return this.c / 2 * (this.t * this.t * (((s *= 1.525) + 1) * this.t - s)) + this.b;
      return this.c / 2 * ((this.t -= 2) * this.t * (((s *= 1.525) + 1) * this.t + s) + 2) + this.b;
    }
  }, {
    key: "inBounce",
    value: function inBounce() {
      var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.t;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.b;
      return this.c - this.outBounce(this.d - t, 0) + b;
    }
  }, {
    key: "outBounce",
    value: function outBounce() {
      var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.t;
      var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.b;

      if ((t /= this.d) < 1 / 2.75) {
        return this.c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return this.c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
      } else if (t < 2.5 / 2.75) {
        return this.c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
      } else {
        return this.c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
      }
    }
  }, {
    key: "inOutBounce",
    value: function inOutBounce() {
      if (this.t < this.d / 2) return this.inBounce(this.t * 2, 0) * 0.5 + this.b;
      return this.outBounce(this.t * 2 - this.d, 0) * 0.5 + this.c * 0.5 + this.b;
    }
  }]);

  return Easing;
}();

exports.Easing = Easing;
},{}],"src/index.js":[function(require,module,exports) {
"use strict";

var _Preloader = require("./Preloader");

var _Easing = require("./Easing");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ASSET_PATH = "https://raw.githubusercontent.com/mgavillo/files/master/";
var PI = 3.141592653;
var PI_2 = 1.570796326;
var PI_3 = 3 * Math.PI / 2;

var Game = /*#__PURE__*/function () {
  function Game() {
    _classCallCheck(this, Game);

    this.modes = Object.freeze({
      NONE: Symbol("none"),
      PRELOAD: Symbol("preload"),
      INITIALISING: Symbol("initialising"),
      CREATING_LEVEL: Symbol("creating_level"),
      ACTIVE: Symbol("active"),
      GAMEOVER: Symbol("gameover")
    });
    this.mode = this.modes.NONE;
    this.container = document.getElementById('renderContainer');
    this.player = {
      move: 0,
      moveDir: [],
      action: null
    };
    this.camera = {
      object: {},
      fade: 0.05
    };
    this.stats;
    this.scene;
    this.renderer;
    this.controls;
    this.debug = true;
    var game = this;
    this.anims = ["look-around", "ascend-stairs", "gather-objects", "push-button", "run"];
    var options = {
      assets: [],
      oncomplete: function oncomplete() {
        game.init();
      }
    };
    this.anims.forEach(function (anim) {
      options.assets.push("".concat(ASSET_PATH).concat(anim, ".fbx"));
    });
    this.mode = this.modes.PRELOAD;
    this.clock = new THREE.Clock();
    var preloader = new _Preloader.Preloader(options);
  }

  _createClass(Game, [{
    key: "hemisphereLight",
    value: function hemisphereLight() {
      var sky = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0xE7D0A7;
      var ground = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0x795939;
      var intensity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var light1 = new THREE.AmbientLight(0x404040); // soft white light

      this.scene.add(light1);
      var light = new THREE.HemisphereLight(sky, ground, intensity);
      light.position.set(0, 200, 0);
      return light;
    }
  }, {
    key: "lensFlare",
    value: function lensFlare() {
      var light = new THREE.PointLight(0xffffff, 1.5, 2000);
      light.position.set([0, 0, 60]);
      light.rotation.set([0, 90, 0]);
      var textureLoader = new THREE.TextureLoader();
      var textureFlare0 = textureLoader.load("".concat(ASSET_PATH, "lensFlare-01.png"));
      var textureFlare1 = textureLoader.load("".concat(ASSET_PATH, "lensFlare1-02.png"));
      var textureFlare2 = textureLoader.load("".concat(ASSET_PATH, "lensFlare2-03.png"));
      var lensflare = new THREE.Lensflare();
      lensflare.addElement(new THREE.LensflareElement(textureFlare0, 512, 0));
      lensflare.addElement(new THREE.LensflareElement(textureFlare1, 512, 10));
      lensflare.addElement(new THREE.LensflareElement(textureFlare2, 60, 0.6));
      var geometry = new THREE.BoxGeometry(0, 10, 0);
      var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      });
      var cube = new THREE.Mesh(geometry, material);
      this.cube.position = [0, 10, 0];
      this.scene.add(cube);
      light.add(lensflare);
    }
  }, {
    key: "directionalLight",
    value: function directionalLight() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0xf0e2c1;
      var light = new THREE.DirectionalLight(color);
      light.position.set(10, 10, 10);
      light.rotation.set([0, -76.5494, 0]);
      light.castShadow = true;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.top = 3000;
      light.shadow.camera.bottom = -3000;
      light.shadow.camera.left = -3000;
      light.shadow.camera.right = 3000;
      light.shadow.camera.far = 3000; // light.add(this.lensFlare())

      return light;
    }
  }, {
    key: "initRenderer",
    value: function initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.alpha = true;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

      this.renderer.shadowMapDebug = true;
      this.container.appendChild(this.renderer.domElement);
    }
  }, {
    key: "addWindowListeners",
    value: function addWindowListeners() {
      window.addEventListener("resize", function () {
        game.onWindowResize();
      }, false);
      window.addEventListener("keydown", function (evt) {
        switch (evt.key) {
          case 'ArrowDown':
            game.player.move = 1;
            if (game.player.moveDir.indexOf(0) == -1) game.player.moveDir.push(0);
            game.action = "run";
            break;

          case 'ArrowUp':
            game.player.move = 1;
            if (game.player.moveDir.indexOf(PI) == -1) game.player.moveDir.push(PI);
            game.action = "run";
            break;

          case 'ArrowLeft':
            game.player.move = 1;
            if (game.player.moveDir.indexOf(PI_3) == -1) game.player.moveDir.push(PI_3);
            game.action = "run";
            break;

          case 'ArrowRight':
            game.player.move = 1;
            if (game.player.moveDir.indexOf(PI_2) == -1) game.player.moveDir.push(PI_2); // game.player.object.rotation.y = Math.PI/2;

            game.action = "run";
            break;
        }
      }, false);
      window.addEventListener("keyup", function (evt) {
        // game.playerControlMove(0)
        if (evt.key === 'ArrowDown') game.player.moveDir.splice(game.player.moveDir.indexOf(0), 1);
        if (evt.key === 'ArrowUp') game.player.moveDir.splice(game.player.moveDir.indexOf(PI), 1);
        if (evt.key === 'ArrowLeft') game.player.moveDir.splice(game.player.moveDir.indexOf(PI_3), 1);
        if (evt.key === 'ArrowRight') game.player.moveDir.splice(game.player.moveDir.indexOf(PI_2), 1);

        if (evt.key === 'ArrowDown' || evt.key === 'ArrowUp' || evt.key === 'ArrowRight' || evt.key === 'ArrowLeft') {
          if (game.player.moveDir.length === 0) game.action = "look-around";
        } // game.playerControlTurn(0)

      }, false);
    }
  }, {
    key: "addButtonListeners",
    value: function addButtonListeners() {
      document.getElementById("camera-btn").onclick = function () {
        game.switchCamera();
      };
    }
  }, {
    key: "initScene",
    value: function initScene() {
      var col = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0x100005;
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(col); // this.scene.fog = new THREE.Fog(col, 500, 1500);
    }
  }, {
    key: "init",
    value: function init() {
      this.mode = this.modes.INITIALISING;
      this.createCamera();
      this.initScene();
      this.scene.add(this.hemisphereLight());
      this.scene.add(this.directionalLight());
      this.loadFirstAnim();
      this.initRenderer();
      this.controls = new THREE.OrbitControls(this.camera.object, this.renderer.domElement); // stats

      if (this.debug) {
        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);
      }

      this.addWindowListeners(); // this.addButtonListeners()
    }
  }, {
    key: "loadSkybox",
    value: function loadSkybox() {
      var loader = new THREE.CubeTextureLoader();
      var texture = loader.load(["".concat(ASSET_PATH, "bluecloud_ft.jpg"), "".concat(ASSET_PATH, "bluecloud_bk.jpg"), "".concat(ASSET_PATH, "bluecloud_up.jpg"), "".concat(ASSET_PATH, "bluecloud_dn.jpg"), "".concat(ASSET_PATH, "bluecloud_rt.jpg"), "".concat(ASSET_PATH, "bluecloud_lf.jpg")]);
      this.scene.background = texture;
      return null;
    }
  }, {
    key: "loadEnvironment",
    value: function loadEnvironment(loader) {
      loader.load("".concat(ASSET_PATH, "island.fbx"), function (object) {
        game.scene.add(object);
        object.receiveShadow = true;
        object.castShadow = true;
        object.name = "Environment";
        object.traverse(function (child) {
          if (child.isMesh) {
            if (child.name.includes("main")) {
              // child.material[0] = new THREE.MeshLambertMaterial({ color: 0x8AE7D4, envMap: game.camera.renderTarget });
              child.material[0] = new THREE.MeshPhysicalMaterial({
                reflectivity: 1.0,
                transmission: 0.5,
                roughness: 0,
                metalness: 0,
                clearcoat: 0.3,
                clearcoatRoughness: 0.25,
                color: new THREE.Color(0x8AE7D4),
                ior: 1.5
              });
              child.castShadow = true;
              child.receiveShadow = true;
            } else if (child.name.includes("mentproxy")) {
              child.material.visible = false;
              game.environmentProxy = child;
            }
          }
        });
        game.loadSkybox();
        game.loadNextAnim(loader);
      }, null, this.onError);
    }
  }, {
    key: "createDummyEnvironment",
    value: function createDummyEnvironment() {
      var env = new THREE.Group();
      env.name = "Environment";
      this.scene.add(env);
      var geometry = new THREE.BoxBufferGeometry(150, 150, 150);
      var material = new THREE.MeshBasicMaterial({
        color: 0xffff00
      });

      for (var x = -1000; x < 1000; x += 300) {
        for (var z = -1000; z < 1000; z += 300) {
          var block = new THREE.Mesh(geometry, material);
          block.position.set(x, 75, z);
          env.add(block);
        }
      }

      this.environmentProxy = env;
    }
  }, {
    key: "loadFirstAnim",
    value: function loadFirstAnim() {
      var loader = new THREE.FBXLoader();
      var game = this;
      loader.load("".concat(ASSET_PATH, "test.fbx"), function (object) {
        object.mixer = new THREE.AnimationMixer(object);
        object.castShadow = true;
        game.player.mixer = object.mixer;
        game.player.root = object.mixer.getRoot();
        object.name = "Character";
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        game.scene.add(object);
        game.player.object = object;
        game.player.walk = object.animations[0];
        game.initCameras();
        game.loadEnvironment(loader);
      }, null, this.onError);
    }
  }, {
    key: "loadNextAnim",
    value: function loadNextAnim(loader) {
      var anim = this.anims.pop();
      var game = this;
      loader.load("".concat(ASSET_PATH).concat(anim, ".fbx"), function (object) {
        game.player[anim] = object.animations[0];

        if (anim === "push-button") {
          game.player[anim].loop = false;
        }

        if (game.anims.length > 0) {
          game.loadNextAnim(loader);
        } else {
          delete game.anims;
          game.action = "look-around";
          game.initPlayerPosition();
          game.animate();
          game.mode = game.modes.ACTIVE;
          this.initialOverlayAnim();
        }
      }, null, this.onError);
    }
  }, {
    key: "initialOverlayAnim",
    value: function initialOverlayAnim() {
      var overlay = document.getElementById("overlay");
      overlay.classList.add("fade-in");
      overlay.addEventListener("animationend", function (evt) {
        evt.target.style.display = "none";
      }, false);
    }
  }, {
    key: "initialCameraAnim",
    value: function initialCameraAnim() {
      setTimeout(function () {
        game.player.cameras.active = game.player.cameras.back;
        game.camera.fade = 0.01;
        setTimeout(function () {
          game.camera.fade = 0.1;
        }, 1500);
      }, 2000);
    }
  }, {
    key: "switchCamera",
    value: function switchCamera() {
      var fade = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.05;
      var cams = Object.keys(this.player.cameras);
      cams.splice(cams.indexOf("active"), 1);
      var index;

      for (var prop in this.player.cameras) {
        if (this.player.cameras[prop] == this.player.cameras.active) {
          index = cams.indexOf(prop) + 1;
          if (index >= cams.length) index = 0;
          this.player.cameras.active = this.player.cameras[cams[index]];
          break;
        }
      }

      this.camera.fade = fade;
    }
  }, {
    key: "initCameras",
    value: function initCameras() {
      var front = new THREE.Object3D();
      front.position.set(112, 100, 200);
      front.parent = this.player.object;
      var back = new THREE.Object3D();
      back.position.set(0, 400, -650);
      back.parent = this.player.object;
      var wide = new THREE.Object3D();
      wide.position.set(178, 139, 465);
      wide.parent = this.player.object;
      var overhead = new THREE.Object3D();
      overhead.position.set(0, 400, 0);
      overhead.parent = this.player.object;
      var collect = new THREE.Object3D();
      collect.position.set(40, 82, 94);
      collect.parent = this.player.object;
      this.player.cameras = {
        front: front,
        back: back,
        wide: wide,
        overhead: overhead,
        collect: collect
      };
      this.player.cameras.active = this.player.cameras.wide;
      this.camera.fade = 1;
      this.initialCameraAnim();
    }
    /**
     * @param  {} fov=80
     * @param  {} aspect=window.innerWidth/window.innerHeight
     * @param  {} near=1
     * @param  {} far=2000
     */

  }, {
    key: "createCamera",
    value: function createCamera() {
      var fov = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 75;
      var aspect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.innerWidth / window.innerHeight;
      var near = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var far = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20000;
      var width = window.innerWidth;
      var height = window.innerHeight; // this.camera.object = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, near, far);

      this.camera.object = new THREE.PerspectiveCamera(fov, aspect, near, far);
    }
    /**
     * @param  {} clientX
     * @param  {} clientY
     * @return pos
     */

  }, {
    key: "getMousePosition",
    value: function getMousePosition(clientX, clientY) {
      var pos = new THREE.Vector2();
      pos.x = clientX / this.renderer.domElement.clientWidth * 2 - 1;
      pos.y = -(clientY / this.renderer.domElement.clientHeight) * 2 + 1;
      return pos;
    }
  }, {
    key: "action",
    set: function set(name) {
      if (this.player.action == name) return;
      var anim = this.player[name];
      var action = this.player.mixer.clipAction(anim, this.player.root);
      var timeScale = 1;
      if (name == "push-button" || name == "gather-objects") action.loop = THREE.LoopOnce;
      this.player.action = name;
      this.player.mixer.stopAllAction();
      action.reset().setEffectiveTimeScale(timeScale).setEffectiveWeight(1).fadeIn(0.5).play();
      this.player.actionTime = Date.now();
    }
  }, {
    key: "initPlayerPosition",
    value: function initPlayerPosition() {
      //cast down
      var dir = new THREE.Vector3(0, -1, 0);
      var pos = this.player.object.position.clone();
      pos.y += 200;
      var raycaster = new THREE.Raycaster(pos, dir);
      var gravity = 30;
      var intersect = raycaster.intersectObject(this.environmentProxy);

      if (intersect.length > 0) {
        this.player.object.position.y = pos.y - intersect[0].distance;
      }
    }
  }, {
    key: "playerControlMove",
    value: function playerControlMove(forward) {
      if (forward == 0) delete this.player.move.forward;else this.player.move.forward = forward;

      if (forward > 0) {
        this.action = "walk";
      } else if (forward < -0.2) {
        this.action = "walk";
      } else {
        this.action = "look-around";
      }
    }
  }, {
    key: "playerControlTurn",
    value: function playerControlTurn(turn) {
      if (turn == 0) delete this.player.move.turn;else this.player.move.turn = turn;
    }
  }, {
    key: "blockedForward",
    value: function blockedForward(pos) {
      var dir = new THREE.Vector3(this.player.moveDir.x, this.player.moveDir.y); // this.player.object.getWorldDirection(dir);
      // if (this.player.move.forward < 0) {
      //     console.log("negate")
      //     dir.negate();
      // }

      var raycaster = new THREE.Raycaster(pos, dir);

      if (this.environmentProxy != undefined) {
        var intersect = raycaster.intersectObject(this.environmentProxy);

        if (intersect.length > 0) {
          if (intersect[0].distance < 50) return true;
        }
      }

      return false;
    }
  }, {
    key: "blockedLeft",
    value: function blockedLeft(pos) {
      var dir = new THREE.Vector3();
      dir.set(-1, 0, 0);
      dir.applyMatrix4(this.player.object.matrix);
      dir.normalize();
      var raycaster = new THREE.Raycaster(pos, dir);
      var intersect = raycaster.intersectObject(this.environmentProxy);

      if (intersect.length > 0) {
        if (intersect[0].distance < 50) this.player.object.translateX(50 - intersect[0].distance);
      }
    }
  }, {
    key: "blockedRight",
    value: function blockedRight(pos) {
      var dir = new THREE.Vector3();
      dir.set(1, 0, 0);
      dir.applyMatrix4(this.player.object.matrix);
      dir.normalize();
      var raycaster = new THREE.Raycaster(pos, dir);
      var intersect = raycaster.intersectObject(this.environmentProxy);

      if (intersect.length > 0) {
        if (intersect[0].distance < 50) this.player.object.translateX(intersect[0].distance - 50);
      }
    }
  }, {
    key: "bBoxFloor",
    value: function bBoxFloor(pos, dt) {
      var dir = new THREE.Vector3();
      dir.set(0, -1, 0);
      pos.y += 200;
      var raycaster = new THREE.Raycaster(pos, dir);
      var gravity = 60;
      var intersect = raycaster.intersectObject(this.environmentProxy);

      if (intersect.length > 0) {
        var targetY = pos.y - intersect[0].distance;

        if (targetY > this.player.object.position.y) {
          //Going up
          this.player.object.position.y = 0.8 * this.player.object.position.y + 0.2 * targetY;
          this.player.velocityY = 0;
        } else if (targetY < this.player.object.position.y) {
          //Falling
          if (this.player.velocityY == undefined) this.player.velocityY = 0;
          this.player.velocityY += dt * gravity;
          this.player.object.position.y -= this.player.velocityY;

          if (this.player.object.position.y < targetY) {
            this.player.velocityY = 0;
            this.player.object.position.y = targetY;
          }
        }
      }
    }
  }, {
    key: "movePlayer",
    value: function movePlayer(dt) {
      console.log("coucou");
      var pos = this.player.object.position.clone();
      pos.y += 60;
      var blocked = false;
      blocked = this.blockedForward(pos);

      if (!blocked) {
        var speed = this.player.action == "run" ? 200 : 100; // this.player.object.position.x += this.player.moveDir.x * dt * speed
        // this.player.object.position.z += this.player.moveDir.y * dt * speed

        this.player.object.translateZ(dt * speed);
      }

      if (this.environmentProxy != undefined) {
        // //cast left
        // this.blockedLeft(pos)
        // //cast right
        // this.blockedRight(pos)
        //cast down
        this.bBoxFloor(pos, dt);
      }
    }
  }, {
    key: "moveCam",
    value: function moveCam() {
      var pos = this.player.object.position.clone();
      this.camera.object.position.x = pos.x;
      this.camera.object.position.y = pos.y + 600;
      this.camera.object.position.z = pos.z + 600;
      this.camera.object.lookAt(pos);
    }
  }, {
    key: "followWithCam",
    value: function followWithCam() {
      if (this.player.cameras && this.player.cameras.active) {
        this.camera.object.position.lerp(this.player.cameras.active.getWorldPosition(new THREE.Vector3()), this.camera.fade);
        var pos;

        if (this.cameraTarget != undefined) {
          this.camera.object.position.copy(this.cameraTarget.position);
          pos = this.cameraTarget.target;
        } else {
          pos = this.player.object.position.clone();
          pos.y += 60;
        }

        this.camera.object.lookAt(pos);
      }
    }
  }, {
    key: "animate",
    value: function animate() {
      var game = this;
      var dt = this.clock.getDelta();
      requestAnimationFrame(function () {
        game.animate();
      });
      this.controls.update(); //update player anim

      if (this.player.mixer != undefined && this.mode == this.modes.ACTIVE) {
        this.player.mixer.update(dt);
      } //player walk


      if (this.player.moveDir.length != 0) this.movePlayer(dt);

      if (this.player.moveDir.length != 0) {
        console.log(this.player.moveDir);
        var turn;

        if (this.player.moveDir.length === 2 && this.player.moveDir.indexOf(0) !== -1 && this.player.moveDir.indexOf(PI_3) !== -1) {
          console.log("wsshhh");
          console.log(PI_3, PI * 2);
          turn = (PI_3 + PI * 2) / 2;
          console.log(turn);
        } else {
          var sum;

          for (var i = 0, sum = 0; i < this.player.moveDir.length; sum += this.player.moveDir[i++]) {
            ;
          }

          turn = sum / this.player.moveDir.length;
        }

        game.player.object.rotation.y = turn;
      } //rotate player
      // if (this.player.move.turn != undefined) this.player.object.rotateY(this.player.move.turn * dt);


      this.moveCam(); // this.followWithCam()

      this.renderer.render(this.scene, this.camera.object);
      if (this.stats != undefined) this.stats.update();
    }
  }, {
    key: "onError",
    value: function onError(error) {
      var msg = console.error(JSON.stringify(error));
      console.error(error.message);
    }
  }, {
    key: "onWindowResize",
    value: function onWindowResize() {
      this.camera.object.aspect = window.innerWidth / window.innerHeight;
      this.camera.object.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }]);

  return Game;
}();

var game = new Game();
},{"./Preloader":"src/Preloader.js","./Easing":"src/Easing.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63383" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map