"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import Link from "next/link";
import { usePathname } from 'next/navigation'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface StoreSwitcherProps extends PopoverTriggerProps {
    className?: string;
    items: Array<{ id: string, name: string }>;
}

export default function StoreSwitcher({ className, items = [] }: StoreSwitcherProps) {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname()

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const currentStore = formattedItems.find((item) => item.value == params.storeId);

    const [open, setOpen] = useState(false);

    const onStoreSelect = (store: { value: string, label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    };

    return (
        // <Popover onOpenChange={setOpen} open={open}>
        //     <PopoverTrigger asChild>
        //         <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a store" className={cn("w-[220px] justify-between", className)}>
        //             <StoreIcon className="w-4 h-4 mr-2" />
        //             <p className="">{currentStore?.label}</p>
        //             <ChevronsUpDown className="w-4 h-4 ml-auto opacity-50 shrink-0" />
        //         </Button>
        //     </PopoverTrigger>
        //     <PopoverContent className="w-[220px] p-0">
        //         <Command>
        //             <CommandList>
        //                 <CommandInput placeholder="Search Store..." />
        //                 <CommandEmpty>No store found.</CommandEmpty>
        //                 <CommandGroup heading="Stores">
        //                     {formattedItems.map((store, index) => (
        //                         <CommandItem key={index} onSelect={() => onStoreSelect(store)} className="text-sm">
        //                             <StoreIcon className="w-4 h-4 mr-2" />
        //                             <p className="">{store.label}</p>
        //                             <Check className={cn("ml-auto h-4 w-4", currentStore?.value == store.value ? "opacity-100" : "opacity-0")} />
        //                         </CommandItem>
        //                     ))}
        //                 </CommandGroup>
        //             </CommandList>
        //             <CommandSeparator />
        //             <CommandList>
        //                 <CommandGroup>
        //                     <CommandItem onSelect={() => { setOpen(false); storeModal.onOpen(); }}>
        //                         <PlusCircle className="w-5 h-5 mr-2" />
        //                         Create Store
        //                     </CommandItem>
        //                 </CommandGroup>
        //             </CommandList>
        //         </Command>
        //     </PopoverContent>
        // </Popover>

        <Link href={pathname.endsWith("settings") ? `/` : `${pathname}/settings`}>
            <Button variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a store" className={cn("w-[220px] justify-between", className)}>
                <StoreIcon className="w-4 h-4 mr-2" />
                <p>{currentStore?.label}</p>
            </Button>
        </Link>
    );
}