"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("24d94bde-e0e1-461f-91f2-45052467bd4f");
    }, []);

    return null;
}