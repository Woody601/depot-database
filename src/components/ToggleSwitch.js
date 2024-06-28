import { useState } from 'react';
import styles from '@/styles/ToggleSwitch.module.css';

export default function ToggleSwitchWithIcon({ round, onChange, icon}) {
    const [Icon, setIcon] = useState(icon);

    const handleChange = (event) => {
        const isChecked = event.target.checked;
        if (onChange && typeof onChange == 'function') {
            onChange(isChecked);
        }

        if (icon) {
            if (Icon.includes('_off')) {
                setIcon(Icon.replace('_off', '_on'));
            } else if (Icon.includes('_on')) {
                setIcon(Icon.replace('_on', '_off'));
            }
        }
    };
    const sliderClass = round ? `${styles.slider} ${styles.round}` : styles.slider;

    return (
        <label className={icon ? styles.icon : styles.switch}>
            <input type="checkbox" onChange={handleChange} />
            {icon ? (
                <i className="material-icons">{Icon}</i>
            ) : (
                <span className={sliderClass}></span>
            )}
        </label>
    );
}
