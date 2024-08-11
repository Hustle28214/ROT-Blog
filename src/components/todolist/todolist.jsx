import React from "react";
import styles from "./todolist.module.css";

export default function TodoList({ children }) {
    const fullContent = React.Children.toArray(children).filter(child => child.type === TodoListFull);
    const leftContent = React.Children.toArray(children).filter(child => child.type !== TodoListRight && child.type !== TodoListFull);
    const rightContent = React.Children.toArray(children).find(child => child.type === TodoListRight);

    return (
        <div className={styles.todolistMain}>
            {fullContent.length > 0 && (
                <div className={styles.todolistFullContainer}>
                    {fullContent}
                </div>
            )}
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

export const TodoListFull = ({children}) => {
    return (
        <div className={styles.todolistItem}>
            {children}
        </div>
    );
}