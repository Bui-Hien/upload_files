"use client"
import FormUploadFile from "@/components/FormUploadFile";
import {useEffect, useState} from "react";
import CopyButton from "@/components/CopyButton";

export default function Home() {
    const [baseUrl, setBaseUrl] = useState<string>('');

    useEffect(() => {
        const currentUrl = window.location.origin;
        setBaseUrl(currentUrl);
    }, []);
    return (
        <div className="flex flex-col justify-center items-center mt-40">
            <h1>Server running at: <CopyButton textToCopy={baseUrl + "/api/upload"}/>
            </h1>
            {/*<FormUploadFile/>*/}
        </div>
    );
}
