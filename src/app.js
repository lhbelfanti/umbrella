import 'core-js';
import Rain_renderer from "./rain_effect/rain_renderer";
import Raindrops from "./rain_effect/raindrops";
import TexturesLoader from "./utils/textures_loader";
import TweenLite from 'gsap';
import times from './utils/times';
import {random, chance} from './utils/random';
import WeatherInfo from "./weather/weather-info";
import texturesConfig from "./configs/textures";
import Canvas from "./rain_effect/canvas";

export default class App {
  constructor() {
    this.raindrops = null;
    this.renderer = null;
    this.parallax = {x: 0, y: 0};
    this.weatherInfo = null;
    this.weatherData = null;
    this.curWeatherData = null;
    this.blend = {v: 0};
    this.textureFg = null;
    this.textureFgCtx = null;
    this.textureBg = null;
    this.textureBgCtx = null;
    this.canvas = null;

    this.textureBgSize = texturesConfig.sizes.textureBgSize;
    this.textureFgSize = texturesConfig.sizes.textureFgSize;
    this.textures = new TexturesLoader(this.init.bind(this));
  }

  init() {
    this.canvas = new Canvas();

    this.weatherInfo = new WeatherInfo("3433955", "metric");

    this.raindrops = new Raindrops(
      this.canvas.width,
      this.canvas.height,
      this.canvas.dpi,
      this.textures.dropAlpha,
      this.textures.dropColor,
      {
        trailRate: 1,
        trailScaleRange: [0.2, 0.45],
        collisionRadius: 0.45,
        dropletsCleaningRadiusMultiplier: 0.28,
      }
    );

    this.textureFg = this.canvas.createCanvas(this.textureFgSize.width, this.textureFgSize.height);
    this.textureFgCtx = this.textureFg.getContext('2d');
    this.textureBg = this.canvas.createCanvas(this.textureBgSize.width, this.textureBgSize.height);
    this.textureBgCtx = this.textureBg.getContext('2d');

    this.generateTextures(this.textures.textureRainFg, this.textures.textureRainBg);

    this.renderer = new Rain_renderer(this.canvas, this.raindrops.canvas, this.textureFg, this.textureBg, null, {
      brightness: 1.04,
      alphaMultiply: 6,
      alphaSubtract: 3,
      // minRefraction:256,
      // maxRefraction:512
    });

    this.setupEvents();
  }

  setupEvents() {
    this.setupParallax();
    this.setupWeather();
    this.setupFlash();
  }

  setupParallax() {
    document.addEventListener('mousemove', (event) => {
      let x = event.pageX;
      let y = event.pageY;

      TweenLite.to(this.parallax, 1, {
        x: ((x / this.canvas.width) * 2) - 1,
        y: ((y / this.canvas.height) * 2) - 1,
        ease: Quint.easeOut,
        onUpdate: () => {
          this.renderer.parallaxX = this.parallax.x;
          this.renderer.parallaxY = this.parallax.y;
        }
      })
    });
  }

  setupFlash() {
    setInterval(() => {
      if (chance(this.curWeatherData.flashChance)) {
        this.flash(this.curWeatherData.bg, this.curWeatherData.fg, this.curWeatherData.flashBg, this.curWeatherData.flashFg);
      }
    }, 500)
  }

  setupWeather() {
    this.setupWeatherData();
    window.addEventListener("hashchange", () => {
      this.updateWeather();
    });
    this.updateWeather();
  }

  weather(data, defaultWeather) {
    return Object.assign({}, defaultWeather, data);
  }

  setupWeatherData() {
    let defaultWeather = {
      raining: true,
      minR: 20,
      maxR: 50,
      rainChance: 0.35,
      rainLimit: 6,
      dropletsRate: 50,
      dropletsSize: [3, 5.5],
      trailRate: 1,
      trailScaleRange: [0.25, 0.35],
      fg: this.textures.textureRainFg,
      bg: this.textures.textureRainBg,
      flashFg: null,
      flashBg: null,
      flashChance: 0,
      collisionRadiusIncrease: 0.0002
    };

    this.weatherData = {
      rain: this.weather({
          rainChance: 0.35,
          dropletsRate: 50,
          raining: true,
          fg: this.textures.textureRainFg,
          bg: this.textures.textureRainBg
        },
        defaultWeather),
      thunderstorm: this.weather({
          maxR: 55,
          rainChance: 0.4,
          dropletsRate: 80,
          dropletsSize: [3, 5.5],
          trailRate: 2.5,
          trailScaleRange: [0.25, 0.4],
          fg: this.textures.textureRainFg,
          bg: this.textures.textureRainBg,
          flashFg: this.textures.textureStormLightningFg,
          flashBg: this.textures.textureStormLightningBg,
          flashChance: 0.1
        },
        defaultWeather),
      /*fallout:weather({
        minR:30,
        maxR:60,
        rainChance:0.35,
        dropletsRate:20,
        trailRate:4,
        fg:textureFalloutFg,
        bg:textureFalloutBg,
        collisionRadiusIncrease:0
      }),*/
      drizzle: this.weather({
          minR: 10,
          maxR: 40,
          rainChance: 0.15,
          rainLimit: 2,
          dropletsRate: 10,
          dropletsSize: [3.5, 6],
          fg: this.textures.textureDrizzleFg,
          bg: this.textures.textureDrizzleBg
        },
        defaultWeather),
      clouds: this.weather({
          rainChance: 0,
          rainLimit: 0,
          droplets: 0,
          raining: false,
          fg: this.textures.textureCloudsFg,
          bg: this.textures.textureCloudsBg
        },
        defaultWeather),
      clear: this.weather({
          rainChance: 0,
          rainLimit: 0,
          droplets: 0,
          raining: false,
          fg: this.textures.textureSunFg,
          bg: this.textures.textureSunBg
        },
        defaultWeather),
    };

    this.loadMinDateInfo();
  }

  updateWeather() {
    let hash = window.location.hash;
    let currentSlide = null;
    let shouldReload = false;
    if (hash !== "") {
      currentSlide = document.querySelector(hash);
    }
    if (currentSlide == null) {
      currentSlide = document.querySelector(".slide");
      hash = "#" + currentSlide.getAttribute("id");
    }

    this.loadWeatherInfo(hash);

    let currentNav = document.querySelector("[href='" + hash + "']");
    let data = this.weatherData[currentSlide.getAttribute('data-weather')];
    this.curWeatherData = data;

    if (!this.weatherInfo.weatherInfoLoaded()) {
      shouldReload = true;
    }

    this.raindrops.options = Object.assign(this.raindrops.options, data);

    this.raindrops.clearDrops();

    TweenLite.fromTo(this.blend, 1, {
      v: 0
    }, {
      v: 1,
      onUpdate: () => {
        this.generateTextures(data.fg, data.bg, this.blend.v);
        this.renderer.updateTextures();
      }
    });

    let lastSlide = document.querySelector(".slide--current");
    if (lastSlide != null) lastSlide.classList.remove("slide--current");

    let lastNav = document.querySelector(".nav-item--current");
    if (lastNav != null) lastNav.classList.remove("nav-item--current");

    currentSlide.classList.add("slide--current");
    currentNav.classList.add("nav-item--current");

    if (shouldReload) {
      window.setTimeout(() => {
        this.updateWeather();
      }, 2000);
    }
  }

  transitionFlash(to, t = 0.025, baseFg, baseBg, flashFg, flashBg, flashValue) {
    return new Promise((resolve, reject) => {
      TweenLite.to(flashValue, t, {
        v: to,
        ease: Quint.easeOut,
        onUpdate: () => {
          this.generateTextures(baseFg, baseBg);
          this.generateTextures(flashFg, flashBg, flashValue.v);
          this.renderer.updateTextures();
        },
        onComplete: () => {
          resolve();
        }
      });
    });
  }

  flash(baseBg, baseFg, flashBg, flashFg) {
    let flashValue = {v: 0};

    let lastFlash = this.transitionFlash(1);
    times(random(2, 7), (i) => {
      lastFlash = lastFlash.then(() => {
        return this.transitionFlash(random(0.1, 1), baseFg, baseBg, flashFg, flashBg, flashValue)
      })
    });
    lastFlash = lastFlash.then(() => {
      return this.transitionFlash(1, 0.1, baseFg, baseBg, flashFg, flashBg, flashValue);
    }).then(() => {
      this.transitionFlash(0, 0.25, baseFg, baseBg, flashFg, flashBg, flashValue);
    });

  }

  generateTextures(fg, bg, alpha = 1) {
    this.textureFgCtx.globalAlpha = alpha;
    this.textureFgCtx.drawImage(fg, 0, 0, this.textureFgSize.width, this.textureFgSize.height);

    this.textureBgCtx.globalAlpha = alpha;
    this.textureBgCtx.drawImage(bg, 0, 0, this.textureBgSize.width, this.textureBgSize.height);
  }

  loadWeatherInfo(hash) {
    if (this.weatherInfo.getJsonData().today.temp === undefined) {
      window.setTimeout(() => {
        this.loadWeatherInfo(hash);
      }, 2000);
    } else {
      let currentSlide = document.querySelector(hash);
      let currentNav = document.querySelector("[href='" + hash + "']");
      let temp = currentSlide.querySelector(hash + "-temp");
      let date = currentSlide.querySelector(hash + "-date");
      let minDate = currentNav.querySelector(hash + "-min-date");
      let tempInfo, dateInfo, minDateInfo, dataWeatherInfo;
      //Today
      if (hash === "#slide-1") {
        tempInfo = this.weatherInfo.getJsonData().today.temp;
        dateInfo = this.weatherInfo.getJsonData().today.date;
        minDateInfo = this.weatherInfo.getJsonData().today.minDate;
        dataWeatherInfo = this.weatherInfo.getJsonData().today.type;
      } else {
        let dayIndex = (hash.charAt(hash.length - 1)) - 1;
        //Sometimes the api return 5 days instead of 6
        if (this.weatherInfo.getJsonData().minWeekData.length === 5) {
          dayIndex--;
        }
        tempInfo = this.weatherInfo.getJsonData().minWeekData[dayIndex].temp;
        dateInfo = this.weatherInfo.getJsonData().minWeekData[dayIndex].date;
        minDateInfo = this.weatherInfo.getJsonData().minWeekData[dayIndex].minDate;
        dataWeatherInfo = this.weatherInfo.getJsonData().minWeekData[dayIndex].type;
      }

      temp.innerHTML = Math.round(tempInfo) + "°<small>C</small>";
      date.innerHTML = dateInfo;
      minDate.innerHTML = minDateInfo;
      currentSlide.setAttribute("data-weather", dataWeatherInfo);
    }
  }

  loadMinDateInfo() {
    if (this.weatherInfo.getJsonData().today.temp === undefined) {
      window.setTimeout(() => {
        this.loadMinDateInfo();
      }, 2000);
    } else {
      let hash = "#slide-";
      let currentHash, currentNav, minDateSpan, minDateInfo, dayIndex, dataIcon, iconInfo;
      for (let i = 0; i < 5; i++) {
        currentHash = hash + (i + 1);
        currentNav = document.querySelector("[href='" + currentHash + "']");
        minDateSpan = currentNav.querySelector(currentHash + "-min-date");
        dataIcon = currentNav.querySelector(".icon");
        //Today
        if (currentHash === "#slide-1") {
          minDateInfo = this.weatherInfo.getJsonData().today.minDate;
          iconInfo = this.weatherInfo.getJsonData().today.icon;
        } else {
          dayIndex = (currentHash.charAt(currentHash.length - 1)) - 1;
          //Sometimes the api return 5 days instead of 6
          if (this.weatherInfo.getJsonData().minWeekData.length === 5) {
            dayIndex--;
          }
          minDateInfo = this.weatherInfo.getJsonData().minWeekData[dayIndex].minDate;
          iconInfo = this.weatherInfo.getJsonData().minWeekData[dayIndex].icon;
        }
        minDateSpan.innerHTML = minDateInfo;
        dataIcon.setAttribute("data-icon", iconInfo);
      }
    }
  }
}






