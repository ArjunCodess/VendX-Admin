"use client"

import { useState } from 'react'
import * as z from 'zod'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { Heading } from '@/components/ui/heading';

interface ColorFormProps {
    initialData: {
        id: string;
        name: string;
        value: string;
        createdAt: string;
    } | null;
}

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: "Color must start with a '#' followed by exactly 6 hexadecimal characters."
    }),
})

type ColorFormValues = z.infer<typeof formSchema>;

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit color' : 'Create Color';
    const description = initialData ? 'Edit a color' : 'Add a new color';
    const toastMessage = initialData ? 'Color updated.' : 'Color created.';
    const action = initialData ? 'Save changes' : 'Create';

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? { name: initialData.name, value: initialData.value } : undefined,
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);

            if (initialData) await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            else await axios.post(`/api/${params.storeId}/colors`, data)

            router.push(`/${params.storeId}/colors`)
            router.refresh();
            toast.success(toastMessage);
        }

        catch (err) {
            toast.error("Something went wrong.");
        }

        finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)

            router.refresh();
            router.push("/")
            toast.success("Color deleted.")
        }

        catch (err) {
            toast.error("Make sure you removed all products using this color first.");
        }

        finally {
            setLoading(false)
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />

            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {initialData && (
                    <Button variant="destructive" color="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-1 w-full space-y-4 pb-3">
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Color name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <div className='flex items-center gap-x-4'>
                                            <Input disabled={loading} placeholder='Color value' {...field} />
                                            <div className='p-4 border rounded-full' style={{ backgroundColor: field.value }} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} type='submit'>{action}</Button>
                </form>
            </Form>

            <Separator />
        </>
    )
}