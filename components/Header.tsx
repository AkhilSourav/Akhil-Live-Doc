import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const Header = ({children, className}: HeaderProps) => {
  return (
    <div className={cn("header", className)}>
        <Link href='/' className='md:flex-1'>
        <Image 
            src="/assets/icons/akhil_logo.png" 
            alt="Logo with name" 
            width={30} 
            height={32} 
            className='hidden md:block'
        />
        <Image 
            src="/assets/icons/akhil_logo.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className='mr-2 md:hidden'
        />
        </Link>
        {children}
    </div>
  )
}

export default Header