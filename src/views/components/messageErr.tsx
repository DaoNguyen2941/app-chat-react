import React from "react";

interface IProps {
    message: string | undefined;
}

const MessageErr: React.FC<IProps> = ({ message }) => {
    return (
        <span className="text-red-500 text-xs font-bold pl-5 text-center w-full">
            {message}
        </span>
    );
}

export default MessageErr;
