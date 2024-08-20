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