import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import MainNav from '@/components/MainNav';
import StoreSwitcher from '@/components/StoreSwitcher';
import { redirect } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import db from '@/db/drizzle';
import { stores } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function Navbar() {
    const { userId } = auth();

    if (!userId) redirect("/sign-in");

    const userStores = await db.select().from(stores).where(eq(stores.userId, userId));

    return (
        <div className='border-b'>
            <div className='flex items-center h-16 px-4'>
                <StoreSwitcher items={userStores} />
                <MainNav className='mx-6' />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeToggle />
                    <UserButton />
                </div>
            </div>
        </div>
    );
}