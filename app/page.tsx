"use client"
import FormUploadFile from "@/components/FormUploadFile";
import CopyButton from "@/components/CopyButton";
import {useEffect, useState} from "react";

export default function Home() {
    const [baseUrl, setBaseUrl] = useState<string>('');

    useEffect(() => {
        const currentUrl = window.location.origin;
        setBaseUrl(currentUrl);
    }, []);
    return (
        <div className="flex flex-col justify-center items-center mt-40">
            <CopyButton textToCopy={`${baseUrl}/api/upload`}/>
            <FormUploadFile/>
        </div>
    );
}
