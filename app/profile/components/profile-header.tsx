'use client'

import { useAuth } from '../../components/auth-provider'
import styles from './profile-header.module.css'

export default function ProfileHeader() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileInfo}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>
            {user.email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>
            {user.email?.split('@')[0]}
          </h2>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
      </div>
      <button onClick={signOut} className={styles.signOutBtn}>
        Выйти
      </button>
    </div>
  )
}
