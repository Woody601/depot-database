import styles from "@/styles/Buttons.module.css";

export default function Button({ id, onClick, title, icon, children, type="button" }) {
    const iconClass = icon ? `fa fa-${icon}` : ''; // Concatenate the icon class name
    if (children) {
        return(
            <button id={id} className={styles.button} onClick={onClick} title={title} type={type}>
            {icon && <i className={iconClass}/>}
            {children} {/* Render text content */}
            </button>
        )
    }
    else {
        return(
            <button id={id} className={styles.button + " " + styles.iconButton} onClick={onClick} title={title}>
            {icon && <i className={iconClass}/>}
            </button>
        )
    }
}
