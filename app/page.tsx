"use client"

import {useEffect, useState} from "react";

export default function Home() {
    const [baseUrl, setBaseUrl] = useState<string>('');

    useEffect(() => {
        const currentUrl = window.location.origin;
        setBaseUrl(currentUrl);
    }, []);
    return (
        <div className="flex flex-col justify-center items-center mt-40">
            <h1>Server running at: {baseUrl + "/api/upload"}
            </h1>
        </div>
    );
}
