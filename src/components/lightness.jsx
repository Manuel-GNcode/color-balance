import PropTypes from 'prop-types';
import { useEffect, useRef} from 'react';
import { adjustLuminance, rgbToHex, getRGB } from '../functions/functions';

export const Lightness = ({color, setColor, setText})=>{

    const inputRange = useRef(null);
    useEffect(()=>{
        inputRange.current.value = 0;
    }, [])

    const cssLabel = {
        padding: '8px',
        background: `linear-gradient(90deg, #000, ${color}, #fff)`,
        borderRadius: '16px',
        display: 'block',
        width: '100%',
        height: 'fit-content',
        border: '1px solid #1F316F',
        marginTop: '8px'
    }
    const cssInput = {
        width: '100%',
        height: '12px',
        background: '#fff',
        borderRadius: '5px',
        outline: 'none',
    }

    const handleLum = ()=>{
        const newLum = Number(inputRange.current.value);

        const colorRgb = getRGB(color);
        const newColor = adjustLuminance(...colorRgb, newLum);
        setColor(rgbToHex(...newColor));
        setText(true);
    }

    return (
        <label style={cssLabel} className="balance-label">
            <input onInput={handleLum} ref={inputRange} style={cssInput} className="balance-range" type="range" min='-0.5' max='0.5' step='0.05'/>
        </label>
    )
}

Lightness.propTypes = {
    color: PropTypes.string,
    setColor: PropTypes.func,
    setText: PropTypes.func,
}