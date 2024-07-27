"use client"

import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const CopyButton = ({textToCopy}: { textToCopy: string }) => {
    const [copyStatus, setCopyStatus] = useState(false);

    const onCopyText = () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 500);
    };

    return (
        <div>
            {!!textToCopy && (
                <CopyToClipboard text={textToCopy} onCopy={onCopyText}>
                    <div className={"relative"}>
                        <p className="mt-2 p-2 border rounded-md overflow-hidden text-ellipsis whitespace-nowrap cursor-copy">
                            {textToCopy}
                        </p>
                        {copyStatus &&
                            <p className="absolute bottom-0 right-0 top-[-30px] mt-2 text-green-500">Copied!</p>}
                    </div>

                </CopyToClipboard>
            )}

        </div>
    );
};

export default CopyButton;
