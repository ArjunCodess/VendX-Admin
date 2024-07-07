'use client'

import { useStoreModal } from '@/hooks/use-store-modal'
import { useAuth, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Page() {
    const { isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isSignedIn) router.push('/sign-up');
    }, [isSignedIn, router]);

    const onOpen = useStoreModal(state => state.onOpen);
    const isOpen = useStoreModal(state => state.isOpen);

    useEffect(() => {
        if (!isOpen) onOpen();
    }, [onOpen, isOpen]);

    return null;
}