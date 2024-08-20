import './App.css';
import { useState, useRef, useEffect } from "react";
import { getRGB, getLuminance, getContrast } from "./functions/functions.js";

const checkHex = (hex) => {
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

function App() {
    const textFirstColor = useRef(null);
    const selectFirstColor = useRef(null);
    const textSecondColor = useRef(null);
    const selectSecondColor = useRef(null);
    const result = useRef(null);

    const [color1, setColor1] = useState('#000000');
    const [color2, setColor2] = useState('#FFFFFF');
    const [textColor, setTextColor] = useState(false);

    useEffect(()=>{
        textFirstColor.current.value = '#000000';
        textSecondColor.current.value = '#FFFFFF';
    }, []);

    useEffect(() => {
        if (textColor) {
            textFirstColor.current.value = color1;
            textSecondColor.current.value = color2;
        }
        selectFirstColor.current.value = color1;
        selectSecondColor.current.value = color2;

        const contrastValue = getContrast(getLuminance(getRGB(color1)), getLuminance(getRGB(color2)));
        result.current.textContent = contrastValue % 1 !== 0 ? contrastValue.toFixed(2) : contrastValue;
    }, [color1, color2, textColor]);

    const handleText = () => {
        setColor1(selectFirstColor.current.value.toUpperCase());
        setColor2(selectSecondColor.current.value.toUpperCase());
        setTextColor(true);
    }
    const handleSelect = () => {
        setColor1(checkHex(textFirstColor.current.value));
        setColor2(checkHex(textSecondColor.current.value));
        setTextColor(false);
    }
    const handleInputText = ()=>{
        setTextColor(true);
    }

    return (
        <>
            <header id='balance-header'>
                <h1 id='balance-title'>Color-balance</h1>
            </header>

            <main id='balance-main'>
                <section className='balance-section'>
                    <div className='balance-color'>
                        <input onBlur={handleInputText} onInput={handleSelect} ref={textFirstColor} type="text" name="txt-first-color" id="txt-first-color" />
                        <input onInput={handleText} ref={selectFirstColor} type="color" name='select-first-color' id="select-first-color" />
                    </div>

                    <div className='balance-color'>
                        <input onBlur={handleInputText} onInput={handleSelect} ref={textSecondColor} type="text" name="txt-second-color" id="txt-second-color" />
                        <input onInput={handleText} ref={selectSecondColor} type="color" name='select-second-color' id="select-second-color" />
                    </div>

                    <div id="balance-result">
                        <h2 id="contrast-color">Constrast Color</h2>
                        <p ref={result} id='value'></p>
                    </div>
                </section>
            </main>

            <footer>
                <p>GNcode</p>
            </footer>
        </>
    )
}

export default App
