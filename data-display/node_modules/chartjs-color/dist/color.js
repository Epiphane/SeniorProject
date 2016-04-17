(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* MIT license */
(function() {

    var convert = require("color-convert"),
        string = require("color-string");

    var Color = function(obj) {
        if (obj instanceof Color) return obj;
        if (!(this instanceof Color)) return new Color(obj);

        this.values = {
            rgb: [0, 0, 0],
            hsl: [0, 0, 0],
            hsv: [0, 0, 0],
            hwb: [0, 0, 0],
            cmyk: [0, 0, 0, 0],
            alpha: 1
        }

        // parse Color() argument
        if (typeof obj == "string") {
            var vals = string.getRgba(obj);
            if (vals) {
                this.setValues("rgb", vals);
            } else if (vals = string.getHsla(obj)) {
                this.setValues("hsl", vals);
            } else if (vals = string.getHwb(obj)) {
                this.setValues("hwb", vals);
            } else {
                throw new Error("Unable to parse color from string \"" + obj + "\"");
            }
        } else if (typeof obj == "object") {
            var vals = obj;
            if (vals["r"] !== undefined || vals["red"] !== undefined) {
                this.setValues("rgb", vals)
            } else if (vals["l"] !== undefined || vals["lightness"] !== undefined) {
                this.setValues("hsl", vals)
            } else if (vals["v"] !== undefined || vals["value"] !== undefined) {
                this.setValues("hsv", vals)
            } else if (vals["w"] !== undefined || vals["whiteness"] !== undefined) {
                this.setValues("hwb", vals)
            } else if (vals["c"] !== undefined || vals["cyan"] !== undefined) {
                this.setValues("cmyk", vals)
            } else {
                throw new Error("Unable to parse color from object " + JSON.stringify(obj));
            }
        }
    }

    Color.prototype = {
        rgb: function(vals) {
            return this.setSpace("rgb", arguments);
        },
        hsl: function(vals) {
            return this.setSpace("hsl", arguments);
        },
        hsv: function(vals) {
            return this.setSpace("hsv", arguments);
        },
        hwb: function(vals) {
            return this.setSpace("hwb", arguments);
        },
        cmyk: function(vals) {
            return this.setSpace("cmyk", arguments);
        },

        rgbArray: function() {
            return this.values.rgb;
        },
        hslArray: function() {
            return this.values.hsl;
        },
        hsvArray: function() {
            return this.values.hsv;
        },
        hwbArray: function() {
            if (this.values.alpha !== 1) {
                return this.values.hwb.concat([this.values.alpha])
            }
            return this.values.hwb;
        },
        cmykArray: function() {
            return this.values.cmyk;
        },
        rgbaArray: function() {
            var rgb = this.values.rgb;
            return rgb.concat([this.values.alpha]);
        },
        hslaArray: function() {
            var hsl = this.values.hsl;
            return hsl.concat([this.values.alpha]);
        },
        alpha: function(val) {
            if (val === undefined) {
                return this.values.alpha;
            }
            this.setValues("alpha", val);
            return this;
        },

        red: function(val) {
            return this.setChannel("rgb", 0, val);
        },
        green: function(val) {
            return this.setChannel("rgb", 1, val);
        },
        blue: function(val) {
            return this.setChannel("rgb", 2, val);
        },
        hue: function(val) {
            return this.setChannel("hsl", 0, val);
        },
        saturation: function(val) {
            return this.setChannel("hsl", 1, val);
        },
        lightness: function(val) {
            return this.setChannel("hsl", 2, val);
        },
        saturationv: function(val) {
            return this.setChannel("hsv", 1, val);
        },
        whiteness: function(val) {
            return this.setChannel("hwb", 1, val);
        },
        blackness: function(val) {
            return this.setChannel("hwb", 2, val);
        },
        value: function(val) {
            return this.setChannel("hsv", 2, val);
        },
        cyan: function(val) {
            return this.setChannel("cmyk", 0, val);
        },
        magenta: function(val) {
            return this.setChannel("cmyk", 1, val);
        },
        yellow: function(val) {
            return this.setChannel("cmyk", 2, val);
        },
        black: function(val) {
            return this.setChannel("cmyk", 3, val);
        },

        hexString: function() {
            return string.hexString(this.values.rgb);
        },
        rgbString: function() {
            return string.rgbString(this.values.rgb, this.values.alpha);
        },
        rgbaString: function() {
            return string.rgbaString(this.values.rgb, this.values.alpha);
        },
        percentString: function() {
            return string.percentString(this.values.rgb, this.values.alpha);
        },
        hslString: function() {
            return string.hslString(this.values.hsl, this.values.alpha);
        },
        hslaString: function() {
            return string.hslaString(this.values.hsl, this.values.alpha);
        },
        hwbString: function() {
            return string.hwbString(this.values.hwb, this.values.alpha);
        },
        keyword: function() {
            return string.keyword(this.values.rgb, this.values.alpha);
        },

        rgbNumber: function() {
            return (this.values.rgb[0] << 16) | (this.values.rgb[1] << 8) | this.values.rgb[2];
        },

        luminosity: function() {
            // http://www.w3.org/TR/WCAG20/#relativeluminancedef
            var rgb = this.values.rgb;
            var lum = [];
            for (var i = 0; i < rgb.length; i++) {
                var chan = rgb[i] / 255;
                lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4)
            }
            return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
        },

        contrast: function(color2) {
            // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
            var lum1 = this.luminosity();
            var lum2 = color2.luminosity();
            if (lum1 > lum2) {
                return (lum1 + 0.05) / (lum2 + 0.05)
            };
            return (lum2 + 0.05) / (lum1 + 0.05);
        },

        level: function(color2) {
            var contrastRatio = this.contrast(color2);
            return (contrastRatio >= 7.1) ? 'AAA' : (contrastRatio >= 4.5) ? 'AA' : '';
        },

        dark: function() {
            // YIQ equation from http://24ways.org/2010/calculating-color-contrast
            var rgb = this.values.rgb,
                yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
            return yiq < 128;
        },

        light: function() {
            return !this.dark();
        },

        negate: function() {
            var rgb = []
            for (var i = 0; i < 3; i++) {
                rgb[i] = 255 - this.values.rgb[i];
            }
            this.setValues("rgb", rgb);
            return this;
        },

        lighten: function(ratio) {
            this.values.hsl[2] += this.values.hsl[2] * ratio;
            this.setValues("hsl", this.values.hsl);
            return this;
        },

        darken: function(ratio) {
            this.values.hsl[2] -= this.values.hsl[2] * ratio;
            this.setValues("hsl", this.values.hsl);
            return this;
        },

        saturate: function(ratio) {
            this.values.hsl[1] += this.values.hsl[1] * ratio;
            this.setValues("hsl", this.values.hsl);
            return this;
        },

        desaturate: function(ratio) {
            this.values.hsl[1] -= this.values.hsl[1] * ratio;
            this.setValues("hsl", this.values.hsl);
            return this;
        },

        whiten: function(ratio) {
            this.values.hwb[1] += this.values.hwb[1] * ratio;
            this.setValues("hwb", this.values.hwb);
            return this;
        },

        blacken: function(ratio) {
            this.values.hwb[2] += this.values.hwb[2] * ratio;
            this.setValues("hwb", this.values.hwb);
            return this;
        },

        greyscale: function() {
            var rgb = this.values.rgb;
            // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
            var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
            this.setValues("rgb", [val, val, val]);
            return this;
        },

        clearer: function(ratio) {
            this.setValues("alpha", this.values.alpha - (this.values.alpha * ratio));
            return this;
        },

        opaquer: function(ratio) {
            this.setValues("alpha", this.values.alpha + (this.values.alpha * ratio));
            return this;
        },

        rotate: function(degrees) {
            var hue = this.values.hsl[0];
            hue = (hue + degrees) % 360;
            hue = hue < 0 ? 360 + hue : hue;
            this.values.hsl[0] = hue;
            this.setValues("hsl", this.values.hsl);
            return this;
        },

        mix: function(color2, weight) {
            weight = 1 - (weight == null ? 0.5 : weight);

            // algorithm from Sass's mix(). Ratio of first color in mix is
            // determined by the alphas of both colors and the weight
            var t1 = weight * 2 - 1,
                d = this.alpha() - color2.alpha();

            var weight1 = (((t1 * d == -1) ? t1 : (t1 + d) / (1 + t1 * d)) + 1) / 2;
            var weight2 = 1 - weight1;

            var rgb = this.rgbArray();
            var rgb2 = color2.rgbArray();

            for (var i = 0; i < rgb.length; i++) {
                rgb[i] = rgb[i] * weight1 + rgb2[i] * weight2;
            }
            this.setValues("rgb", rgb);

            var alpha = this.alpha() * weight + color2.alpha() * (1 - weight);
            this.setValues("alpha", alpha);

            return this;
        },

        toJSON: function() {
            return this.rgb();
        },

        clone: function() {
            return new Color(this.rgb());
        }
    }


    Color.prototype.getValues = function(space) {
        var vals = {};
        for (var i = 0; i < space.length; i++) {
            vals[space.charAt(i)] = this.values[space][i];
        }
        if (this.values.alpha != 1) {
            vals["a"] = this.values.alpha;
        }
        // {r: 255, g: 255, b: 255, a: 0.4}
        return vals;
    }

    Color.prototype.setValues = function(space, vals) {
        var spaces = {
            "rgb": ["red", "green", "blue"],
            "hsl": ["hue", "saturation", "lightness"],
            "hsv": ["hue", "saturation", "value"],
            "hwb": ["hue", "whiteness", "blackness"],
            "cmyk": ["cyan", "magenta", "yellow", "black"]
        };

        var maxes = {
            "rgb": [255, 255, 255],
            "hsl": [360, 100, 100],
            "hsv": [360, 100, 100],
            "hwb": [360, 100, 100],
            "cmyk": [100, 100, 100, 100]
        };

        var alpha = 1;
        if (space == "alpha") {
            alpha = vals;
        } else if (vals.length) {
            // [10, 10, 10]
            this.values[space] = vals.slice(0, space.length);
            alpha = vals[space.length];
        } else if (vals[space.charAt(0)] !== undefined) {
            // {r: 10, g: 10, b: 10}
            for (var i = 0; i < space.length; i++) {
                this.values[space][i] = vals[space.charAt(i)];
            }
            alpha = vals.a;
        } else if (vals[spaces[space][0]] !== undefined) {
            // {red: 10, green: 10, blue: 10}
            var chans = spaces[space];
            for (var i = 0; i < space.length; i++) {
                this.values[space][i] = vals[chans[i]];
            }
            alpha = vals.alpha;
        }
        this.values.alpha = Math.max(0, Math.min(1, (alpha !== undefined ? alpha : this.values.alpha)));
        if (space == "alpha") {
            return;
        }

        // cap values of the space prior converting all values
        for (var i = 0; i < space.length; i++) {
            var capped = Math.max(0, Math.min(maxes[space][i], this.values[space][i]));
            this.values[space][i] = Math.round(capped);
        }

        // convert to all the other color spaces
        for (var sname in spaces) {
            if (sname != space) {
                this.values[sname] = convert[space][sname](this.values[space])
            }

            // cap values
            for (var i = 0; i < sname.length; i++) {
                var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i]));
                this.values[sname][i] = Math.round(capped);
            }
        }
        return true;
    }

    Color.prototype.setSpace = function(space, args) {
        var vals = args[0];
        if (vals === undefined) {
            // color.rgb()
            return this.getValues(space);
        }
        // color.rgb(10, 10, 10)
        if (typeof vals == "number") {
            vals = Array.prototype.slice.call(args);
        }
        this.setValues(space, vals);
        return this;
    }

    Color.prototype.setChannel = function(space, index, val) {
        if (val === undefined) {
            // color.red()
            return this.values[space][index];
        }
        // color.red(100)
        this.values[space][index] = val;
        this.setValues(space, this.values[space]);
        return this;
    }

     window.Color = module.exports = Color;

})();

},{"color-convert":3,"color-string":4}],2:[function(require,module,exports){
/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;
  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

},{}],3:[function(require,module,exports){
var conversions = require("./conversions");

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;
},{"./conversions":2}],4:[function(require,module,exports){
/* MIT license */
var colorNames = require('color-name');

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/,
       hex =  /^#([a-fA-F0-9]{6})$/,
       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       keyword = /(\w+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = colorNames[match[1]];
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb[3] = a;
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, s, l, a];
   }
}

function getHwb(string) {
   if (!string) {
      return;
   }
   var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hwb);
   if (match) {
    var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          w = scale(parseFloat(match[2]), 0, 100),
          b = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, w, b, a];
   }
}

function getRgb(string) {
   var rgba = getRgba(string);
   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);
  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
   else if (vals = getHwb(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
   if (alpha === undefined) {
      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
   }
   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
}

function keyword(rgb) {
  return reverseNames[rgb.slice(0, 3)];
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}


//create a list of reverse color names
var reverseNames = {};
for (var name in colorNames) {
   reverseNames[colorNames[name]] = name;
}

},{"color-name":5}],5:[function(require,module,exports){
module.exports={
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29sb3IuanMiLCJub2RlX21vZHVsZXMvY29sb3ItY29udmVydC9jb252ZXJzaW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9jb2xvci1jb252ZXJ0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvbG9yLXN0cmluZy9jb2xvci1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29sb3Itc3RyaW5nL25vZGVfbW9kdWxlcy9jb2xvci1uYW1lL2luZGV4Lmpzb24iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIE1JVCBsaWNlbnNlICovXHJcbihmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgY29udmVydCA9IHJlcXVpcmUoXCJjb2xvci1jb252ZXJ0XCIpLFxyXG4gICAgICAgIHN0cmluZyA9IHJlcXVpcmUoXCJjb2xvci1zdHJpbmdcIik7XHJcblxyXG4gICAgdmFyIENvbG9yID0gZnVuY3Rpb24ob2JqKSB7XHJcbiAgICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIENvbG9yKSByZXR1cm4gb2JqO1xyXG4gICAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBDb2xvcikpIHJldHVybiBuZXcgQ29sb3Iob2JqKTtcclxuXHJcbiAgICAgICAgdGhpcy52YWx1ZXMgPSB7XHJcbiAgICAgICAgICAgIHJnYjogWzAsIDAsIDBdLFxyXG4gICAgICAgICAgICBoc2w6IFswLCAwLCAwXSxcclxuICAgICAgICAgICAgaHN2OiBbMCwgMCwgMF0sXHJcbiAgICAgICAgICAgIGh3YjogWzAsIDAsIDBdLFxyXG4gICAgICAgICAgICBjbXlrOiBbMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgICAgIGFscGhhOiAxXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBwYXJzZSBDb2xvcigpIGFyZ3VtZW50XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvYmogPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICB2YXIgdmFscyA9IHN0cmluZy5nZXRSZ2JhKG9iaik7XHJcbiAgICAgICAgICAgIGlmICh2YWxzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlcyhcInJnYlwiLCB2YWxzKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWxzID0gc3RyaW5nLmdldEhzbGEob2JqKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZXMoXCJoc2xcIiwgdmFscyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFscyA9IHN0cmluZy5nZXRId2Iob2JqKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZXMoXCJod2JcIiwgdmFscyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgY29sb3IgZnJvbSBzdHJpbmcgXFxcIlwiICsgb2JqICsgXCJcXFwiXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb2JqID09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHMgPSBvYmo7XHJcbiAgICAgICAgICAgIGlmICh2YWxzW1wiclwiXSAhPT0gdW5kZWZpbmVkIHx8IHZhbHNbXCJyZWRcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZXMoXCJyZ2JcIiwgdmFscylcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWxzW1wibFwiXSAhPT0gdW5kZWZpbmVkIHx8IHZhbHNbXCJsaWdodG5lc3NcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZXMoXCJoc2xcIiwgdmFscylcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWxzW1widlwiXSAhPT0gdW5kZWZpbmVkIHx8IHZhbHNbXCJ2YWx1ZVwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlcyhcImhzdlwiLCB2YWxzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHNbXCJ3XCJdICE9PSB1bmRlZmluZWQgfHwgdmFsc1tcIndoaXRlbmVzc1wiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFZhbHVlcyhcImh3YlwiLCB2YWxzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHNbXCJjXCJdICE9PSB1bmRlZmluZWQgfHwgdmFsc1tcImN5YW5cIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZXMoXCJjbXlrXCIsIHZhbHMpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gcGFyc2UgY29sb3IgZnJvbSBvYmplY3QgXCIgKyBKU09OLnN0cmluZ2lmeShvYmopKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBDb2xvci5wcm90b3R5cGUgPSB7XHJcbiAgICAgICAgcmdiOiBmdW5jdGlvbih2YWxzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNwYWNlKFwicmdiXCIsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBoc2w6IGZ1bmN0aW9uKHZhbHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3BhY2UoXCJoc2xcIiwgYXJndW1lbnRzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhzdjogZnVuY3Rpb24odmFscykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTcGFjZShcImhzdlwiLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaHdiOiBmdW5jdGlvbih2YWxzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNwYWNlKFwiaHdiXCIsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbXlrOiBmdW5jdGlvbih2YWxzKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldFNwYWNlKFwiY215a1wiLCBhcmd1bWVudHMpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHJnYkFycmF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLnJnYjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhzbEFycmF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLmhzbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhzdkFycmF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLmhzdjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGh3YkFycmF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWVzLmFscGhhICE9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMuaHdiLmNvbmNhdChbdGhpcy52YWx1ZXMuYWxwaGFdKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlcy5od2I7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjbXlrQXJyYXk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXMuY215aztcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJnYmFBcnJheTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnZhbHVlcy5yZ2I7XHJcbiAgICAgICAgICAgIHJldHVybiByZ2IuY29uY2F0KFt0aGlzLnZhbHVlcy5hbHBoYV0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaHNsYUFycmF5OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIGhzbCA9IHRoaXMudmFsdWVzLmhzbDtcclxuICAgICAgICAgICAgcmV0dXJuIGhzbC5jb25jYXQoW3RoaXMudmFsdWVzLmFscGhhXSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBhbHBoYTogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzLmFscGhhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKFwiYWxwaGFcIiwgdmFsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgcmVkOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcInJnYlwiLCAwLCB2YWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ3JlZW46IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRDaGFubmVsKFwicmdiXCIsIDEsIHZhbCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBibHVlOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcInJnYlwiLCAyLCB2YWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaHVlOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcImhzbFwiLCAwLCB2YWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2F0dXJhdGlvbjogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldENoYW5uZWwoXCJoc2xcIiwgMSwgdmFsKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxpZ2h0bmVzczogZnVuY3Rpb24odmFsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldENoYW5uZWwoXCJoc2xcIiwgMiwgdmFsKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNhdHVyYXRpb252OiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcImhzdlwiLCAxLCB2YWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgd2hpdGVuZXNzOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcImh3YlwiLCAxLCB2YWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYmxhY2tuZXNzOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcImh3YlwiLCAyLCB2YWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRDaGFubmVsKFwiaHN2XCIsIDIsIHZhbCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjeWFuOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcImNteWtcIiwgMCwgdmFsKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1hZ2VudGE6IGZ1bmN0aW9uKHZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRDaGFubmVsKFwiY215a1wiLCAxLCB2YWwpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeWVsbG93OiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcImNteWtcIiwgMiwgdmFsKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJsYWNrOiBmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0Q2hhbm5lbChcImNteWtcIiwgMywgdmFsKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBoZXhTdHJpbmc6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyaW5nLmhleFN0cmluZyh0aGlzLnZhbHVlcy5yZ2IpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmdiU3RyaW5nOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZ2JTdHJpbmcodGhpcy52YWx1ZXMucmdiLCB0aGlzLnZhbHVlcy5hbHBoYSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICByZ2JhU3RyaW5nOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZy5yZ2JhU3RyaW5nKHRoaXMudmFsdWVzLnJnYiwgdGhpcy52YWx1ZXMuYWxwaGEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGVyY2VudFN0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcucGVyY2VudFN0cmluZyh0aGlzLnZhbHVlcy5yZ2IsIHRoaXMudmFsdWVzLmFscGhhKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhzbFN0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcuaHNsU3RyaW5nKHRoaXMudmFsdWVzLmhzbCwgdGhpcy52YWx1ZXMuYWxwaGEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaHNsYVN0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcuaHNsYVN0cmluZyh0aGlzLnZhbHVlcy5oc2wsIHRoaXMudmFsdWVzLmFscGhhKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGh3YlN0cmluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcuaHdiU3RyaW5nKHRoaXMudmFsdWVzLmh3YiwgdGhpcy52YWx1ZXMuYWxwaGEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAga2V5d29yZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdHJpbmcua2V5d29yZCh0aGlzLnZhbHVlcy5yZ2IsIHRoaXMudmFsdWVzLmFscGhhKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByZ2JOdW1iZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMudmFsdWVzLnJnYlswXSA8PCAxNikgfCAodGhpcy52YWx1ZXMucmdiWzFdIDw8IDgpIHwgdGhpcy52YWx1ZXMucmdiWzJdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGx1bWlub3NpdHk6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9XQ0FHMjAvI3JlbGF0aXZlbHVtaW5hbmNlZGVmXHJcbiAgICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnZhbHVlcy5yZ2I7XHJcbiAgICAgICAgICAgIHZhciBsdW0gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZ2IubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGFuID0gcmdiW2ldIC8gMjU1O1xyXG4gICAgICAgICAgICAgICAgbHVtW2ldID0gKGNoYW4gPD0gMC4wMzkyOCkgPyBjaGFuIC8gMTIuOTIgOiBNYXRoLnBvdygoKGNoYW4gKyAwLjA1NSkgLyAxLjA1NSksIDIuNClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gMC4yMTI2ICogbHVtWzBdICsgMC43MTUyICogbHVtWzFdICsgMC4wNzIyICogbHVtWzJdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGNvbnRyYXN0OiBmdW5jdGlvbihjb2xvcjIpIHtcclxuICAgICAgICAgICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvV0NBRzIwLyNjb250cmFzdC1yYXRpb2RlZlxyXG4gICAgICAgICAgICB2YXIgbHVtMSA9IHRoaXMubHVtaW5vc2l0eSgpO1xyXG4gICAgICAgICAgICB2YXIgbHVtMiA9IGNvbG9yMi5sdW1pbm9zaXR5KCk7XHJcbiAgICAgICAgICAgIGlmIChsdW0xID4gbHVtMikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChsdW0xICsgMC4wNSkgLyAobHVtMiArIDAuMDUpXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiAobHVtMiArIDAuMDUpIC8gKGx1bTEgKyAwLjA1KTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBsZXZlbDogZnVuY3Rpb24oY29sb3IyKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250cmFzdFJhdGlvID0gdGhpcy5jb250cmFzdChjb2xvcjIpO1xyXG4gICAgICAgICAgICByZXR1cm4gKGNvbnRyYXN0UmF0aW8gPj0gNy4xKSA/ICdBQUEnIDogKGNvbnRyYXN0UmF0aW8gPj0gNC41KSA/ICdBQScgOiAnJztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkYXJrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLy8gWUlRIGVxdWF0aW9uIGZyb20gaHR0cDovLzI0d2F5cy5vcmcvMjAxMC9jYWxjdWxhdGluZy1jb2xvci1jb250cmFzdFxyXG4gICAgICAgICAgICB2YXIgcmdiID0gdGhpcy52YWx1ZXMucmdiLFxyXG4gICAgICAgICAgICAgICAgeWlxID0gKHJnYlswXSAqIDI5OSArIHJnYlsxXSAqIDU4NyArIHJnYlsyXSAqIDExNCkgLyAxMDAwO1xyXG4gICAgICAgICAgICByZXR1cm4geWlxIDwgMTI4O1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGxpZ2h0OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICF0aGlzLmRhcmsoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBuZWdhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgcmdiID0gW11cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJnYltpXSA9IDI1NSAtIHRoaXMudmFsdWVzLnJnYltpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlcyhcInJnYlwiLCByZ2IpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBsaWdodGVuOiBmdW5jdGlvbihyYXRpbykge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5oc2xbMl0gKz0gdGhpcy52YWx1ZXMuaHNsWzJdICogcmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKFwiaHNsXCIsIHRoaXMudmFsdWVzLmhzbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGRhcmtlbjogZnVuY3Rpb24ocmF0aW8pIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXMuaHNsWzJdIC09IHRoaXMudmFsdWVzLmhzbFsyXSAqIHJhdGlvO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlcyhcImhzbFwiLCB0aGlzLnZhbHVlcy5oc2wpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzYXR1cmF0ZTogZnVuY3Rpb24ocmF0aW8pIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXMuaHNsWzFdICs9IHRoaXMudmFsdWVzLmhzbFsxXSAqIHJhdGlvO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlcyhcImhzbFwiLCB0aGlzLnZhbHVlcy5oc2wpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBkZXNhdHVyYXRlOiBmdW5jdGlvbihyYXRpbykge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5oc2xbMV0gLT0gdGhpcy52YWx1ZXMuaHNsWzFdICogcmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKFwiaHNsXCIsIHRoaXMudmFsdWVzLmhzbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHdoaXRlbjogZnVuY3Rpb24ocmF0aW8pIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXMuaHdiWzFdICs9IHRoaXMudmFsdWVzLmh3YlsxXSAqIHJhdGlvO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlcyhcImh3YlwiLCB0aGlzLnZhbHVlcy5od2IpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBibGFja2VuOiBmdW5jdGlvbihyYXRpbykge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5od2JbMl0gKz0gdGhpcy52YWx1ZXMuaHdiWzJdICogcmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKFwiaHdiXCIsIHRoaXMudmFsdWVzLmh3Yik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdyZXlzY2FsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnZhbHVlcy5yZ2I7XHJcbiAgICAgICAgICAgIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvR3JheXNjYWxlI0NvbnZlcnRpbmdfY29sb3JfdG9fZ3JheXNjYWxlXHJcbiAgICAgICAgICAgIHZhciB2YWwgPSByZ2JbMF0gKiAwLjMgKyByZ2JbMV0gKiAwLjU5ICsgcmdiWzJdICogMC4xMTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZXMoXCJyZ2JcIiwgW3ZhbCwgdmFsLCB2YWxdKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2xlYXJlcjogZnVuY3Rpb24ocmF0aW8pIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZXMoXCJhbHBoYVwiLCB0aGlzLnZhbHVlcy5hbHBoYSAtICh0aGlzLnZhbHVlcy5hbHBoYSAqIHJhdGlvKSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9wYXF1ZXI6IGZ1bmN0aW9uKHJhdGlvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKFwiYWxwaGFcIiwgdGhpcy52YWx1ZXMuYWxwaGEgKyAodGhpcy52YWx1ZXMuYWxwaGEgKiByYXRpbykpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICByb3RhdGU6IGZ1bmN0aW9uKGRlZ3JlZXMpIHtcclxuICAgICAgICAgICAgdmFyIGh1ZSA9IHRoaXMudmFsdWVzLmhzbFswXTtcclxuICAgICAgICAgICAgaHVlID0gKGh1ZSArIGRlZ3JlZXMpICUgMzYwO1xyXG4gICAgICAgICAgICBodWUgPSBodWUgPCAwID8gMzYwICsgaHVlIDogaHVlO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlcy5oc2xbMF0gPSBodWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKFwiaHNsXCIsIHRoaXMudmFsdWVzLmhzbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG1peDogZnVuY3Rpb24oY29sb3IyLCB3ZWlnaHQpIHtcclxuICAgICAgICAgICAgd2VpZ2h0ID0gMSAtICh3ZWlnaHQgPT0gbnVsbCA/IDAuNSA6IHdlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAvLyBhbGdvcml0aG0gZnJvbSBTYXNzJ3MgbWl4KCkuIFJhdGlvIG9mIGZpcnN0IGNvbG9yIGluIG1peCBpc1xyXG4gICAgICAgICAgICAvLyBkZXRlcm1pbmVkIGJ5IHRoZSBhbHBoYXMgb2YgYm90aCBjb2xvcnMgYW5kIHRoZSB3ZWlnaHRcclxuICAgICAgICAgICAgdmFyIHQxID0gd2VpZ2h0ICogMiAtIDEsXHJcbiAgICAgICAgICAgICAgICBkID0gdGhpcy5hbHBoYSgpIC0gY29sb3IyLmFscGhhKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgd2VpZ2h0MSA9ICgoKHQxICogZCA9PSAtMSkgPyB0MSA6ICh0MSArIGQpIC8gKDEgKyB0MSAqIGQpKSArIDEpIC8gMjtcclxuICAgICAgICAgICAgdmFyIHdlaWdodDIgPSAxIC0gd2VpZ2h0MTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZ2IgPSB0aGlzLnJnYkFycmF5KCk7XHJcbiAgICAgICAgICAgIHZhciByZ2IyID0gY29sb3IyLnJnYkFycmF5KCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJnYi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmdiW2ldID0gcmdiW2ldICogd2VpZ2h0MSArIHJnYjJbaV0gKiB3ZWlnaHQyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWVzKFwicmdiXCIsIHJnYik7XHJcblxyXG4gICAgICAgICAgICB2YXIgYWxwaGEgPSB0aGlzLmFscGhhKCkgKiB3ZWlnaHQgKyBjb2xvcjIuYWxwaGEoKSAqICgxIC0gd2VpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZXMoXCJhbHBoYVwiLCBhbHBoYSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0b0pTT046IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZ2IoKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjbG9uZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IodGhpcy5yZ2IoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBDb2xvci5wcm90b3R5cGUuZ2V0VmFsdWVzID0gZnVuY3Rpb24oc3BhY2UpIHtcclxuICAgICAgICB2YXIgdmFscyA9IHt9O1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFsc1tzcGFjZS5jaGFyQXQoaSldID0gdGhpcy52YWx1ZXNbc3BhY2VdW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy52YWx1ZXMuYWxwaGEgIT0gMSkge1xyXG4gICAgICAgICAgICB2YWxzW1wiYVwiXSA9IHRoaXMudmFsdWVzLmFscGhhO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB7cjogMjU1LCBnOiAyNTUsIGI6IDI1NSwgYTogMC40fVxyXG4gICAgICAgIHJldHVybiB2YWxzO1xyXG4gICAgfVxyXG5cclxuICAgIENvbG9yLnByb3RvdHlwZS5zZXRWYWx1ZXMgPSBmdW5jdGlvbihzcGFjZSwgdmFscykge1xyXG4gICAgICAgIHZhciBzcGFjZXMgPSB7XHJcbiAgICAgICAgICAgIFwicmdiXCI6IFtcInJlZFwiLCBcImdyZWVuXCIsIFwiYmx1ZVwiXSxcclxuICAgICAgICAgICAgXCJoc2xcIjogW1wiaHVlXCIsIFwic2F0dXJhdGlvblwiLCBcImxpZ2h0bmVzc1wiXSxcclxuICAgICAgICAgICAgXCJoc3ZcIjogW1wiaHVlXCIsIFwic2F0dXJhdGlvblwiLCBcInZhbHVlXCJdLFxyXG4gICAgICAgICAgICBcImh3YlwiOiBbXCJodWVcIiwgXCJ3aGl0ZW5lc3NcIiwgXCJibGFja25lc3NcIl0sXHJcbiAgICAgICAgICAgIFwiY215a1wiOiBbXCJjeWFuXCIsIFwibWFnZW50YVwiLCBcInllbGxvd1wiLCBcImJsYWNrXCJdXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIG1heGVzID0ge1xyXG4gICAgICAgICAgICBcInJnYlwiOiBbMjU1LCAyNTUsIDI1NV0sXHJcbiAgICAgICAgICAgIFwiaHNsXCI6IFszNjAsIDEwMCwgMTAwXSxcclxuICAgICAgICAgICAgXCJoc3ZcIjogWzM2MCwgMTAwLCAxMDBdLFxyXG4gICAgICAgICAgICBcImh3YlwiOiBbMzYwLCAxMDAsIDEwMF0sXHJcbiAgICAgICAgICAgIFwiY215a1wiOiBbMTAwLCAxMDAsIDEwMCwgMTAwXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciBhbHBoYSA9IDE7XHJcbiAgICAgICAgaWYgKHNwYWNlID09IFwiYWxwaGFcIikge1xyXG4gICAgICAgICAgICBhbHBoYSA9IHZhbHM7XHJcbiAgICAgICAgfSBlbHNlIGlmICh2YWxzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAvLyBbMTAsIDEwLCAxMF1cclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNbc3BhY2VdID0gdmFscy5zbGljZSgwLCBzcGFjZS5sZW5ndGgpO1xyXG4gICAgICAgICAgICBhbHBoYSA9IHZhbHNbc3BhY2UubGVuZ3RoXTtcclxuICAgICAgICB9IGVsc2UgaWYgKHZhbHNbc3BhY2UuY2hhckF0KDApXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIHtyOiAxMCwgZzogMTAsIGI6IDEwfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwYWNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc1tzcGFjZV1baV0gPSB2YWxzW3NwYWNlLmNoYXJBdChpKV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYWxwaGEgPSB2YWxzLmE7XHJcbiAgICAgICAgfSBlbHNlIGlmICh2YWxzW3NwYWNlc1tzcGFjZV1bMF1dICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8ge3JlZDogMTAsIGdyZWVuOiAxMCwgYmx1ZTogMTB9XHJcbiAgICAgICAgICAgIHZhciBjaGFucyA9IHNwYWNlc1tzcGFjZV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BhY2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzW3NwYWNlXVtpXSA9IHZhbHNbY2hhbnNbaV1dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFscGhhID0gdmFscy5hbHBoYTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy52YWx1ZXMuYWxwaGEgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCAoYWxwaGEgIT09IHVuZGVmaW5lZCA/IGFscGhhIDogdGhpcy52YWx1ZXMuYWxwaGEpKSk7XHJcbiAgICAgICAgaWYgKHNwYWNlID09IFwiYWxwaGFcIikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjYXAgdmFsdWVzIG9mIHRoZSBzcGFjZSBwcmlvciBjb252ZXJ0aW5nIGFsbCB2YWx1ZXNcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwYWNlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjYXBwZWQgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXhlc1tzcGFjZV1baV0sIHRoaXMudmFsdWVzW3NwYWNlXVtpXSkpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlc1tzcGFjZV1baV0gPSBNYXRoLnJvdW5kKGNhcHBlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb252ZXJ0IHRvIGFsbCB0aGUgb3RoZXIgY29sb3Igc3BhY2VzXHJcbiAgICAgICAgZm9yICh2YXIgc25hbWUgaW4gc3BhY2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChzbmFtZSAhPSBzcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNbc25hbWVdID0gY29udmVydFtzcGFjZV1bc25hbWVdKHRoaXMudmFsdWVzW3NwYWNlXSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY2FwIHZhbHVlc1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNuYW1lLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FwcGVkID0gTWF0aC5tYXgoMCwgTWF0aC5taW4obWF4ZXNbc25hbWVdW2ldLCB0aGlzLnZhbHVlc1tzbmFtZV1baV0pKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzW3NuYW1lXVtpXSA9IE1hdGgucm91bmQoY2FwcGVkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBDb2xvci5wcm90b3R5cGUuc2V0U3BhY2UgPSBmdW5jdGlvbihzcGFjZSwgYXJncykge1xyXG4gICAgICAgIHZhciB2YWxzID0gYXJnc1swXTtcclxuICAgICAgICBpZiAodmFscyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbG9yLnJnYigpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFZhbHVlcyhzcGFjZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbG9yLnJnYigxMCwgMTAsIDEwKVxyXG4gICAgICAgIGlmICh0eXBlb2YgdmFscyA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgIHZhbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmdzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZXMoc3BhY2UsIHZhbHMpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIENvbG9yLnByb3RvdHlwZS5zZXRDaGFubmVsID0gZnVuY3Rpb24oc3BhY2UsIGluZGV4LCB2YWwpIHtcclxuICAgICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy8gY29sb3IucmVkKClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzW3NwYWNlXVtpbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbG9yLnJlZCgxMDApXHJcbiAgICAgICAgdGhpcy52YWx1ZXNbc3BhY2VdW2luZGV4XSA9IHZhbDtcclxuICAgICAgICB0aGlzLnNldFZhbHVlcyhzcGFjZSwgdGhpcy52YWx1ZXNbc3BhY2VdKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAgd2luZG93LkNvbG9yID0gbW9kdWxlLmV4cG9ydHMgPSBDb2xvcjtcclxuXHJcbn0pKCk7XHJcbiIsIi8qIE1JVCBsaWNlbnNlICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICByZ2IyaHNsOiByZ2IyaHNsLFxyXG4gIHJnYjJoc3Y6IHJnYjJoc3YsXHJcbiAgcmdiMmh3YjogcmdiMmh3YixcclxuICByZ2IyY215azogcmdiMmNteWssXHJcbiAgcmdiMmtleXdvcmQ6IHJnYjJrZXl3b3JkLFxyXG4gIHJnYjJ4eXo6IHJnYjJ4eXosXHJcbiAgcmdiMmxhYjogcmdiMmxhYixcclxuICByZ2IybGNoOiByZ2IybGNoLFxyXG5cclxuICBoc2wycmdiOiBoc2wycmdiLFxyXG4gIGhzbDJoc3Y6IGhzbDJoc3YsXHJcbiAgaHNsMmh3YjogaHNsMmh3YixcclxuICBoc2wyY215azogaHNsMmNteWssXHJcbiAgaHNsMmtleXdvcmQ6IGhzbDJrZXl3b3JkLFxyXG5cclxuICBoc3YycmdiOiBoc3YycmdiLFxyXG4gIGhzdjJoc2w6IGhzdjJoc2wsXHJcbiAgaHN2Mmh3YjogaHN2Mmh3YixcclxuICBoc3YyY215azogaHN2MmNteWssXHJcbiAgaHN2MmtleXdvcmQ6IGhzdjJrZXl3b3JkLFxyXG5cclxuICBod2IycmdiOiBod2IycmdiLFxyXG4gIGh3YjJoc2w6IGh3YjJoc2wsXHJcbiAgaHdiMmhzdjogaHdiMmhzdixcclxuICBod2IyY215azogaHdiMmNteWssXHJcbiAgaHdiMmtleXdvcmQ6IGh3YjJrZXl3b3JkLFxyXG5cclxuICBjbXlrMnJnYjogY215azJyZ2IsXHJcbiAgY215azJoc2w6IGNteWsyaHNsLFxyXG4gIGNteWsyaHN2OiBjbXlrMmhzdixcclxuICBjbXlrMmh3YjogY215azJod2IsXHJcbiAgY215azJrZXl3b3JkOiBjbXlrMmtleXdvcmQsXHJcblxyXG4gIGtleXdvcmQycmdiOiBrZXl3b3JkMnJnYixcclxuICBrZXl3b3JkMmhzbDoga2V5d29yZDJoc2wsXHJcbiAga2V5d29yZDJoc3Y6IGtleXdvcmQyaHN2LFxyXG4gIGtleXdvcmQyaHdiOiBrZXl3b3JkMmh3YixcclxuICBrZXl3b3JkMmNteWs6IGtleXdvcmQyY215ayxcclxuICBrZXl3b3JkMmxhYjoga2V5d29yZDJsYWIsXHJcbiAga2V5d29yZDJ4eXo6IGtleXdvcmQyeHl6LFxyXG5cclxuICB4eXoycmdiOiB4eXoycmdiLFxyXG4gIHh5ejJsYWI6IHh5ejJsYWIsXHJcbiAgeHl6MmxjaDogeHl6MmxjaCxcclxuXHJcbiAgbGFiMnh5ejogbGFiMnh5eixcclxuICBsYWIycmdiOiBsYWIycmdiLFxyXG4gIGxhYjJsY2g6IGxhYjJsY2gsXHJcblxyXG4gIGxjaDJsYWI6IGxjaDJsYWIsXHJcbiAgbGNoMnh5ejogbGNoMnh5eixcclxuICBsY2gycmdiOiBsY2gycmdiXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiByZ2IyaHNsKHJnYikge1xyXG4gIHZhciByID0gcmdiWzBdLzI1NSxcclxuICAgICAgZyA9IHJnYlsxXS8yNTUsXHJcbiAgICAgIGIgPSByZ2JbMl0vMjU1LFxyXG4gICAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcclxuICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXHJcbiAgICAgIGRlbHRhID0gbWF4IC0gbWluLFxyXG4gICAgICBoLCBzLCBsO1xyXG5cclxuICBpZiAobWF4ID09IG1pbilcclxuICAgIGggPSAwO1xyXG4gIGVsc2UgaWYgKHIgPT0gbWF4KVxyXG4gICAgaCA9IChnIC0gYikgLyBkZWx0YTtcclxuICBlbHNlIGlmIChnID09IG1heClcclxuICAgIGggPSAyICsgKGIgLSByKSAvIGRlbHRhO1xyXG4gIGVsc2UgaWYgKGIgPT0gbWF4KVxyXG4gICAgaCA9IDQgKyAociAtIGcpLyBkZWx0YTtcclxuXHJcbiAgaCA9IE1hdGgubWluKGggKiA2MCwgMzYwKTtcclxuXHJcbiAgaWYgKGggPCAwKVxyXG4gICAgaCArPSAzNjA7XHJcblxyXG4gIGwgPSAobWluICsgbWF4KSAvIDI7XHJcblxyXG4gIGlmIChtYXggPT0gbWluKVxyXG4gICAgcyA9IDA7XHJcbiAgZWxzZSBpZiAobCA8PSAwLjUpXHJcbiAgICBzID0gZGVsdGEgLyAobWF4ICsgbWluKTtcclxuICBlbHNlXHJcbiAgICBzID0gZGVsdGEgLyAoMiAtIG1heCAtIG1pbik7XHJcblxyXG4gIHJldHVybiBbaCwgcyAqIDEwMCwgbCAqIDEwMF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJnYjJoc3YocmdiKSB7XHJcbiAgdmFyIHIgPSByZ2JbMF0sXHJcbiAgICAgIGcgPSByZ2JbMV0sXHJcbiAgICAgIGIgPSByZ2JbMl0sXHJcbiAgICAgIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpLFxyXG4gICAgICBtYXggPSBNYXRoLm1heChyLCBnLCBiKSxcclxuICAgICAgZGVsdGEgPSBtYXggLSBtaW4sXHJcbiAgICAgIGgsIHMsIHY7XHJcblxyXG4gIGlmIChtYXggPT0gMClcclxuICAgIHMgPSAwO1xyXG4gIGVsc2VcclxuICAgIHMgPSAoZGVsdGEvbWF4ICogMTAwMCkvMTA7XHJcblxyXG4gIGlmIChtYXggPT0gbWluKVxyXG4gICAgaCA9IDA7XHJcbiAgZWxzZSBpZiAociA9PSBtYXgpXHJcbiAgICBoID0gKGcgLSBiKSAvIGRlbHRhO1xyXG4gIGVsc2UgaWYgKGcgPT0gbWF4KVxyXG4gICAgaCA9IDIgKyAoYiAtIHIpIC8gZGVsdGE7XHJcbiAgZWxzZSBpZiAoYiA9PSBtYXgpXHJcbiAgICBoID0gNCArIChyIC0gZykgLyBkZWx0YTtcclxuXHJcbiAgaCA9IE1hdGgubWluKGggKiA2MCwgMzYwKTtcclxuXHJcbiAgaWYgKGggPCAwKVxyXG4gICAgaCArPSAzNjA7XHJcblxyXG4gIHYgPSAoKG1heCAvIDI1NSkgKiAxMDAwKSAvIDEwO1xyXG5cclxuICByZXR1cm4gW2gsIHMsIHZdO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZ2IyaHdiKHJnYikge1xyXG4gIHZhciByID0gcmdiWzBdLFxyXG4gICAgICBnID0gcmdiWzFdLFxyXG4gICAgICBiID0gcmdiWzJdLFxyXG4gICAgICBoID0gcmdiMmhzbChyZ2IpWzBdLFxyXG4gICAgICB3ID0gMS8yNTUgKiBNYXRoLm1pbihyLCBNYXRoLm1pbihnLCBiKSksXHJcbiAgICAgIGIgPSAxIC0gMS8yNTUgKiBNYXRoLm1heChyLCBNYXRoLm1heChnLCBiKSk7XHJcblxyXG4gIHJldHVybiBbaCwgdyAqIDEwMCwgYiAqIDEwMF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJnYjJjbXlrKHJnYikge1xyXG4gIHZhciByID0gcmdiWzBdIC8gMjU1LFxyXG4gICAgICBnID0gcmdiWzFdIC8gMjU1LFxyXG4gICAgICBiID0gcmdiWzJdIC8gMjU1LFxyXG4gICAgICBjLCBtLCB5LCBrO1xyXG5cclxuICBrID0gTWF0aC5taW4oMSAtIHIsIDEgLSBnLCAxIC0gYik7XHJcbiAgYyA9ICgxIC0gciAtIGspIC8gKDEgLSBrKSB8fCAwO1xyXG4gIG0gPSAoMSAtIGcgLSBrKSAvICgxIC0gaykgfHwgMDtcclxuICB5ID0gKDEgLSBiIC0gaykgLyAoMSAtIGspIHx8IDA7XHJcbiAgcmV0dXJuIFtjICogMTAwLCBtICogMTAwLCB5ICogMTAwLCBrICogMTAwXTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmdiMmtleXdvcmQocmdiKSB7XHJcbiAgcmV0dXJuIHJldmVyc2VLZXl3b3Jkc1tKU09OLnN0cmluZ2lmeShyZ2IpXTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmdiMnh5eihyZ2IpIHtcclxuICB2YXIgciA9IHJnYlswXSAvIDI1NSxcclxuICAgICAgZyA9IHJnYlsxXSAvIDI1NSxcclxuICAgICAgYiA9IHJnYlsyXSAvIDI1NTtcclxuXHJcbiAgLy8gYXNzdW1lIHNSR0JcclxuICByID0gciA+IDAuMDQwNDUgPyBNYXRoLnBvdygoKHIgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCkgOiAociAvIDEyLjkyKTtcclxuICBnID0gZyA+IDAuMDQwNDUgPyBNYXRoLnBvdygoKGcgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCkgOiAoZyAvIDEyLjkyKTtcclxuICBiID0gYiA+IDAuMDQwNDUgPyBNYXRoLnBvdygoKGIgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCkgOiAoYiAvIDEyLjkyKTtcclxuXHJcbiAgdmFyIHggPSAociAqIDAuNDEyNCkgKyAoZyAqIDAuMzU3NikgKyAoYiAqIDAuMTgwNSk7XHJcbiAgdmFyIHkgPSAociAqIDAuMjEyNikgKyAoZyAqIDAuNzE1MikgKyAoYiAqIDAuMDcyMik7XHJcbiAgdmFyIHogPSAociAqIDAuMDE5MykgKyAoZyAqIDAuMTE5MikgKyAoYiAqIDAuOTUwNSk7XHJcblxyXG4gIHJldHVybiBbeCAqIDEwMCwgeSAqMTAwLCB6ICogMTAwXTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmdiMmxhYihyZ2IpIHtcclxuICB2YXIgeHl6ID0gcmdiMnh5eihyZ2IpLFxyXG4gICAgICAgIHggPSB4eXpbMF0sXHJcbiAgICAgICAgeSA9IHh5elsxXSxcclxuICAgICAgICB6ID0geHl6WzJdLFxyXG4gICAgICAgIGwsIGEsIGI7XHJcblxyXG4gIHggLz0gOTUuMDQ3O1xyXG4gIHkgLz0gMTAwO1xyXG4gIHogLz0gMTA4Ljg4MztcclxuXHJcbiAgeCA9IHggPiAwLjAwODg1NiA/IE1hdGgucG93KHgsIDEvMykgOiAoNy43ODcgKiB4KSArICgxNiAvIDExNik7XHJcbiAgeSA9IHkgPiAwLjAwODg1NiA/IE1hdGgucG93KHksIDEvMykgOiAoNy43ODcgKiB5KSArICgxNiAvIDExNik7XHJcbiAgeiA9IHogPiAwLjAwODg1NiA/IE1hdGgucG93KHosIDEvMykgOiAoNy43ODcgKiB6KSArICgxNiAvIDExNik7XHJcblxyXG4gIGwgPSAoMTE2ICogeSkgLSAxNjtcclxuICBhID0gNTAwICogKHggLSB5KTtcclxuICBiID0gMjAwICogKHkgLSB6KTtcclxuXHJcbiAgcmV0dXJuIFtsLCBhLCBiXTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmdiMmxjaChhcmdzKSB7XHJcbiAgcmV0dXJuIGxhYjJsY2gocmdiMmxhYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhzbDJyZ2IoaHNsKSB7XHJcbiAgdmFyIGggPSBoc2xbMF0gLyAzNjAsXHJcbiAgICAgIHMgPSBoc2xbMV0gLyAxMDAsXHJcbiAgICAgIGwgPSBoc2xbMl0gLyAxMDAsXHJcbiAgICAgIHQxLCB0MiwgdDMsIHJnYiwgdmFsO1xyXG5cclxuICBpZiAocyA9PSAwKSB7XHJcbiAgICB2YWwgPSBsICogMjU1O1xyXG4gICAgcmV0dXJuIFt2YWwsIHZhbCwgdmFsXTtcclxuICB9XHJcblxyXG4gIGlmIChsIDwgMC41KVxyXG4gICAgdDIgPSBsICogKDEgKyBzKTtcclxuICBlbHNlXHJcbiAgICB0MiA9IGwgKyBzIC0gbCAqIHM7XHJcbiAgdDEgPSAyICogbCAtIHQyO1xyXG5cclxuICByZ2IgPSBbMCwgMCwgMF07XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgIHQzID0gaCArIDEgLyAzICogLSAoaSAtIDEpO1xyXG4gICAgdDMgPCAwICYmIHQzKys7XHJcbiAgICB0MyA+IDEgJiYgdDMtLTtcclxuXHJcbiAgICBpZiAoNiAqIHQzIDwgMSlcclxuICAgICAgdmFsID0gdDEgKyAodDIgLSB0MSkgKiA2ICogdDM7XHJcbiAgICBlbHNlIGlmICgyICogdDMgPCAxKVxyXG4gICAgICB2YWwgPSB0MjtcclxuICAgIGVsc2UgaWYgKDMgKiB0MyA8IDIpXHJcbiAgICAgIHZhbCA9IHQxICsgKHQyIC0gdDEpICogKDIgLyAzIC0gdDMpICogNjtcclxuICAgIGVsc2VcclxuICAgICAgdmFsID0gdDE7XHJcblxyXG4gICAgcmdiW2ldID0gdmFsICogMjU1O1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHJnYjtcclxufVxyXG5cclxuZnVuY3Rpb24gaHNsMmhzdihoc2wpIHtcclxuICB2YXIgaCA9IGhzbFswXSxcclxuICAgICAgcyA9IGhzbFsxXSAvIDEwMCxcclxuICAgICAgbCA9IGhzbFsyXSAvIDEwMCxcclxuICAgICAgc3YsIHY7XHJcbiAgbCAqPSAyO1xyXG4gIHMgKj0gKGwgPD0gMSkgPyBsIDogMiAtIGw7XHJcbiAgdiA9IChsICsgcykgLyAyO1xyXG4gIHN2ID0gKDIgKiBzKSAvIChsICsgcyk7XHJcbiAgcmV0dXJuIFtoLCBzdiAqIDEwMCwgdiAqIDEwMF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhzbDJod2IoYXJncykge1xyXG4gIHJldHVybiByZ2IyaHdiKGhzbDJyZ2IoYXJncykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoc2wyY215ayhhcmdzKSB7XHJcbiAgcmV0dXJuIHJnYjJjbXlrKGhzbDJyZ2IoYXJncykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoc2wya2V5d29yZChhcmdzKSB7XHJcbiAgcmV0dXJuIHJnYjJrZXl3b3JkKGhzbDJyZ2IoYXJncykpO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaHN2MnJnYihoc3YpIHtcclxuICB2YXIgaCA9IGhzdlswXSAvIDYwLFxyXG4gICAgICBzID0gaHN2WzFdIC8gMTAwLFxyXG4gICAgICB2ID0gaHN2WzJdIC8gMTAwLFxyXG4gICAgICBoaSA9IE1hdGguZmxvb3IoaCkgJSA2O1xyXG5cclxuICB2YXIgZiA9IGggLSBNYXRoLmZsb29yKGgpLFxyXG4gICAgICBwID0gMjU1ICogdiAqICgxIC0gcyksXHJcbiAgICAgIHEgPSAyNTUgKiB2ICogKDEgLSAocyAqIGYpKSxcclxuICAgICAgdCA9IDI1NSAqIHYgKiAoMSAtIChzICogKDEgLSBmKSkpLFxyXG4gICAgICB2ID0gMjU1ICogdjtcclxuXHJcbiAgc3dpdGNoKGhpKSB7XHJcbiAgICBjYXNlIDA6XHJcbiAgICAgIHJldHVybiBbdiwgdCwgcF07XHJcbiAgICBjYXNlIDE6XHJcbiAgICAgIHJldHVybiBbcSwgdiwgcF07XHJcbiAgICBjYXNlIDI6XHJcbiAgICAgIHJldHVybiBbcCwgdiwgdF07XHJcbiAgICBjYXNlIDM6XHJcbiAgICAgIHJldHVybiBbcCwgcSwgdl07XHJcbiAgICBjYXNlIDQ6XHJcbiAgICAgIHJldHVybiBbdCwgcCwgdl07XHJcbiAgICBjYXNlIDU6XHJcbiAgICAgIHJldHVybiBbdiwgcCwgcV07XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoc3YyaHNsKGhzdikge1xyXG4gIHZhciBoID0gaHN2WzBdLFxyXG4gICAgICBzID0gaHN2WzFdIC8gMTAwLFxyXG4gICAgICB2ID0gaHN2WzJdIC8gMTAwLFxyXG4gICAgICBzbCwgbDtcclxuXHJcbiAgbCA9ICgyIC0gcykgKiB2O1xyXG4gIHNsID0gcyAqIHY7XHJcbiAgc2wgLz0gKGwgPD0gMSkgPyBsIDogMiAtIGw7XHJcbiAgc2wgPSBzbCB8fCAwO1xyXG4gIGwgLz0gMjtcclxuICByZXR1cm4gW2gsIHNsICogMTAwLCBsICogMTAwXTtcclxufVxyXG5cclxuZnVuY3Rpb24gaHN2Mmh3YihhcmdzKSB7XHJcbiAgcmV0dXJuIHJnYjJod2IoaHN2MnJnYihhcmdzKSlcclxufVxyXG5cclxuZnVuY3Rpb24gaHN2MmNteWsoYXJncykge1xyXG4gIHJldHVybiByZ2IyY215ayhoc3YycmdiKGFyZ3MpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaHN2MmtleXdvcmQoYXJncykge1xyXG4gIHJldHVybiByZ2Iya2V5d29yZChoc3YycmdiKGFyZ3MpKTtcclxufVxyXG5cclxuLy8gaHR0cDovL2Rldi53My5vcmcvY3Nzd2cvY3NzLWNvbG9yLyNod2ItdG8tcmdiXHJcbmZ1bmN0aW9uIGh3YjJyZ2IoaHdiKSB7XHJcbiAgdmFyIGggPSBod2JbMF0gLyAzNjAsXHJcbiAgICAgIHdoID0gaHdiWzFdIC8gMTAwLFxyXG4gICAgICBibCA9IGh3YlsyXSAvIDEwMCxcclxuICAgICAgcmF0aW8gPSB3aCArIGJsLFxyXG4gICAgICBpLCB2LCBmLCBuO1xyXG5cclxuICAvLyB3aCArIGJsIGNhbnQgYmUgPiAxXHJcbiAgaWYgKHJhdGlvID4gMSkge1xyXG4gICAgd2ggLz0gcmF0aW87XHJcbiAgICBibCAvPSByYXRpbztcclxuICB9XHJcblxyXG4gIGkgPSBNYXRoLmZsb29yKDYgKiBoKTtcclxuICB2ID0gMSAtIGJsO1xyXG4gIGYgPSA2ICogaCAtIGk7XHJcbiAgaWYgKChpICYgMHgwMSkgIT0gMCkge1xyXG4gICAgZiA9IDEgLSBmO1xyXG4gIH1cclxuICBuID0gd2ggKyBmICogKHYgLSB3aCk7ICAvLyBsaW5lYXIgaW50ZXJwb2xhdGlvblxyXG5cclxuICBzd2l0Y2ggKGkpIHtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICBjYXNlIDY6XHJcbiAgICBjYXNlIDA6IHIgPSB2OyBnID0gbjsgYiA9IHdoOyBicmVhaztcclxuICAgIGNhc2UgMTogciA9IG47IGcgPSB2OyBiID0gd2g7IGJyZWFrO1xyXG4gICAgY2FzZSAyOiByID0gd2g7IGcgPSB2OyBiID0gbjsgYnJlYWs7XHJcbiAgICBjYXNlIDM6IHIgPSB3aDsgZyA9IG47IGIgPSB2OyBicmVhaztcclxuICAgIGNhc2UgNDogciA9IG47IGcgPSB3aDsgYiA9IHY7IGJyZWFrO1xyXG4gICAgY2FzZSA1OiByID0gdjsgZyA9IHdoOyBiID0gbjsgYnJlYWs7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gW3IgKiAyNTUsIGcgKiAyNTUsIGIgKiAyNTVdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBod2IyaHNsKGFyZ3MpIHtcclxuICByZXR1cm4gcmdiMmhzbChod2IycmdiKGFyZ3MpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaHdiMmhzdihhcmdzKSB7XHJcbiAgcmV0dXJuIHJnYjJoc3YoaHdiMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh3YjJjbXlrKGFyZ3MpIHtcclxuICByZXR1cm4gcmdiMmNteWsoaHdiMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGh3YjJrZXl3b3JkKGFyZ3MpIHtcclxuICByZXR1cm4gcmdiMmtleXdvcmQoaHdiMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNteWsycmdiKGNteWspIHtcclxuICB2YXIgYyA9IGNteWtbMF0gLyAxMDAsXHJcbiAgICAgIG0gPSBjbXlrWzFdIC8gMTAwLFxyXG4gICAgICB5ID0gY215a1syXSAvIDEwMCxcclxuICAgICAgayA9IGNteWtbM10gLyAxMDAsXHJcbiAgICAgIHIsIGcsIGI7XHJcblxyXG4gIHIgPSAxIC0gTWF0aC5taW4oMSwgYyAqICgxIC0gaykgKyBrKTtcclxuICBnID0gMSAtIE1hdGgubWluKDEsIG0gKiAoMSAtIGspICsgayk7XHJcbiAgYiA9IDEgLSBNYXRoLm1pbigxLCB5ICogKDEgLSBrKSArIGspO1xyXG4gIHJldHVybiBbciAqIDI1NSwgZyAqIDI1NSwgYiAqIDI1NV07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNteWsyaHNsKGFyZ3MpIHtcclxuICByZXR1cm4gcmdiMmhzbChjbXlrMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNteWsyaHN2KGFyZ3MpIHtcclxuICByZXR1cm4gcmdiMmhzdihjbXlrMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNteWsyaHdiKGFyZ3MpIHtcclxuICByZXR1cm4gcmdiMmh3YihjbXlrMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNteWsya2V5d29yZChhcmdzKSB7XHJcbiAgcmV0dXJuIHJnYjJrZXl3b3JkKGNteWsycmdiKGFyZ3MpKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHh5ejJyZ2IoeHl6KSB7XHJcbiAgdmFyIHggPSB4eXpbMF0gLyAxMDAsXHJcbiAgICAgIHkgPSB4eXpbMV0gLyAxMDAsXHJcbiAgICAgIHogPSB4eXpbMl0gLyAxMDAsXHJcbiAgICAgIHIsIGcsIGI7XHJcblxyXG4gIHIgPSAoeCAqIDMuMjQwNikgKyAoeSAqIC0xLjUzNzIpICsgKHogKiAtMC40OTg2KTtcclxuICBnID0gKHggKiAtMC45Njg5KSArICh5ICogMS44NzU4KSArICh6ICogMC4wNDE1KTtcclxuICBiID0gKHggKiAwLjA1NTcpICsgKHkgKiAtMC4yMDQwKSArICh6ICogMS4wNTcwKTtcclxuXHJcbiAgLy8gYXNzdW1lIHNSR0JcclxuICByID0gciA+IDAuMDAzMTMwOCA/ICgoMS4wNTUgKiBNYXRoLnBvdyhyLCAxLjAgLyAyLjQpKSAtIDAuMDU1KVxyXG4gICAgOiByID0gKHIgKiAxMi45Mik7XHJcblxyXG4gIGcgPSBnID4gMC4wMDMxMzA4ID8gKCgxLjA1NSAqIE1hdGgucG93KGcsIDEuMCAvIDIuNCkpIC0gMC4wNTUpXHJcbiAgICA6IGcgPSAoZyAqIDEyLjkyKTtcclxuXHJcbiAgYiA9IGIgPiAwLjAwMzEzMDggPyAoKDEuMDU1ICogTWF0aC5wb3coYiwgMS4wIC8gMi40KSkgLSAwLjA1NSlcclxuICAgIDogYiA9IChiICogMTIuOTIpO1xyXG5cclxuICByID0gTWF0aC5taW4oTWF0aC5tYXgoMCwgciksIDEpO1xyXG4gIGcgPSBNYXRoLm1pbihNYXRoLm1heCgwLCBnKSwgMSk7XHJcbiAgYiA9IE1hdGgubWluKE1hdGgubWF4KDAsIGIpLCAxKTtcclxuXHJcbiAgcmV0dXJuIFtyICogMjU1LCBnICogMjU1LCBiICogMjU1XTtcclxufVxyXG5cclxuZnVuY3Rpb24geHl6MmxhYih4eXopIHtcclxuICB2YXIgeCA9IHh5elswXSxcclxuICAgICAgeSA9IHh5elsxXSxcclxuICAgICAgeiA9IHh5elsyXSxcclxuICAgICAgbCwgYSwgYjtcclxuXHJcbiAgeCAvPSA5NS4wNDc7XHJcbiAgeSAvPSAxMDA7XHJcbiAgeiAvPSAxMDguODgzO1xyXG5cclxuICB4ID0geCA+IDAuMDA4ODU2ID8gTWF0aC5wb3coeCwgMS8zKSA6ICg3Ljc4NyAqIHgpICsgKDE2IC8gMTE2KTtcclxuICB5ID0geSA+IDAuMDA4ODU2ID8gTWF0aC5wb3coeSwgMS8zKSA6ICg3Ljc4NyAqIHkpICsgKDE2IC8gMTE2KTtcclxuICB6ID0geiA+IDAuMDA4ODU2ID8gTWF0aC5wb3coeiwgMS8zKSA6ICg3Ljc4NyAqIHopICsgKDE2IC8gMTE2KTtcclxuXHJcbiAgbCA9ICgxMTYgKiB5KSAtIDE2O1xyXG4gIGEgPSA1MDAgKiAoeCAtIHkpO1xyXG4gIGIgPSAyMDAgKiAoeSAtIHopO1xyXG5cclxuICByZXR1cm4gW2wsIGEsIGJdO1xyXG59XHJcblxyXG5mdW5jdGlvbiB4eXoybGNoKGFyZ3MpIHtcclxuICByZXR1cm4gbGFiMmxjaCh4eXoybGFiKGFyZ3MpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGFiMnh5eihsYWIpIHtcclxuICB2YXIgbCA9IGxhYlswXSxcclxuICAgICAgYSA9IGxhYlsxXSxcclxuICAgICAgYiA9IGxhYlsyXSxcclxuICAgICAgeCwgeSwgeiwgeTI7XHJcblxyXG4gIGlmIChsIDw9IDgpIHtcclxuICAgIHkgPSAobCAqIDEwMCkgLyA5MDMuMztcclxuICAgIHkyID0gKDcuNzg3ICogKHkgLyAxMDApKSArICgxNiAvIDExNik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHkgPSAxMDAgKiBNYXRoLnBvdygobCArIDE2KSAvIDExNiwgMyk7XHJcbiAgICB5MiA9IE1hdGgucG93KHkgLyAxMDAsIDEvMyk7XHJcbiAgfVxyXG5cclxuICB4ID0geCAvIDk1LjA0NyA8PSAwLjAwODg1NiA/IHggPSAoOTUuMDQ3ICogKChhIC8gNTAwKSArIHkyIC0gKDE2IC8gMTE2KSkpIC8gNy43ODcgOiA5NS4wNDcgKiBNYXRoLnBvdygoYSAvIDUwMCkgKyB5MiwgMyk7XHJcblxyXG4gIHogPSB6IC8gMTA4Ljg4MyA8PSAwLjAwODg1OSA/IHogPSAoMTA4Ljg4MyAqICh5MiAtIChiIC8gMjAwKSAtICgxNiAvIDExNikpKSAvIDcuNzg3IDogMTA4Ljg4MyAqIE1hdGgucG93KHkyIC0gKGIgLyAyMDApLCAzKTtcclxuXHJcbiAgcmV0dXJuIFt4LCB5LCB6XTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGFiMmxjaChsYWIpIHtcclxuICB2YXIgbCA9IGxhYlswXSxcclxuICAgICAgYSA9IGxhYlsxXSxcclxuICAgICAgYiA9IGxhYlsyXSxcclxuICAgICAgaHIsIGgsIGM7XHJcblxyXG4gIGhyID0gTWF0aC5hdGFuMihiLCBhKTtcclxuICBoID0gaHIgKiAzNjAgLyAyIC8gTWF0aC5QSTtcclxuICBpZiAoaCA8IDApIHtcclxuICAgIGggKz0gMzYwO1xyXG4gIH1cclxuICBjID0gTWF0aC5zcXJ0KGEgKiBhICsgYiAqIGIpO1xyXG4gIHJldHVybiBbbCwgYywgaF07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxhYjJyZ2IoYXJncykge1xyXG4gIHJldHVybiB4eXoycmdiKGxhYjJ4eXooYXJncykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsY2gybGFiKGxjaCkge1xyXG4gIHZhciBsID0gbGNoWzBdLFxyXG4gICAgICBjID0gbGNoWzFdLFxyXG4gICAgICBoID0gbGNoWzJdLFxyXG4gICAgICBhLCBiLCBocjtcclxuXHJcbiAgaHIgPSBoIC8gMzYwICogMiAqIE1hdGguUEk7XHJcbiAgYSA9IGMgKiBNYXRoLmNvcyhocik7XHJcbiAgYiA9IGMgKiBNYXRoLnNpbihocik7XHJcbiAgcmV0dXJuIFtsLCBhLCBiXTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGNoMnh5eihhcmdzKSB7XHJcbiAgcmV0dXJuIGxhYjJ4eXoobGNoMmxhYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxjaDJyZ2IoYXJncykge1xyXG4gIHJldHVybiBsYWIycmdiKGxjaDJsYWIoYXJncykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBrZXl3b3JkMnJnYihrZXl3b3JkKSB7XHJcbiAgcmV0dXJuIGNzc0tleXdvcmRzW2tleXdvcmRdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBrZXl3b3JkMmhzbChhcmdzKSB7XHJcbiAgcmV0dXJuIHJnYjJoc2woa2V5d29yZDJyZ2IoYXJncykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBrZXl3b3JkMmhzdihhcmdzKSB7XHJcbiAgcmV0dXJuIHJnYjJoc3Yoa2V5d29yZDJyZ2IoYXJncykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBrZXl3b3JkMmh3YihhcmdzKSB7XHJcbiAgcmV0dXJuIHJnYjJod2Ioa2V5d29yZDJyZ2IoYXJncykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBrZXl3b3JkMmNteWsoYXJncykge1xyXG4gIHJldHVybiByZ2IyY215ayhrZXl3b3JkMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGtleXdvcmQybGFiKGFyZ3MpIHtcclxuICByZXR1cm4gcmdiMmxhYihrZXl3b3JkMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGtleXdvcmQyeHl6KGFyZ3MpIHtcclxuICByZXR1cm4gcmdiMnh5eihrZXl3b3JkMnJnYihhcmdzKSk7XHJcbn1cclxuXHJcbnZhciBjc3NLZXl3b3JkcyA9IHtcclxuICBhbGljZWJsdWU6ICBbMjQwLDI0OCwyNTVdLFxyXG4gIGFudGlxdWV3aGl0ZTogWzI1MCwyMzUsMjE1XSxcclxuICBhcXVhOiBbMCwyNTUsMjU1XSxcclxuICBhcXVhbWFyaW5lOiBbMTI3LDI1NSwyMTJdLFxyXG4gIGF6dXJlOiAgWzI0MCwyNTUsMjU1XSxcclxuICBiZWlnZTogIFsyNDUsMjQ1LDIyMF0sXHJcbiAgYmlzcXVlOiBbMjU1LDIyOCwxOTZdLFxyXG4gIGJsYWNrOiAgWzAsMCwwXSxcclxuICBibGFuY2hlZGFsbW9uZDogWzI1NSwyMzUsMjA1XSxcclxuICBibHVlOiBbMCwwLDI1NV0sXHJcbiAgYmx1ZXZpb2xldDogWzEzOCw0MywyMjZdLFxyXG4gIGJyb3duOiAgWzE2NSw0Miw0Ml0sXHJcbiAgYnVybHl3b29kOiAgWzIyMiwxODQsMTM1XSxcclxuICBjYWRldGJsdWU6ICBbOTUsMTU4LDE2MF0sXHJcbiAgY2hhcnRyZXVzZTogWzEyNywyNTUsMF0sXHJcbiAgY2hvY29sYXRlOiAgWzIxMCwxMDUsMzBdLFxyXG4gIGNvcmFsOiAgWzI1NSwxMjcsODBdLFxyXG4gIGNvcm5mbG93ZXJibHVlOiBbMTAwLDE0OSwyMzddLFxyXG4gIGNvcm5zaWxrOiBbMjU1LDI0OCwyMjBdLFxyXG4gIGNyaW1zb246ICBbMjIwLDIwLDYwXSxcclxuICBjeWFuOiBbMCwyNTUsMjU1XSxcclxuICBkYXJrYmx1ZTogWzAsMCwxMzldLFxyXG4gIGRhcmtjeWFuOiBbMCwxMzksMTM5XSxcclxuICBkYXJrZ29sZGVucm9kOiAgWzE4NCwxMzQsMTFdLFxyXG4gIGRhcmtncmF5OiBbMTY5LDE2OSwxNjldLFxyXG4gIGRhcmtncmVlbjogIFswLDEwMCwwXSxcclxuICBkYXJrZ3JleTogWzE2OSwxNjksMTY5XSxcclxuICBkYXJra2hha2k6ICBbMTg5LDE4MywxMDddLFxyXG4gIGRhcmttYWdlbnRhOiAgWzEzOSwwLDEzOV0sXHJcbiAgZGFya29saXZlZ3JlZW46IFs4NSwxMDcsNDddLFxyXG4gIGRhcmtvcmFuZ2U6IFsyNTUsMTQwLDBdLFxyXG4gIGRhcmtvcmNoaWQ6IFsxNTMsNTAsMjA0XSxcclxuICBkYXJrcmVkOiAgWzEzOSwwLDBdLFxyXG4gIGRhcmtzYWxtb246IFsyMzMsMTUwLDEyMl0sXHJcbiAgZGFya3NlYWdyZWVuOiBbMTQzLDE4OCwxNDNdLFxyXG4gIGRhcmtzbGF0ZWJsdWU6ICBbNzIsNjEsMTM5XSxcclxuICBkYXJrc2xhdGVncmF5OiAgWzQ3LDc5LDc5XSxcclxuICBkYXJrc2xhdGVncmV5OiAgWzQ3LDc5LDc5XSxcclxuICBkYXJrdHVycXVvaXNlOiAgWzAsMjA2LDIwOV0sXHJcbiAgZGFya3Zpb2xldDogWzE0OCwwLDIxMV0sXHJcbiAgZGVlcHBpbms6IFsyNTUsMjAsMTQ3XSxcclxuICBkZWVwc2t5Ymx1ZTogIFswLDE5MSwyNTVdLFxyXG4gIGRpbWdyYXk6ICBbMTA1LDEwNSwxMDVdLFxyXG4gIGRpbWdyZXk6ICBbMTA1LDEwNSwxMDVdLFxyXG4gIGRvZGdlcmJsdWU6IFszMCwxNDQsMjU1XSxcclxuICBmaXJlYnJpY2s6ICBbMTc4LDM0LDM0XSxcclxuICBmbG9yYWx3aGl0ZTogIFsyNTUsMjUwLDI0MF0sXHJcbiAgZm9yZXN0Z3JlZW46ICBbMzQsMTM5LDM0XSxcclxuICBmdWNoc2lhOiAgWzI1NSwwLDI1NV0sXHJcbiAgZ2FpbnNib3JvOiAgWzIyMCwyMjAsMjIwXSxcclxuICBnaG9zdHdoaXRlOiBbMjQ4LDI0OCwyNTVdLFxyXG4gIGdvbGQ6IFsyNTUsMjE1LDBdLFxyXG4gIGdvbGRlbnJvZDogIFsyMTgsMTY1LDMyXSxcclxuICBncmF5OiBbMTI4LDEyOCwxMjhdLFxyXG4gIGdyZWVuOiAgWzAsMTI4LDBdLFxyXG4gIGdyZWVueWVsbG93OiAgWzE3MywyNTUsNDddLFxyXG4gIGdyZXk6IFsxMjgsMTI4LDEyOF0sXHJcbiAgaG9uZXlkZXc6IFsyNDAsMjU1LDI0MF0sXHJcbiAgaG90cGluazogIFsyNTUsMTA1LDE4MF0sXHJcbiAgaW5kaWFucmVkOiAgWzIwNSw5Miw5Ml0sXHJcbiAgaW5kaWdvOiBbNzUsMCwxMzBdLFxyXG4gIGl2b3J5OiAgWzI1NSwyNTUsMjQwXSxcclxuICBraGFraTogIFsyNDAsMjMwLDE0MF0sXHJcbiAgbGF2ZW5kZXI6IFsyMzAsMjMwLDI1MF0sXHJcbiAgbGF2ZW5kZXJibHVzaDogIFsyNTUsMjQwLDI0NV0sXHJcbiAgbGF3bmdyZWVuOiAgWzEyNCwyNTIsMF0sXHJcbiAgbGVtb25jaGlmZm9uOiBbMjU1LDI1MCwyMDVdLFxyXG4gIGxpZ2h0Ymx1ZTogIFsxNzMsMjE2LDIzMF0sXHJcbiAgbGlnaHRjb3JhbDogWzI0MCwxMjgsMTI4XSxcclxuICBsaWdodGN5YW46ICBbMjI0LDI1NSwyNTVdLFxyXG4gIGxpZ2h0Z29sZGVucm9keWVsbG93OiBbMjUwLDI1MCwyMTBdLFxyXG4gIGxpZ2h0Z3JheTogIFsyMTEsMjExLDIxMV0sXHJcbiAgbGlnaHRncmVlbjogWzE0NCwyMzgsMTQ0XSxcclxuICBsaWdodGdyZXk6ICBbMjExLDIxMSwyMTFdLFxyXG4gIGxpZ2h0cGluazogIFsyNTUsMTgyLDE5M10sXHJcbiAgbGlnaHRzYWxtb246ICBbMjU1LDE2MCwxMjJdLFxyXG4gIGxpZ2h0c2VhZ3JlZW46ICBbMzIsMTc4LDE3MF0sXHJcbiAgbGlnaHRza3libHVlOiBbMTM1LDIwNiwyNTBdLFxyXG4gIGxpZ2h0c2xhdGVncmF5OiBbMTE5LDEzNiwxNTNdLFxyXG4gIGxpZ2h0c2xhdGVncmV5OiBbMTE5LDEzNiwxNTNdLFxyXG4gIGxpZ2h0c3RlZWxibHVlOiBbMTc2LDE5NiwyMjJdLFxyXG4gIGxpZ2h0eWVsbG93OiAgWzI1NSwyNTUsMjI0XSxcclxuICBsaW1lOiBbMCwyNTUsMF0sXHJcbiAgbGltZWdyZWVuOiAgWzUwLDIwNSw1MF0sXHJcbiAgbGluZW46ICBbMjUwLDI0MCwyMzBdLFxyXG4gIG1hZ2VudGE6ICBbMjU1LDAsMjU1XSxcclxuICBtYXJvb246IFsxMjgsMCwwXSxcclxuICBtZWRpdW1hcXVhbWFyaW5lOiBbMTAyLDIwNSwxNzBdLFxyXG4gIG1lZGl1bWJsdWU6IFswLDAsMjA1XSxcclxuICBtZWRpdW1vcmNoaWQ6IFsxODYsODUsMjExXSxcclxuICBtZWRpdW1wdXJwbGU6IFsxNDcsMTEyLDIxOV0sXHJcbiAgbWVkaXVtc2VhZ3JlZW46IFs2MCwxNzksMTEzXSxcclxuICBtZWRpdW1zbGF0ZWJsdWU6ICBbMTIzLDEwNCwyMzhdLFxyXG4gIG1lZGl1bXNwcmluZ2dyZWVuOiAgWzAsMjUwLDE1NF0sXHJcbiAgbWVkaXVtdHVycXVvaXNlOiAgWzcyLDIwOSwyMDRdLFxyXG4gIG1lZGl1bXZpb2xldHJlZDogIFsxOTksMjEsMTMzXSxcclxuICBtaWRuaWdodGJsdWU6IFsyNSwyNSwxMTJdLFxyXG4gIG1pbnRjcmVhbTogIFsyNDUsMjU1LDI1MF0sXHJcbiAgbWlzdHlyb3NlOiAgWzI1NSwyMjgsMjI1XSxcclxuICBtb2NjYXNpbjogWzI1NSwyMjgsMTgxXSxcclxuICBuYXZham93aGl0ZTogIFsyNTUsMjIyLDE3M10sXHJcbiAgbmF2eTogWzAsMCwxMjhdLFxyXG4gIG9sZGxhY2U6ICBbMjUzLDI0NSwyMzBdLFxyXG4gIG9saXZlOiAgWzEyOCwxMjgsMF0sXHJcbiAgb2xpdmVkcmFiOiAgWzEwNywxNDIsMzVdLFxyXG4gIG9yYW5nZTogWzI1NSwxNjUsMF0sXHJcbiAgb3JhbmdlcmVkOiAgWzI1NSw2OSwwXSxcclxuICBvcmNoaWQ6IFsyMTgsMTEyLDIxNF0sXHJcbiAgcGFsZWdvbGRlbnJvZDogIFsyMzgsMjMyLDE3MF0sXHJcbiAgcGFsZWdyZWVuOiAgWzE1MiwyNTEsMTUyXSxcclxuICBwYWxldHVycXVvaXNlOiAgWzE3NSwyMzgsMjM4XSxcclxuICBwYWxldmlvbGV0cmVkOiAgWzIxOSwxMTIsMTQ3XSxcclxuICBwYXBheWF3aGlwOiBbMjU1LDIzOSwyMTNdLFxyXG4gIHBlYWNocHVmZjogIFsyNTUsMjE4LDE4NV0sXHJcbiAgcGVydTogWzIwNSwxMzMsNjNdLFxyXG4gIHBpbms6IFsyNTUsMTkyLDIwM10sXHJcbiAgcGx1bTogWzIyMSwxNjAsMjIxXSxcclxuICBwb3dkZXJibHVlOiBbMTc2LDIyNCwyMzBdLFxyXG4gIHB1cnBsZTogWzEyOCwwLDEyOF0sXHJcbiAgcmViZWNjYXB1cnBsZTogWzEwMiwgNTEsIDE1M10sXHJcbiAgcmVkOiAgWzI1NSwwLDBdLFxyXG4gIHJvc3licm93bjogIFsxODgsMTQzLDE0M10sXHJcbiAgcm95YWxibHVlOiAgWzY1LDEwNSwyMjVdLFxyXG4gIHNhZGRsZWJyb3duOiAgWzEzOSw2OSwxOV0sXHJcbiAgc2FsbW9uOiBbMjUwLDEyOCwxMTRdLFxyXG4gIHNhbmR5YnJvd246IFsyNDQsMTY0LDk2XSxcclxuICBzZWFncmVlbjogWzQ2LDEzOSw4N10sXHJcbiAgc2Vhc2hlbGw6IFsyNTUsMjQ1LDIzOF0sXHJcbiAgc2llbm5hOiBbMTYwLDgyLDQ1XSxcclxuICBzaWx2ZXI6IFsxOTIsMTkyLDE5Ml0sXHJcbiAgc2t5Ymx1ZTogIFsxMzUsMjA2LDIzNV0sXHJcbiAgc2xhdGVibHVlOiAgWzEwNiw5MCwyMDVdLFxyXG4gIHNsYXRlZ3JheTogIFsxMTIsMTI4LDE0NF0sXHJcbiAgc2xhdGVncmV5OiAgWzExMiwxMjgsMTQ0XSxcclxuICBzbm93OiBbMjU1LDI1MCwyNTBdLFxyXG4gIHNwcmluZ2dyZWVuOiAgWzAsMjU1LDEyN10sXHJcbiAgc3RlZWxibHVlOiAgWzcwLDEzMCwxODBdLFxyXG4gIHRhbjogIFsyMTAsMTgwLDE0MF0sXHJcbiAgdGVhbDogWzAsMTI4LDEyOF0sXHJcbiAgdGhpc3RsZTogIFsyMTYsMTkxLDIxNl0sXHJcbiAgdG9tYXRvOiBbMjU1LDk5LDcxXSxcclxuICB0dXJxdW9pc2U6ICBbNjQsMjI0LDIwOF0sXHJcbiAgdmlvbGV0OiBbMjM4LDEzMCwyMzhdLFxyXG4gIHdoZWF0OiAgWzI0NSwyMjIsMTc5XSxcclxuICB3aGl0ZTogIFsyNTUsMjU1LDI1NV0sXHJcbiAgd2hpdGVzbW9rZTogWzI0NSwyNDUsMjQ1XSxcclxuICB5ZWxsb3c6IFsyNTUsMjU1LDBdLFxyXG4gIHllbGxvd2dyZWVuOiAgWzE1NCwyMDUsNTBdXHJcbn07XHJcblxyXG52YXIgcmV2ZXJzZUtleXdvcmRzID0ge307XHJcbmZvciAodmFyIGtleSBpbiBjc3NLZXl3b3Jkcykge1xyXG4gIHJldmVyc2VLZXl3b3Jkc1tKU09OLnN0cmluZ2lmeShjc3NLZXl3b3Jkc1trZXldKV0gPSBrZXk7XHJcbn1cclxuIiwidmFyIGNvbnZlcnNpb25zID0gcmVxdWlyZShcIi4vY29udmVyc2lvbnNcIik7XHJcblxyXG52YXIgY29udmVydCA9IGZ1bmN0aW9uKCkge1xyXG4gICByZXR1cm4gbmV3IENvbnZlcnRlcigpO1xyXG59XHJcblxyXG5mb3IgKHZhciBmdW5jIGluIGNvbnZlcnNpb25zKSB7XHJcbiAgLy8gZXhwb3J0IFJhdyB2ZXJzaW9uc1xyXG4gIGNvbnZlcnRbZnVuYyArIFwiUmF3XCJdID0gIChmdW5jdGlvbihmdW5jKSB7XHJcbiAgICAvLyBhY2NlcHQgYXJyYXkgb3IgcGxhaW4gYXJnc1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xyXG4gICAgICBpZiAodHlwZW9mIGFyZyA9PSBcIm51bWJlclwiKVxyXG4gICAgICAgIGFyZyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICAgIHJldHVybiBjb252ZXJzaW9uc1tmdW5jXShhcmcpO1xyXG4gICAgfVxyXG4gIH0pKGZ1bmMpO1xyXG5cclxuICB2YXIgcGFpciA9IC8oXFx3KykyKFxcdyspLy5leGVjKGZ1bmMpLFxyXG4gICAgICBmcm9tID0gcGFpclsxXSxcclxuICAgICAgdG8gPSBwYWlyWzJdO1xyXG5cclxuICAvLyBleHBvcnQgcmdiMmhzbCBhbmQgW1wicmdiXCJdW1wiaHNsXCJdXHJcbiAgY29udmVydFtmcm9tXSA9IGNvbnZlcnRbZnJvbV0gfHwge307XHJcblxyXG4gIGNvbnZlcnRbZnJvbV1bdG9dID0gY29udmVydFtmdW5jXSA9IChmdW5jdGlvbihmdW5jKSB7IFxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xyXG4gICAgICBpZiAodHlwZW9mIGFyZyA9PSBcIm51bWJlclwiKVxyXG4gICAgICAgIGFyZyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICAgIFxyXG4gICAgICB2YXIgdmFsID0gY29udmVyc2lvbnNbZnVuY10oYXJnKTtcclxuICAgICAgaWYgKHR5cGVvZiB2YWwgPT0gXCJzdHJpbmdcIiB8fCB2YWwgPT09IHVuZGVmaW5lZClcclxuICAgICAgICByZXR1cm4gdmFsOyAvLyBrZXl3b3JkXHJcblxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKylcclxuICAgICAgICB2YWxbaV0gPSBNYXRoLnJvdW5kKHZhbFtpXSk7XHJcbiAgICAgIHJldHVybiB2YWw7XHJcbiAgICB9XHJcbiAgfSkoZnVuYyk7XHJcbn1cclxuXHJcblxyXG4vKiBDb252ZXJ0ZXIgZG9lcyBsYXp5IGNvbnZlcnNpb24gYW5kIGNhY2hpbmcgKi9cclxudmFyIENvbnZlcnRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICB0aGlzLmNvbnZzID0ge307XHJcbn07XHJcblxyXG4vKiBFaXRoZXIgZ2V0IHRoZSB2YWx1ZXMgZm9yIGEgc3BhY2Ugb3JcclxuICBzZXQgdGhlIHZhbHVlcyBmb3IgYSBzcGFjZSwgZGVwZW5kaW5nIG9uIGFyZ3MgKi9cclxuQ29udmVydGVyLnByb3RvdHlwZS5yb3V0ZVNwYWNlID0gZnVuY3Rpb24oc3BhY2UsIGFyZ3MpIHtcclxuICAgdmFyIHZhbHVlcyA9IGFyZ3NbMF07XHJcbiAgIGlmICh2YWx1ZXMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAvLyBjb2xvci5yZ2IoKVxyXG4gICAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZXMoc3BhY2UpO1xyXG4gICB9XHJcbiAgIC8vIGNvbG9yLnJnYigxMCwgMTAsIDEwKVxyXG4gICBpZiAodHlwZW9mIHZhbHVlcyA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgIHZhbHVlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpOyAgICAgICAgXHJcbiAgIH1cclxuXHJcbiAgIHJldHVybiB0aGlzLnNldFZhbHVlcyhzcGFjZSwgdmFsdWVzKTtcclxufTtcclxuICBcclxuLyogU2V0IHRoZSB2YWx1ZXMgZm9yIGEgc3BhY2UsIGludmFsaWRhdGluZyBjYWNoZSAqL1xyXG5Db252ZXJ0ZXIucHJvdG90eXBlLnNldFZhbHVlcyA9IGZ1bmN0aW9uKHNwYWNlLCB2YWx1ZXMpIHtcclxuICAgdGhpcy5zcGFjZSA9IHNwYWNlO1xyXG4gICB0aGlzLmNvbnZzID0ge307XHJcbiAgIHRoaXMuY29udnNbc3BhY2VdID0gdmFsdWVzO1xyXG4gICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qIEdldCB0aGUgdmFsdWVzIGZvciBhIHNwYWNlLiBJZiB0aGVyZSdzIGFscmVhZHlcclxuICBhIGNvbnZlcnNpb24gZm9yIHRoZSBzcGFjZSwgZmV0Y2ggaXQsIG90aGVyd2lzZVxyXG4gIGNvbXB1dGUgaXQgKi9cclxuQ29udmVydGVyLnByb3RvdHlwZS5nZXRWYWx1ZXMgPSBmdW5jdGlvbihzcGFjZSkge1xyXG4gICB2YXIgdmFscyA9IHRoaXMuY29udnNbc3BhY2VdO1xyXG4gICBpZiAoIXZhbHMpIHtcclxuICAgICAgdmFyIGZzcGFjZSA9IHRoaXMuc3BhY2UsXHJcbiAgICAgICAgICBmcm9tID0gdGhpcy5jb252c1tmc3BhY2VdO1xyXG4gICAgICB2YWxzID0gY29udmVydFtmc3BhY2VdW3NwYWNlXShmcm9tKTtcclxuXHJcbiAgICAgIHRoaXMuY29udnNbc3BhY2VdID0gdmFscztcclxuICAgfVxyXG4gIHJldHVybiB2YWxzO1xyXG59O1xyXG5cclxuW1wicmdiXCIsIFwiaHNsXCIsIFwiaHN2XCIsIFwiY215a1wiLCBcImtleXdvcmRcIl0uZm9yRWFjaChmdW5jdGlvbihzcGFjZSkge1xyXG4gICBDb252ZXJ0ZXIucHJvdG90eXBlW3NwYWNlXSA9IGZ1bmN0aW9uKHZhbHMpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucm91dGVTcGFjZShzcGFjZSwgYXJndW1lbnRzKTtcclxuICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29udmVydDsiLCIvKiBNSVQgbGljZW5zZSAqL1xyXG52YXIgY29sb3JOYW1lcyA9IHJlcXVpcmUoJ2NvbG9yLW5hbWUnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICBnZXRSZ2JhOiBnZXRSZ2JhLFxyXG4gICBnZXRIc2xhOiBnZXRIc2xhLFxyXG4gICBnZXRSZ2I6IGdldFJnYixcclxuICAgZ2V0SHNsOiBnZXRIc2wsXHJcbiAgIGdldEh3YjogZ2V0SHdiLFxyXG4gICBnZXRBbHBoYTogZ2V0QWxwaGEsXHJcblxyXG4gICBoZXhTdHJpbmc6IGhleFN0cmluZyxcclxuICAgcmdiU3RyaW5nOiByZ2JTdHJpbmcsXHJcbiAgIHJnYmFTdHJpbmc6IHJnYmFTdHJpbmcsXHJcbiAgIHBlcmNlbnRTdHJpbmc6IHBlcmNlbnRTdHJpbmcsXHJcbiAgIHBlcmNlbnRhU3RyaW5nOiBwZXJjZW50YVN0cmluZyxcclxuICAgaHNsU3RyaW5nOiBoc2xTdHJpbmcsXHJcbiAgIGhzbGFTdHJpbmc6IGhzbGFTdHJpbmcsXHJcbiAgIGh3YlN0cmluZzogaHdiU3RyaW5nLFxyXG4gICBrZXl3b3JkOiBrZXl3b3JkXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFJnYmEoc3RyaW5nKSB7XHJcbiAgIGlmICghc3RyaW5nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgfVxyXG4gICB2YXIgYWJiciA9ICAvXiMoW2EtZkEtRjAtOV17M30pJC8sXHJcbiAgICAgICBoZXggPSAgL14jKFthLWZBLUYwLTldezZ9KSQvLFxyXG4gICAgICAgcmdiYSA9IC9ecmdiYT9cXChcXHMqKFsrLV0/XFxkKylcXHMqLFxccyooWystXT9cXGQrKVxccyosXFxzKihbKy1dP1xcZCspXFxzKig/OixcXHMqKFsrLV0/W1xcZFxcLl0rKVxccyopP1xcKSQvLFxyXG4gICAgICAgcGVyID0gL15yZ2JhP1xcKFxccyooWystXT9bXFxkXFwuXSspXFwlXFxzKixcXHMqKFsrLV0/W1xcZFxcLl0rKVxcJVxccyosXFxzKihbKy1dP1tcXGRcXC5dKylcXCVcXHMqKD86LFxccyooWystXT9bXFxkXFwuXSspXFxzKik/XFwpJC8sXHJcbiAgICAgICBrZXl3b3JkID0gLyhcXHcrKS87XHJcblxyXG4gICB2YXIgcmdiID0gWzAsIDAsIDBdLFxyXG4gICAgICAgYSA9IDEsXHJcbiAgICAgICBtYXRjaCA9IHN0cmluZy5tYXRjaChhYmJyKTtcclxuICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgIG1hdGNoID0gbWF0Y2hbMV07XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmdiLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgIHJnYltpXSA9IHBhcnNlSW50KG1hdGNoW2ldICsgbWF0Y2hbaV0sIDE2KTtcclxuICAgICAgfVxyXG4gICB9XHJcbiAgIGVsc2UgaWYgKG1hdGNoID0gc3RyaW5nLm1hdGNoKGhleCkpIHtcclxuICAgICAgbWF0Y2ggPSBtYXRjaFsxXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZ2IubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgcmdiW2ldID0gcGFyc2VJbnQobWF0Y2guc2xpY2UoaSAqIDIsIGkgKiAyICsgMiksIDE2KTtcclxuICAgICAgfVxyXG4gICB9XHJcbiAgIGVsc2UgaWYgKG1hdGNoID0gc3RyaW5nLm1hdGNoKHJnYmEpKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmdiLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgIHJnYltpXSA9IHBhcnNlSW50KG1hdGNoW2kgKyAxXSk7XHJcbiAgICAgIH1cclxuICAgICAgYSA9IHBhcnNlRmxvYXQobWF0Y2hbNF0pO1xyXG4gICB9XHJcbiAgIGVsc2UgaWYgKG1hdGNoID0gc3RyaW5nLm1hdGNoKHBlcikpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZ2IubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgcmdiW2ldID0gTWF0aC5yb3VuZChwYXJzZUZsb2F0KG1hdGNoW2kgKyAxXSkgKiAyLjU1KTtcclxuICAgICAgfVxyXG4gICAgICBhID0gcGFyc2VGbG9hdChtYXRjaFs0XSk7XHJcbiAgIH1cclxuICAgZWxzZSBpZiAobWF0Y2ggPSBzdHJpbmcubWF0Y2goa2V5d29yZCkpIHtcclxuICAgICAgaWYgKG1hdGNoWzFdID09IFwidHJhbnNwYXJlbnRcIikge1xyXG4gICAgICAgICByZXR1cm4gWzAsIDAsIDAsIDBdO1xyXG4gICAgICB9XHJcbiAgICAgIHJnYiA9IGNvbG9yTmFtZXNbbWF0Y2hbMV1dO1xyXG4gICAgICBpZiAoIXJnYikge1xyXG4gICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZ2IubGVuZ3RoOyBpKyspIHtcclxuICAgICAgcmdiW2ldID0gc2NhbGUocmdiW2ldLCAwLCAyNTUpO1xyXG4gICB9XHJcbiAgIGlmICghYSAmJiBhICE9IDApIHtcclxuICAgICAgYSA9IDE7XHJcbiAgIH1cclxuICAgZWxzZSB7XHJcbiAgICAgIGEgPSBzY2FsZShhLCAwLCAxKTtcclxuICAgfVxyXG4gICByZ2JbM10gPSBhO1xyXG4gICByZXR1cm4gcmdiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRIc2xhKHN0cmluZykge1xyXG4gICBpZiAoIXN0cmluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgIH1cclxuICAgdmFyIGhzbCA9IC9eaHNsYT9cXChcXHMqKFsrLV0/XFxkKykoPzpkZWcpP1xccyosXFxzKihbKy1dP1tcXGRcXC5dKyklXFxzKixcXHMqKFsrLV0/W1xcZFxcLl0rKSVcXHMqKD86LFxccyooWystXT9bXFxkXFwuXSspXFxzKik/XFwpLztcclxuICAgdmFyIG1hdGNoID0gc3RyaW5nLm1hdGNoKGhzbCk7XHJcbiAgIGlmIChtYXRjaCkge1xyXG4gICAgICB2YXIgYWxwaGEgPSBwYXJzZUZsb2F0KG1hdGNoWzRdKTtcclxuICAgICAgdmFyIGggPSBzY2FsZShwYXJzZUludChtYXRjaFsxXSksIDAsIDM2MCksXHJcbiAgICAgICAgICBzID0gc2NhbGUocGFyc2VGbG9hdChtYXRjaFsyXSksIDAsIDEwMCksXHJcbiAgICAgICAgICBsID0gc2NhbGUocGFyc2VGbG9hdChtYXRjaFszXSksIDAsIDEwMCksXHJcbiAgICAgICAgICBhID0gc2NhbGUoaXNOYU4oYWxwaGEpID8gMSA6IGFscGhhLCAwLCAxKTtcclxuICAgICAgcmV0dXJuIFtoLCBzLCBsLCBhXTtcclxuICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRId2Ioc3RyaW5nKSB7XHJcbiAgIGlmICghc3RyaW5nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgfVxyXG4gICB2YXIgaHdiID0gL15od2JcXChcXHMqKFsrLV0/XFxkKykoPzpkZWcpP1xccyosXFxzKihbKy1dP1tcXGRcXC5dKyklXFxzKixcXHMqKFsrLV0/W1xcZFxcLl0rKSVcXHMqKD86LFxccyooWystXT9bXFxkXFwuXSspXFxzKik/XFwpLztcclxuICAgdmFyIG1hdGNoID0gc3RyaW5nLm1hdGNoKGh3Yik7XHJcbiAgIGlmIChtYXRjaCkge1xyXG4gICAgdmFyIGFscGhhID0gcGFyc2VGbG9hdChtYXRjaFs0XSk7XHJcbiAgICAgIHZhciBoID0gc2NhbGUocGFyc2VJbnQobWF0Y2hbMV0pLCAwLCAzNjApLFxyXG4gICAgICAgICAgdyA9IHNjYWxlKHBhcnNlRmxvYXQobWF0Y2hbMl0pLCAwLCAxMDApLFxyXG4gICAgICAgICAgYiA9IHNjYWxlKHBhcnNlRmxvYXQobWF0Y2hbM10pLCAwLCAxMDApLFxyXG4gICAgICAgICAgYSA9IHNjYWxlKGlzTmFOKGFscGhhKSA/IDEgOiBhbHBoYSwgMCwgMSk7XHJcbiAgICAgIHJldHVybiBbaCwgdywgYiwgYV07XHJcbiAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmdiKHN0cmluZykge1xyXG4gICB2YXIgcmdiYSA9IGdldFJnYmEoc3RyaW5nKTtcclxuICAgcmV0dXJuIHJnYmEgJiYgcmdiYS5zbGljZSgwLCAzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SHNsKHN0cmluZykge1xyXG4gIHZhciBoc2xhID0gZ2V0SHNsYShzdHJpbmcpO1xyXG4gIHJldHVybiBoc2xhICYmIGhzbGEuc2xpY2UoMCwgMyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFscGhhKHN0cmluZykge1xyXG4gICB2YXIgdmFscyA9IGdldFJnYmEoc3RyaW5nKTtcclxuICAgaWYgKHZhbHMpIHtcclxuICAgICAgcmV0dXJuIHZhbHNbM107XHJcbiAgIH1cclxuICAgZWxzZSBpZiAodmFscyA9IGdldEhzbGEoc3RyaW5nKSkge1xyXG4gICAgICByZXR1cm4gdmFsc1szXTtcclxuICAgfVxyXG4gICBlbHNlIGlmICh2YWxzID0gZ2V0SHdiKHN0cmluZykpIHtcclxuICAgICAgcmV0dXJuIHZhbHNbM107XHJcbiAgIH1cclxufVxyXG5cclxuLy8gZ2VuZXJhdG9yc1xyXG5mdW5jdGlvbiBoZXhTdHJpbmcocmdiKSB7XHJcbiAgIHJldHVybiBcIiNcIiArIGhleERvdWJsZShyZ2JbMF0pICsgaGV4RG91YmxlKHJnYlsxXSlcclxuICAgICAgICAgICAgICArIGhleERvdWJsZShyZ2JbMl0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZ2JTdHJpbmcocmdiYSwgYWxwaGEpIHtcclxuICAgaWYgKGFscGhhIDwgMSB8fCAocmdiYVszXSAmJiByZ2JhWzNdIDwgMSkpIHtcclxuICAgICAgcmV0dXJuIHJnYmFTdHJpbmcocmdiYSwgYWxwaGEpO1xyXG4gICB9XHJcbiAgIHJldHVybiBcInJnYihcIiArIHJnYmFbMF0gKyBcIiwgXCIgKyByZ2JhWzFdICsgXCIsIFwiICsgcmdiYVsyXSArIFwiKVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZ2JhU3RyaW5nKHJnYmEsIGFscGhhKSB7XHJcbiAgIGlmIChhbHBoYSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGFscGhhID0gKHJnYmFbM10gIT09IHVuZGVmaW5lZCA/IHJnYmFbM10gOiAxKTtcclxuICAgfVxyXG4gICByZXR1cm4gXCJyZ2JhKFwiICsgcmdiYVswXSArIFwiLCBcIiArIHJnYmFbMV0gKyBcIiwgXCIgKyByZ2JhWzJdXHJcbiAgICAgICAgICAgKyBcIiwgXCIgKyBhbHBoYSArIFwiKVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwZXJjZW50U3RyaW5nKHJnYmEsIGFscGhhKSB7XHJcbiAgIGlmIChhbHBoYSA8IDEgfHwgKHJnYmFbM10gJiYgcmdiYVszXSA8IDEpKSB7XHJcbiAgICAgIHJldHVybiBwZXJjZW50YVN0cmluZyhyZ2JhLCBhbHBoYSk7XHJcbiAgIH1cclxuICAgdmFyIHIgPSBNYXRoLnJvdW5kKHJnYmFbMF0vMjU1ICogMTAwKSxcclxuICAgICAgIGcgPSBNYXRoLnJvdW5kKHJnYmFbMV0vMjU1ICogMTAwKSxcclxuICAgICAgIGIgPSBNYXRoLnJvdW5kKHJnYmFbMl0vMjU1ICogMTAwKTtcclxuXHJcbiAgIHJldHVybiBcInJnYihcIiArIHIgKyBcIiUsIFwiICsgZyArIFwiJSwgXCIgKyBiICsgXCIlKVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwZXJjZW50YVN0cmluZyhyZ2JhLCBhbHBoYSkge1xyXG4gICB2YXIgciA9IE1hdGgucm91bmQocmdiYVswXS8yNTUgKiAxMDApLFxyXG4gICAgICAgZyA9IE1hdGgucm91bmQocmdiYVsxXS8yNTUgKiAxMDApLFxyXG4gICAgICAgYiA9IE1hdGgucm91bmQocmdiYVsyXS8yNTUgKiAxMDApO1xyXG4gICByZXR1cm4gXCJyZ2JhKFwiICsgciArIFwiJSwgXCIgKyBnICsgXCIlLCBcIiArIGIgKyBcIiUsIFwiICsgKGFscGhhIHx8IHJnYmFbM10gfHwgMSkgKyBcIilcIjtcclxufVxyXG5cclxuZnVuY3Rpb24gaHNsU3RyaW5nKGhzbGEsIGFscGhhKSB7XHJcbiAgIGlmIChhbHBoYSA8IDEgfHwgKGhzbGFbM10gJiYgaHNsYVszXSA8IDEpKSB7XHJcbiAgICAgIHJldHVybiBoc2xhU3RyaW5nKGhzbGEsIGFscGhhKTtcclxuICAgfVxyXG4gICByZXR1cm4gXCJoc2woXCIgKyBoc2xhWzBdICsgXCIsIFwiICsgaHNsYVsxXSArIFwiJSwgXCIgKyBoc2xhWzJdICsgXCIlKVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoc2xhU3RyaW5nKGhzbGEsIGFscGhhKSB7XHJcbiAgIGlmIChhbHBoYSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGFscGhhID0gKGhzbGFbM10gIT09IHVuZGVmaW5lZCA/IGhzbGFbM10gOiAxKTtcclxuICAgfVxyXG4gICByZXR1cm4gXCJoc2xhKFwiICsgaHNsYVswXSArIFwiLCBcIiArIGhzbGFbMV0gKyBcIiUsIFwiICsgaHNsYVsyXSArIFwiJSwgXCJcclxuICAgICAgICAgICArIGFscGhhICsgXCIpXCI7XHJcbn1cclxuXHJcbi8vIGh3YiBpcyBhIGJpdCBkaWZmZXJlbnQgdGhhbiByZ2IoYSkgJiBoc2woYSkgc2luY2UgdGhlcmUgaXMgbm8gYWxwaGEgc3BlY2lmaWMgc3ludGF4XHJcbi8vIChod2IgaGF2ZSBhbHBoYSBvcHRpb25hbCAmIDEgaXMgZGVmYXVsdCB2YWx1ZSlcclxuZnVuY3Rpb24gaHdiU3RyaW5nKGh3YiwgYWxwaGEpIHtcclxuICAgaWYgKGFscGhhID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgYWxwaGEgPSAoaHdiWzNdICE9PSB1bmRlZmluZWQgPyBod2JbM10gOiAxKTtcclxuICAgfVxyXG4gICByZXR1cm4gXCJod2IoXCIgKyBod2JbMF0gKyBcIiwgXCIgKyBod2JbMV0gKyBcIiUsIFwiICsgaHdiWzJdICsgXCIlXCJcclxuICAgICAgICAgICArIChhbHBoYSAhPT0gdW5kZWZpbmVkICYmIGFscGhhICE9PSAxID8gXCIsIFwiICsgYWxwaGEgOiBcIlwiKSArIFwiKVwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBrZXl3b3JkKHJnYikge1xyXG4gIHJldHVybiByZXZlcnNlTmFtZXNbcmdiLnNsaWNlKDAsIDMpXTtcclxufVxyXG5cclxuLy8gaGVscGVyc1xyXG5mdW5jdGlvbiBzY2FsZShudW0sIG1pbiwgbWF4KSB7XHJcbiAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChtaW4sIG51bSksIG1heCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhleERvdWJsZShudW0pIHtcclxuICB2YXIgc3RyID0gbnVtLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xyXG4gIHJldHVybiAoc3RyLmxlbmd0aCA8IDIpID8gXCIwXCIgKyBzdHIgOiBzdHI7XHJcbn1cclxuXHJcblxyXG4vL2NyZWF0ZSBhIGxpc3Qgb2YgcmV2ZXJzZSBjb2xvciBuYW1lc1xyXG52YXIgcmV2ZXJzZU5hbWVzID0ge307XHJcbmZvciAodmFyIG5hbWUgaW4gY29sb3JOYW1lcykge1xyXG4gICByZXZlcnNlTmFtZXNbY29sb3JOYW1lc1tuYW1lXV0gPSBuYW1lO1xyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzPXtcclxuXHRcImFsaWNlYmx1ZVwiOiBbMjQwLCAyNDgsIDI1NV0sXHJcblx0XCJhbnRpcXVld2hpdGVcIjogWzI1MCwgMjM1LCAyMTVdLFxyXG5cdFwiYXF1YVwiOiBbMCwgMjU1LCAyNTVdLFxyXG5cdFwiYXF1YW1hcmluZVwiOiBbMTI3LCAyNTUsIDIxMl0sXHJcblx0XCJhenVyZVwiOiBbMjQwLCAyNTUsIDI1NV0sXHJcblx0XCJiZWlnZVwiOiBbMjQ1LCAyNDUsIDIyMF0sXHJcblx0XCJiaXNxdWVcIjogWzI1NSwgMjI4LCAxOTZdLFxyXG5cdFwiYmxhY2tcIjogWzAsIDAsIDBdLFxyXG5cdFwiYmxhbmNoZWRhbG1vbmRcIjogWzI1NSwgMjM1LCAyMDVdLFxyXG5cdFwiYmx1ZVwiOiBbMCwgMCwgMjU1XSxcclxuXHRcImJsdWV2aW9sZXRcIjogWzEzOCwgNDMsIDIyNl0sXHJcblx0XCJicm93blwiOiBbMTY1LCA0MiwgNDJdLFxyXG5cdFwiYnVybHl3b29kXCI6IFsyMjIsIDE4NCwgMTM1XSxcclxuXHRcImNhZGV0Ymx1ZVwiOiBbOTUsIDE1OCwgMTYwXSxcclxuXHRcImNoYXJ0cmV1c2VcIjogWzEyNywgMjU1LCAwXSxcclxuXHRcImNob2NvbGF0ZVwiOiBbMjEwLCAxMDUsIDMwXSxcclxuXHRcImNvcmFsXCI6IFsyNTUsIDEyNywgODBdLFxyXG5cdFwiY29ybmZsb3dlcmJsdWVcIjogWzEwMCwgMTQ5LCAyMzddLFxyXG5cdFwiY29ybnNpbGtcIjogWzI1NSwgMjQ4LCAyMjBdLFxyXG5cdFwiY3JpbXNvblwiOiBbMjIwLCAyMCwgNjBdLFxyXG5cdFwiY3lhblwiOiBbMCwgMjU1LCAyNTVdLFxyXG5cdFwiZGFya2JsdWVcIjogWzAsIDAsIDEzOV0sXHJcblx0XCJkYXJrY3lhblwiOiBbMCwgMTM5LCAxMzldLFxyXG5cdFwiZGFya2dvbGRlbnJvZFwiOiBbMTg0LCAxMzQsIDExXSxcclxuXHRcImRhcmtncmF5XCI6IFsxNjksIDE2OSwgMTY5XSxcclxuXHRcImRhcmtncmVlblwiOiBbMCwgMTAwLCAwXSxcclxuXHRcImRhcmtncmV5XCI6IFsxNjksIDE2OSwgMTY5XSxcclxuXHRcImRhcmtraGFraVwiOiBbMTg5LCAxODMsIDEwN10sXHJcblx0XCJkYXJrbWFnZW50YVwiOiBbMTM5LCAwLCAxMzldLFxyXG5cdFwiZGFya29saXZlZ3JlZW5cIjogWzg1LCAxMDcsIDQ3XSxcclxuXHRcImRhcmtvcmFuZ2VcIjogWzI1NSwgMTQwLCAwXSxcclxuXHRcImRhcmtvcmNoaWRcIjogWzE1MywgNTAsIDIwNF0sXHJcblx0XCJkYXJrcmVkXCI6IFsxMzksIDAsIDBdLFxyXG5cdFwiZGFya3NhbG1vblwiOiBbMjMzLCAxNTAsIDEyMl0sXHJcblx0XCJkYXJrc2VhZ3JlZW5cIjogWzE0MywgMTg4LCAxNDNdLFxyXG5cdFwiZGFya3NsYXRlYmx1ZVwiOiBbNzIsIDYxLCAxMzldLFxyXG5cdFwiZGFya3NsYXRlZ3JheVwiOiBbNDcsIDc5LCA3OV0sXHJcblx0XCJkYXJrc2xhdGVncmV5XCI6IFs0NywgNzksIDc5XSxcclxuXHRcImRhcmt0dXJxdW9pc2VcIjogWzAsIDIwNiwgMjA5XSxcclxuXHRcImRhcmt2aW9sZXRcIjogWzE0OCwgMCwgMjExXSxcclxuXHRcImRlZXBwaW5rXCI6IFsyNTUsIDIwLCAxNDddLFxyXG5cdFwiZGVlcHNreWJsdWVcIjogWzAsIDE5MSwgMjU1XSxcclxuXHRcImRpbWdyYXlcIjogWzEwNSwgMTA1LCAxMDVdLFxyXG5cdFwiZGltZ3JleVwiOiBbMTA1LCAxMDUsIDEwNV0sXHJcblx0XCJkb2RnZXJibHVlXCI6IFszMCwgMTQ0LCAyNTVdLFxyXG5cdFwiZmlyZWJyaWNrXCI6IFsxNzgsIDM0LCAzNF0sXHJcblx0XCJmbG9yYWx3aGl0ZVwiOiBbMjU1LCAyNTAsIDI0MF0sXHJcblx0XCJmb3Jlc3RncmVlblwiOiBbMzQsIDEzOSwgMzRdLFxyXG5cdFwiZnVjaHNpYVwiOiBbMjU1LCAwLCAyNTVdLFxyXG5cdFwiZ2FpbnNib3JvXCI6IFsyMjAsIDIyMCwgMjIwXSxcclxuXHRcImdob3N0d2hpdGVcIjogWzI0OCwgMjQ4LCAyNTVdLFxyXG5cdFwiZ29sZFwiOiBbMjU1LCAyMTUsIDBdLFxyXG5cdFwiZ29sZGVucm9kXCI6IFsyMTgsIDE2NSwgMzJdLFxyXG5cdFwiZ3JheVwiOiBbMTI4LCAxMjgsIDEyOF0sXHJcblx0XCJncmVlblwiOiBbMCwgMTI4LCAwXSxcclxuXHRcImdyZWVueWVsbG93XCI6IFsxNzMsIDI1NSwgNDddLFxyXG5cdFwiZ3JleVwiOiBbMTI4LCAxMjgsIDEyOF0sXHJcblx0XCJob25leWRld1wiOiBbMjQwLCAyNTUsIDI0MF0sXHJcblx0XCJob3RwaW5rXCI6IFsyNTUsIDEwNSwgMTgwXSxcclxuXHRcImluZGlhbnJlZFwiOiBbMjA1LCA5MiwgOTJdLFxyXG5cdFwiaW5kaWdvXCI6IFs3NSwgMCwgMTMwXSxcclxuXHRcIml2b3J5XCI6IFsyNTUsIDI1NSwgMjQwXSxcclxuXHRcImtoYWtpXCI6IFsyNDAsIDIzMCwgMTQwXSxcclxuXHRcImxhdmVuZGVyXCI6IFsyMzAsIDIzMCwgMjUwXSxcclxuXHRcImxhdmVuZGVyYmx1c2hcIjogWzI1NSwgMjQwLCAyNDVdLFxyXG5cdFwibGF3bmdyZWVuXCI6IFsxMjQsIDI1MiwgMF0sXHJcblx0XCJsZW1vbmNoaWZmb25cIjogWzI1NSwgMjUwLCAyMDVdLFxyXG5cdFwibGlnaHRibHVlXCI6IFsxNzMsIDIxNiwgMjMwXSxcclxuXHRcImxpZ2h0Y29yYWxcIjogWzI0MCwgMTI4LCAxMjhdLFxyXG5cdFwibGlnaHRjeWFuXCI6IFsyMjQsIDI1NSwgMjU1XSxcclxuXHRcImxpZ2h0Z29sZGVucm9keWVsbG93XCI6IFsyNTAsIDI1MCwgMjEwXSxcclxuXHRcImxpZ2h0Z3JheVwiOiBbMjExLCAyMTEsIDIxMV0sXHJcblx0XCJsaWdodGdyZWVuXCI6IFsxNDQsIDIzOCwgMTQ0XSxcclxuXHRcImxpZ2h0Z3JleVwiOiBbMjExLCAyMTEsIDIxMV0sXHJcblx0XCJsaWdodHBpbmtcIjogWzI1NSwgMTgyLCAxOTNdLFxyXG5cdFwibGlnaHRzYWxtb25cIjogWzI1NSwgMTYwLCAxMjJdLFxyXG5cdFwibGlnaHRzZWFncmVlblwiOiBbMzIsIDE3OCwgMTcwXSxcclxuXHRcImxpZ2h0c2t5Ymx1ZVwiOiBbMTM1LCAyMDYsIDI1MF0sXHJcblx0XCJsaWdodHNsYXRlZ3JheVwiOiBbMTE5LCAxMzYsIDE1M10sXHJcblx0XCJsaWdodHNsYXRlZ3JleVwiOiBbMTE5LCAxMzYsIDE1M10sXHJcblx0XCJsaWdodHN0ZWVsYmx1ZVwiOiBbMTc2LCAxOTYsIDIyMl0sXHJcblx0XCJsaWdodHllbGxvd1wiOiBbMjU1LCAyNTUsIDIyNF0sXHJcblx0XCJsaW1lXCI6IFswLCAyNTUsIDBdLFxyXG5cdFwibGltZWdyZWVuXCI6IFs1MCwgMjA1LCA1MF0sXHJcblx0XCJsaW5lblwiOiBbMjUwLCAyNDAsIDIzMF0sXHJcblx0XCJtYWdlbnRhXCI6IFsyNTUsIDAsIDI1NV0sXHJcblx0XCJtYXJvb25cIjogWzEyOCwgMCwgMF0sXHJcblx0XCJtZWRpdW1hcXVhbWFyaW5lXCI6IFsxMDIsIDIwNSwgMTcwXSxcclxuXHRcIm1lZGl1bWJsdWVcIjogWzAsIDAsIDIwNV0sXHJcblx0XCJtZWRpdW1vcmNoaWRcIjogWzE4NiwgODUsIDIxMV0sXHJcblx0XCJtZWRpdW1wdXJwbGVcIjogWzE0NywgMTEyLCAyMTldLFxyXG5cdFwibWVkaXVtc2VhZ3JlZW5cIjogWzYwLCAxNzksIDExM10sXHJcblx0XCJtZWRpdW1zbGF0ZWJsdWVcIjogWzEyMywgMTA0LCAyMzhdLFxyXG5cdFwibWVkaXVtc3ByaW5nZ3JlZW5cIjogWzAsIDI1MCwgMTU0XSxcclxuXHRcIm1lZGl1bXR1cnF1b2lzZVwiOiBbNzIsIDIwOSwgMjA0XSxcclxuXHRcIm1lZGl1bXZpb2xldHJlZFwiOiBbMTk5LCAyMSwgMTMzXSxcclxuXHRcIm1pZG5pZ2h0Ymx1ZVwiOiBbMjUsIDI1LCAxMTJdLFxyXG5cdFwibWludGNyZWFtXCI6IFsyNDUsIDI1NSwgMjUwXSxcclxuXHRcIm1pc3R5cm9zZVwiOiBbMjU1LCAyMjgsIDIyNV0sXHJcblx0XCJtb2NjYXNpblwiOiBbMjU1LCAyMjgsIDE4MV0sXHJcblx0XCJuYXZham93aGl0ZVwiOiBbMjU1LCAyMjIsIDE3M10sXHJcblx0XCJuYXZ5XCI6IFswLCAwLCAxMjhdLFxyXG5cdFwib2xkbGFjZVwiOiBbMjUzLCAyNDUsIDIzMF0sXHJcblx0XCJvbGl2ZVwiOiBbMTI4LCAxMjgsIDBdLFxyXG5cdFwib2xpdmVkcmFiXCI6IFsxMDcsIDE0MiwgMzVdLFxyXG5cdFwib3JhbmdlXCI6IFsyNTUsIDE2NSwgMF0sXHJcblx0XCJvcmFuZ2VyZWRcIjogWzI1NSwgNjksIDBdLFxyXG5cdFwib3JjaGlkXCI6IFsyMTgsIDExMiwgMjE0XSxcclxuXHRcInBhbGVnb2xkZW5yb2RcIjogWzIzOCwgMjMyLCAxNzBdLFxyXG5cdFwicGFsZWdyZWVuXCI6IFsxNTIsIDI1MSwgMTUyXSxcclxuXHRcInBhbGV0dXJxdW9pc2VcIjogWzE3NSwgMjM4LCAyMzhdLFxyXG5cdFwicGFsZXZpb2xldHJlZFwiOiBbMjE5LCAxMTIsIDE0N10sXHJcblx0XCJwYXBheWF3aGlwXCI6IFsyNTUsIDIzOSwgMjEzXSxcclxuXHRcInBlYWNocHVmZlwiOiBbMjU1LCAyMTgsIDE4NV0sXHJcblx0XCJwZXJ1XCI6IFsyMDUsIDEzMywgNjNdLFxyXG5cdFwicGlua1wiOiBbMjU1LCAxOTIsIDIwM10sXHJcblx0XCJwbHVtXCI6IFsyMjEsIDE2MCwgMjIxXSxcclxuXHRcInBvd2RlcmJsdWVcIjogWzE3NiwgMjI0LCAyMzBdLFxyXG5cdFwicHVycGxlXCI6IFsxMjgsIDAsIDEyOF0sXHJcblx0XCJyZWJlY2NhcHVycGxlXCI6IFsxMDIsIDUxLCAxNTNdLFxyXG5cdFwicmVkXCI6IFsyNTUsIDAsIDBdLFxyXG5cdFwicm9zeWJyb3duXCI6IFsxODgsIDE0MywgMTQzXSxcclxuXHRcInJveWFsYmx1ZVwiOiBbNjUsIDEwNSwgMjI1XSxcclxuXHRcInNhZGRsZWJyb3duXCI6IFsxMzksIDY5LCAxOV0sXHJcblx0XCJzYWxtb25cIjogWzI1MCwgMTI4LCAxMTRdLFxyXG5cdFwic2FuZHlicm93blwiOiBbMjQ0LCAxNjQsIDk2XSxcclxuXHRcInNlYWdyZWVuXCI6IFs0NiwgMTM5LCA4N10sXHJcblx0XCJzZWFzaGVsbFwiOiBbMjU1LCAyNDUsIDIzOF0sXHJcblx0XCJzaWVubmFcIjogWzE2MCwgODIsIDQ1XSxcclxuXHRcInNpbHZlclwiOiBbMTkyLCAxOTIsIDE5Ml0sXHJcblx0XCJza3libHVlXCI6IFsxMzUsIDIwNiwgMjM1XSxcclxuXHRcInNsYXRlYmx1ZVwiOiBbMTA2LCA5MCwgMjA1XSxcclxuXHRcInNsYXRlZ3JheVwiOiBbMTEyLCAxMjgsIDE0NF0sXHJcblx0XCJzbGF0ZWdyZXlcIjogWzExMiwgMTI4LCAxNDRdLFxyXG5cdFwic25vd1wiOiBbMjU1LCAyNTAsIDI1MF0sXHJcblx0XCJzcHJpbmdncmVlblwiOiBbMCwgMjU1LCAxMjddLFxyXG5cdFwic3RlZWxibHVlXCI6IFs3MCwgMTMwLCAxODBdLFxyXG5cdFwidGFuXCI6IFsyMTAsIDE4MCwgMTQwXSxcclxuXHRcInRlYWxcIjogWzAsIDEyOCwgMTI4XSxcclxuXHRcInRoaXN0bGVcIjogWzIxNiwgMTkxLCAyMTZdLFxyXG5cdFwidG9tYXRvXCI6IFsyNTUsIDk5LCA3MV0sXHJcblx0XCJ0dXJxdW9pc2VcIjogWzY0LCAyMjQsIDIwOF0sXHJcblx0XCJ2aW9sZXRcIjogWzIzOCwgMTMwLCAyMzhdLFxyXG5cdFwid2hlYXRcIjogWzI0NSwgMjIyLCAxNzldLFxyXG5cdFwid2hpdGVcIjogWzI1NSwgMjU1LCAyNTVdLFxyXG5cdFwid2hpdGVzbW9rZVwiOiBbMjQ1LCAyNDUsIDI0NV0sXHJcblx0XCJ5ZWxsb3dcIjogWzI1NSwgMjU1LCAwXSxcclxuXHRcInllbGxvd2dyZWVuXCI6IFsxNTQsIDIwNSwgNTBdXHJcbn0iXX0=
