"use client";
import React from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, id }) => {
  return (
    <div className={styles.wrapper}>
      <label className={styles.container} htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e: any) => onChange(e.target.checked)}
          className={styles.input}
        />
        <div className={styles.checkmark} />
      </label>
    </div>
  );
};

export default Checkbox;
