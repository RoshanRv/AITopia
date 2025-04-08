import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function AppHeader() {
return (
    <div className='p-3 shadow-sm flex justify-between items-center'>
        <div className='flex items-center'>
        <Link href={'/dashboard'}>
            <Image src={'/logo.svg'} alt='logo' width={70} height = {100}/>
            <h1 className='pl-2 font-bold'>Voice Agent</h1>
        </Link>
        </div>
       
        <UserButton/>
    </div>
)
}

export default AppHeader
