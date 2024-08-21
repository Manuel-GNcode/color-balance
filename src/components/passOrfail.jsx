import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export const PassOrFail = ({wcag, contrast, type})=>{
    const [state, setState] = useState('');
    
    useEffect(()=>{
        if (wcag == 'AA') {
            if (type == 'normal') {
                setState(contrast >= 4.5? 'Pass': 'Fail')
            } else {
                setState(contrast >= 3? 'Pass': 'Fail')
            }
        } else {
            if (type == 'normal') {
                setState(contrast >= 7? 'Pass': 'Fail')
            } else {
                setState(contrast >= 4.5? 'Pass': 'Fail')
            }
        }
    }, [contrast, wcag, type]);

    return (
        <span id='pass-fail' style={state == 'Pass'?{background: 'green'}:{background: 'red'}}>
            {state}
        </span>
    )
}

PassOrFail.propTypes = {
    wcag: PropTypes.string,
    type: PropTypes.string,
    contrast: PropTypes.number
}