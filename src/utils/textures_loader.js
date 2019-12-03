import textures from '../configs/textures.json'

export default class TexturesLoader {
  constructor(loadFinished) {
    this.loadTextures(textures.textures)
      .then( (textures) => {
        this.assignTextures(textures);
        loadFinished();
      });
  }

  assignTextures(data) {
    let textures = Object.assign({}, ...data.map(s => ({[s.name]: s.img})));
    this.textureRainFg = textures.textureRainFg;
    this.textureRainBg = textures.textureRainBg;
    this.textureStormLightningFg = textures.textureStormLightningFg;
    this.textureStormLightningBg = textures.textureStormLightningBg;
    this.textureSunFg = textures.textureSunFg;
    this.textureSunBg = textures.textureSunBg;
    this.textureDrizzleFg = textures.textureDrizzleFg;
    this.textureDrizzleBg = textures.textureDrizzleBg;
    this.textureCloudsFg = textures.textureCloudsFg;
    this.textureCloudsBg = textures.textureCloudsBg;
    this.dropColor = textures.dropColor;
    this.dropAlpha = textures.dropAlpha;
  };

  loadTextures(textures) {
    // Need to wait until all the images are loaded
    return Promise.all(textures.map((texture) => {
      return this.loadTexture(texture);
    }));
  };

  loadTexture(texture) {
    return new Promise((res, rej) => {
      let img = new Image();
      img.onload = () => {
        texture.img = img;
        res(texture);
      };
      img.src = texture.src; // Loading image
    });
  };
}