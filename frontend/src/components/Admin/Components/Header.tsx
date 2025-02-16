'use client';
import Link from 'next/link';
import React, { memo } from 'react';
import { Button } from 'react-bootstrap';

import styles from './Header.module.scss';

function Header() {
  const logout = () => {
    let now = new Date();
    let time = now.getTime();
    const secondsUntilEndOfMinute = 0;
    let expireTime = time + 0 * secondsUntilEndOfMinute;
    now.setTime(expireTime);
    document.cookie = `user=;expires=${now.toUTCString()};path=/`;
    document.cookie = `jwt=;expires=${now.toUTCString()};path=/`;
    window.location.href = `/`;
  };

  return (
    <header className={`${styles.header} headerMenu`}>
      <div className={styles.hdrMenu}>
        <div className={styles.hdrRight}>
          <div
            className={`${styles.userProfile} ${styles.deskUserProfile} menuList`}
          >
            <Button
              variant="link"
              style={{ fontSize: '14px', color: '#757575' }}
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(Header);
