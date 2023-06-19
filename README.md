<p align="center">
  <img src="media/umbrella-logo.png" width="100" alt="Repository logo" />
</p>
<h3 align="center">Umbrella</h3>
<p align="center">Weather forecast wallpaper<p>
<p align="center"><a href="https://lhbelfanti.gitlab.io/umbrella/"><strong>➥ Live Demo</strong></a></p>
<p align="center">
    <img src="https://img.shields.io/github/repo-size/lhbelfanti/advent?label=Repo%20size" alt="Repo size" />
    <img src="https://img.shields.io/github/license/lhbelfanti/advent?label=License" alt="License" />
</p>

---

# Weather forecast wallpaper

Web project based on [RainEffect project](https://github.com/codrops/RainEffect).

## Preview
<img src="./media/umbrella.gif" width="500" alt="Umbrella project preview" />

## Implemented functionalities
- Real time forecast of the following 5 days.
   - The max, min and average temperature of each day, with its icon.
- Temperature units: Centigrade and Fahrenheit.
- Different languages and locations.

### Steps to configure the project
1. Install [npm](https://docs.npmjs.com/getting-started/installing-node).
2. Install [gulp](https://www.npmjs.com/package/gulp-install)
3. Go to project root folder and run:
    1. `npm install` - to install dependencies
    2. `gulp build` - to build the project.
4. Add the Open Weather App ID inside [weather-api.json](./src/js/configs/weather-api.json)

Project configured!

### Steps to run the project
1. Run `npm install -g live-server`. 
   1. More about live-server package [here](https://github.com/tapio/live-server).
2. Go inside the build (create by the `gulp build` command) folder and run `live-server`.

Project running!

---
## License

[MIT](https://choosealicense.com/licenses/mit/)