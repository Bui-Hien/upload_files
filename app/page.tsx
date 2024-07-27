"use client";

import {useEffect, useState} from "react";
import CopyButton from "@/components/CopyButton";

export default function Home() {
    const [baseUrl, setBaseUrl] = useState<string>('');

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    return (
        <div className="flex flex-row justify-center items-center mt-40">
            <h1 className={"pe-2"}>Server running at:</h1>
            <CopyButton textToCopy={baseUrl + "/api/upload"}/>
        </div>
    );
}
