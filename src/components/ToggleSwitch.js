import { useState, useEffect } from 'react';
import styles from '@/styles/ToggleSwitch.module.css';

export default function ToggleSwitchWithIcon({ round, onChange, icon, fa4 }) {
    const [Icon, setIcon] = useState(icon);
    const [IconText, setIconText] = useState("");
    useEffect(() => {
        if (!fa4) {
            setIconText(Icon);
        }
    }, [fa4, Icon]);

    const handleChange = (event) => {
        const isChecked = event.target.checked;
        if (onChange && typeof onChange == 'function') {
            onChange(isChecked);
        }
        if (icon) {
            if (fa4) {
                if (Icon.includes('square-o')) {
                    setIcon(Icon.replace('square-o', 'circle-thin'));
                }
                else if (Icon.includes('circle-thin')) {
                    setIcon(Icon.replace('circle-thin', 'square-o'));
                }
            }
            else {
                if (IconText.includes('_off')) {
                    setIconText(IconText.replace('_off', '_on'));
                    
                } else if (IconText.includes('_on')) {
                    setIconText(IconText.replace('_on', '_off'));
                }
            }
        }        
    };
    const sliderClass = round ? `${styles.slider} ${styles.round}` : styles.slider;

    return (
        <label className={icon ? styles.icon : styles.switch}>
            <input type="checkbox" onChange={handleChange} />
            {icon ? (
                <i className={fa4 ? "fa fa-" + Icon : "material-symbols-outlined"}>{IconText}</i>
            ) : (
                <span className={sliderClass}></span>
            )}
        </label>
    );
}
