import { randomQuotes } from "../constants/constants";

export function adjustLuminance(r, g, b, luminanceAdjustment) {
    // Convertir RGB a HSL
    let [h, s, l] = rgbToHsl(r, g, b);

    // Ajustar la luminancia (L)
    l = Math.max(0, Math.min(1, l + luminanceAdjustment));

    // Convertir de nuevo a RGB
    return hslToRgb(h, s, l);
}

export function rgbToHex(r, g, b) {
    // Convierte cada valor a hexadecimal y rellena con ceros si es necesario
    const toHex = (component) => {
        const hex = component.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    // Une los valores hexadecimales
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hslToRgb(h, s, l) {
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return [r, g, b];
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let s = 0, h = 0;
    if (max === min) {
        s = 0;
        h = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
        if (h < 0) h += 360;
    }
    return [h, s, l];
}

export const getRandomQuotes = ()=>{
    const random = Math.floor(Math.random()*randomQuotes.length)
    return randomQuotes[random];
}

export const selectRatioColor = (ratio)=>{
    if (ratio < 3) return 'bad'
    else if (ratio <= 4.5) return 'regular'
    else if (ratio <= 7) return 'good'
    else if (ratio <= 11) return 'great'
    else return 'dorime'
}

export const getRGB = (hex) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
}

export const getLuminance = (rgb) => {
    const [rN, gN, bN] = rgb.map(value => value / 255);

    const [rG, gG, bG] = [rN, gN, bN].map(value =>
        value <= 0.03928 ? value / 12.92
            : Math.pow(((value + 0.055) / 1.055), 2.4)
    );

    const luminance = 0.2126 * rG + 0.7152 * gG + 0.0722 * bG
    return luminance;
}

export const getContrast = (lum1, lum2) => {
    let contrast = null;
    if (lum1 > lum2) contrast = (lum1 + 0.05) / (lum2 + 0.05);
    else contrast = (lum2 + 0.05) / (lum1 + 0.05);
    return contrast;
}

export const checkHex = (hex) => {
    let isHex = hex.trim().toUpperCase();
    if (isHex.startsWith('#')) { isHex = isHex.substring(1, isHex.length) }
    
    if (isHex.length < 3) {
        isHex = isHex.padStart(6, '0');
    } else if (isHex.length < 6) {
        isHex = isHex.split('').map(value=>value+value).slice(0,3).join('');
    } else if (isHex.length > 6) {
        isHex = isHex.substring(0,6);
    }

    const arrHex = isHex.split('').map(value=> /^[0-9A-Fa-f]$/.test(value) ? value : 1)
    isHex = '#'+arrHex.join('')
    return isHex;
}