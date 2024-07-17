"use client"

import { useState } from 'react';
import * as z from 'zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategoryFormProps {
    initialData: {
        name: string;
        billboardId: string;
    } | null;
    billboards: {
        id: string;
        storeId: string;
        createdAt: Date | null;
        label: string;
        imageUrl: string;
    }[];
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, billboards }) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? 'Edit category' : 'Create Category';
    const description = initialData ? 'Edit a category' : 'Add a new category';
    const toastMessage = initialData ? 'Category updated.' : 'Category created.';
    const action = initialData ? 'Save changes' : 'Create';

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || { name: '', billboardId: '' },
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);

            if (initialData) await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            else await axios.post(`/api/${params.storeId}/categories`, data)

            router.push(`/${params.storeId}/categories`)
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

            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)

            router.push("/")
            router.refresh();
            toast.success("Category deleted.")
        }

        catch (err) {
            toast.error("Make sure you removed all products using this category first.");
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
                    <Button variant="destructive" size="sm" onClick={() => setOpen(true)} disabled={loading}>
                        <Trash className="w-4 h-4" />
                    </Button>
                )}
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-1 w-full space-y-4 pb-3">
                    <div className='grid grid-cols-3 gap-5'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Category Name' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <FormControl>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder='Select a billboard'
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {billboards.map(billboard => (
                                                    <SelectItem key={billboard.id} value={billboard.id}>
                                                        {billboard.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
    );
};