import React from "react";
import styles from "./todolist.module.css";

export default function TodoList({ children }) {
    const leftContent = React.Children.toArray(children).filter(child => child.type !== TodoListRight);
    const rightContent = React.Children.toArray(children).find(child => child.type === TodoListRight);

    return (
        <div className={styles.todolistMain}>
            <div className={styles.todolistLeftContainer}>
                <div className={styles.todolistItem}>
                    {leftContent}
                </div>
            </div>
            <div className={styles.todolistRightContainer}>
                {rightContent}
            </div>
        </div>
    );
}

export const TodoListRight = ({children}) => {
    return (
        <div className={styles.todolistItem}>
            {children}
        </div>
    );
}