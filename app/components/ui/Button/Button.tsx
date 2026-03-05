import Link from 'next/link'
import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode  
  href?: string              
  onClick?: () => void       
  variant?: 'primary' | 'danger'  
  disabled?: boolean
}

export default function Button({ children, href, onClick, variant = 'primary', disabled }: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={`${styles.btn} ${styles[variant]}`}>
        {children}
      </Link>
    )
  }

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${styles.btn} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
    >
      {children}
    </button>
  )
}