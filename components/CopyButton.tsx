import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const CopyButton = ({textToCopy}: { textToCopy: string }) => {
    const [copyStatus, setCopyStatus] = useState(false);

    const onCopyText = () => {
        setCopyStatus(true);
        setTimeout(() => setCopyStatus(false), 1000);
    };

    return (
        <div>
            {!!textToCopy && (
                <div>
                    <CopyToClipboard text={textToCopy} onCopy={onCopyText}>

                        <p className="mt-2 p-2 border w-[300px] rounded-md overflow-hidden text-ellipsis whitespace-nowrap cursor-copy">
                            {textToCopy}
                        </p>
                    </CopyToClipboard>
                    {copyStatus && <p className="mt-2 text-green-500">Copied!</p>}
                </div>
            )}

        </div>
    );
};

export default CopyButton;
