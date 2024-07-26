"use client"

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import toast from "react-hot-toast";

import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import axios from "axios";
import {Loader2} from "lucide-react";
import {useEffect, useState} from "react";
import CopyButton from "@/components/CopyButton";

const formSchema = z.object({
    file: z.instanceof(File).optional(),
});

const FormUploadFile = () => {
    const [baseUrl, setBaseUrl] = useState<string>('');

    useEffect(() => {
        const currentUrl = window.location.origin;
        setBaseUrl(currentUrl);
    }, []);
    const [linkFile, setLinkFile] = useState<string>("")
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            file: undefined,
        },
    });

    const {handleSubmit, control, setValue, watch, formState: {isValid, isSubmitting}} = form;

    // 2. Define a submit handler.
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            formData.append("file", values.file as File);

            const response = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data.fileLink)
            setLinkFile(response.data.fileLink)
            toast.success("File uploaded successfully");
        } catch (err) {
            console.log("Error uploading file", err);
            toast.error("Error uploading file!");
        }
    };

    return (
        <div className={"w-[300px]"}>
            <CopyButton textToCopy={`${baseUrl}/api/upload`}/>
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-[300px]">
                    <FormField
                        control={control}
                        name="file"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>File: Image, pdf, txt ...</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.pdf,.txt"
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            setValue("file", file || undefined);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={!isValid || isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin"/>
                        ) : (
                            "Upload"
                        )}
                    </Button>
                </form>
            </Form>
            <div className="pt-4">
                <CopyButton textToCopy={linkFile}/>
            </div>
        </div>
    );
};

export default FormUploadFile;
