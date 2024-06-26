import styles from "@/styles/Buttons.module.css";

export default function Button({ id, onClick, title, icon, children, disabled, type="button" }) {
    const iconClass = icon ? `fa fa-${icon}` : ''; // Concatenate the icon class name
    if (children) {
        if (type == "submit") {
            return(
                <button id={id} className={styles.button + " " + styles.formbutton} onClick={onClick} title={title} type={type} disabled={disabled} >
            {icon && <i className={iconClass}/>}
            {children} {/* Render text content */}
            </button>
            )
        }
        else {
            return(
            <button id={id} className={styles.button} onClick={onClick} title={title} type={type} disabled={disabled}>
                {icon && <i className={iconClass}/>} 
                {children} {/* Render text content */}
                </button>
                )
        }
    }
    else {
        return(
            <button id={id} className={styles.button + " " + styles.iconButton} onClick={onClick} title={title}>
            {icon && <i className={iconClass} disabled={disabled}/>}
            </button>
        )
    }
}
