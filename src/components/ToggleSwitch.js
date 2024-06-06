import styles from "@/styles/ToggleSwitch.module.css";

export default function ToggleSwitch({ round, onChange }) {
    const handleChange = (event) => {
        if (onChange && typeof onChange === 'function') {
            onChange(event.target.checked);
        }
    };

    const sliderClass = round ? styles.slider + " " + styles.round : styles.slider;

    return (
        <label className={styles.switch}>
            <input type="checkbox" onChange={handleChange}/>
            <span className={sliderClass}></span>
        </label>
    );
}