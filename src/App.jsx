import './App.css';
import { useState, useRef, useEffect } from "react";
import { getRGB, getLuminance, getContrast, checkHex } from "./functions/functions.js";
import { ratioColor } from './constants/constants.js';
import { PassOrFail } from './components/passOrfail.jsx';

const selectRatioColor = (ratio)=>{
    if (ratio < 3) return 'bad'
    else if (ratio <= 4.5) return 'regular'
    else if (ratio <= 7) return 'good'
    else if (ratio <= 11) return 'great'
    else return 'dorime'
}

function App() {
    const textFirstColor = useRef(null);
    const selectFirstColor = useRef(null);
    const textSecondColor = useRef(null);
    const selectSecondColor = useRef(null);
    const result = useRef(null);

    const [color1, setColor1] = useState('#FFFFFF');
    const [color2, setColor2] = useState('#023047');
    const [textColor, setTextColor] = useState(false);
    const [constrastRatio, setContrastRatio] = useState(0);

    useEffect(()=>{
        textFirstColor.current.value = '#FFFFFF';
        textSecondColor.current.value = '#023047';
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
        setContrastRatio(contrastValue);

        const calification = selectRatioColor(contrastValue);
        const root = document.documentElement;
        root.style.setProperty('--ratio-color', ratioColor[calification])
        root.style.setProperty('--bg-color', color2)
        root.style.setProperty('--text-color', color1)

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
                <h1 id='balance-title'>Color Balance</h1>
                <p>Calculate the contrast ratio of two colors.</p>
            </header>

            <main id='balance-main'>
                <article className='balance-article' id='article-color'>
                    <section id='balance-section-color'>
                        <fieldset className='balance-color'>
                            <legend>Text color</legend>
                            <input onBlur={handleInputText} onInput={handleSelect} ref={textFirstColor} type="text" name="txt-first-color" id="txt-first-color" />
                            <input onInput={handleText} ref={selectFirstColor} type="color" name='select-first-color' id="select-first-color" />
                        </fieldset>

                        <fieldset className='balance-color'>
                            <legend>Background color</legend>
                            <input onBlur={handleInputText} onInput={handleSelect} ref={textSecondColor} type="text" name="txt-second-color" id="txt-second-color" />
                            <input onInput={handleText} ref={selectSecondColor} type="color" name='select-second-color' id="select-second-color" />
                        </fieldset>

                        <div id="balance-result">
                            <h2 id="contrast-color">Contrast Ratio</h2>
                            <p ref={result} id='value'></p>
                        </div>
                    </section>
                    
                    <section id='balance-section-example'>
                        <h2>Normal Text</h2>
                        <div className='example-text'>
                            <div>
                                <p>WCAG AA: <PassOrFail wcag='AA' contrast={constrastRatio} type={'normal'}/></p>
                                <p>WCAG AAA: <PassOrFail wcag='AAA' contrast={constrastRatio} type={'normal'}/></p>
                            </div>
                            <p>Random Quote</p>
                        </div>
                        <br/>
                        <h2>Large or bold Text</h2>
                        <div className='example-text'>
                            <div>
                                <p>WCAG AA: <PassOrFail wcag='AA' contrast={constrastRatio} type={'large'}/></p>
                                <p>WCAG AAA: <PassOrFail wcag='AAA' contrast={constrastRatio} type={'large'}/></p>
                            </div>
                            <p><b>Random Quote</b></p>
                        </div>
                    </section>
                </article>

                <article className='balance-article' id='article-guide'>
                    <section>
                        <h2>What is Color Balance?</h2>
                        <p>Ensure your color combinations are accessible and easy to read. Our tool evaluates the contrast between two colors and indicates whether they meet accessibility standards. Ideal for designers and web developers looking to improve readability and user experience.</p>
                    </section>

                    <section>
                        <h2>Help / How to use this tool?</h2>
                        <p>The Color Balance interface is a form with two mandatory fields</p>

                        <h3>Text color</h3>
                        <p>This is the color of the text. You can fill in this field with an hexadecimal value. The input value is then previewed on the right of the field.</p>

                        <h4>hexadecimal values</h4>
                        <p>Example: #AABBCC. Please note that #ABC works also, we automatically complete the field with #AABBCC. You can also use this field without the # character, so FFF or FFFFFF works perfectly.</p>

                        <h3>Background color</h3>
                        <p>This field works just like the text color field.</p>
                    </section>

                    <section>
                        <h2>Color contrast ratio</h2>
                        <p>How to choose a ratio? It depends on the following elements:</p>
                        
                        <p>The level AA requieres a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (at least 18pt/24px) or 14pt/19px bold text.</p>

                        <p>The level AAA requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text or bold text.</p>

                        <p>For a full and exhaustive understanding of how to interpret this, one should read <a target='_blank' href='https://www.w3.org/TR/WCAG20/#larger-scaledef'>the defintion of large-scale text from WCAG.</a></p>
                    </section>

                    <section>
                        <h2>The algorithms</h2>
                        <p>The contrast ratio between two colors is used to measure the difference in luminance between a background color and a flat primer color.</p>
                        
                        <h3>Normalize RGB color</h3>
                        <p>The color value divided by 255</p>
                        <p>Let&apos;s take the color #FF0000, which in RGB would be rgb(255,0,0), We divide each value by 255: r=255/255, g=0/255 and b=0/255, we would have r=1, g=0 and b=0.</p>

                        <h3>Convert to relative luminance</h3>
                        <p>For each component C of the normalized color if it is less than or equal to 0.03928 we divide it by 12.92, if not we apply the following formula: ((C + 0.055)/1.055)^2.4.</p>
                        <p>Then the luminance is calculated as: L = 0.2126*R + 0.7152*G + 0.0722*B.
                        </p>

                        <h3>Calculate the contrast ratio</h3>
                        <p>Contrast Ratio = (Lower luminance + 0.05) / (Higher luminance + 0.05)</p>
                        <p>The contrast ratio varies from 1:1 (no contrast, when both colors are the same) to 21:1 (maximum contrast, such as white on black).</p>
                    </section>

                    <section>
                        <h2>Contribute to Color Balance</h2>
                        <p>All contributions are warmly welcome ! Translation, correction, bug report, new feature…
                        Feel free to play with <a target='_blank' href='https://github.com/Manuel-GNcode/color-balance'>source code.</a></p>
                    </section>
                </article>
            </main>

            <footer>
                <address>
                    Made by &lt; <b>GN</b>code /&gt;
                </address>
            </footer>
        </>
    )
}

export default App
