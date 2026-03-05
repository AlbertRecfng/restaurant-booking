import Navbar from '../components/layout/Navbar/Navbar'
import ProfileHeader from './components/profile-header'
import UserBookings from './components/user-bookings'
import styles from './profile.module.css'

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className={styles.profileContainer}>
        <div className={styles.profileContent}>
          <ProfileHeader />
          <UserBookings />
        </div>
      </div>
    </>
  )
}