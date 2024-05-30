import React, {useEffect, useState} from 'react';
import styles from './ToggleSwitch.module.css';

const ToggleSwitch = ({mbti_checks, onSelectAll}) => {
    useEffect(() => {

    }, [mbti_checks, onSelectAll]);

  const handleToggle = () => {
      const toggle_value = !isSelectAllMode()
      console.log('toggle', toggle_value)
      onSelectAll(toggle_value)
  };

  const isSelectAllMode = () => {
      const notSelectedAll = mbti_checks.some((check) => !check.checked)
      return !notSelectedAll;
  }

  return (
    <div className={styles.toggleSwitch} onClick={handleToggle}>
      <div className={`${styles.switch} ${isSelectAllMode() ? styles.switchOn : styles.switchOff}`}>
        <div className={`${styles.toggle} ${isSelectAllMode() ? styles.toggleOn : ''}`}></div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
