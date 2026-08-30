"use client";

import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";

declare global { interface Window { cloudinary: any; } }

interface ImageUploadProps {
    onChange: (value: string) => void;
    value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onChange,
    value,
}) => {
    const handleUpload = useCallback(() => {
        if (!window.cloudinary) {
            console.error("Cloudinary is not loaded");
            return;
        }

        window.cloudinary.openUploadWidget(
            {
                cloudName: "kskiyudg",
                uploadPreset: "dguoxeu4",
                maxFiles: 1,
            },
            (error: any, result: any) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    return;
                }

                if (result?.event === "success") {
                    onChange(result.info.secure_url);
                }
            }
        );
    }, [onChange]);

    return (
        <div
            onClick={handleUpload}
            className="
                relative
                cursor-pointer
                hover:opacity-70
                transition
                border-dashed
                border-2
                p-20
                border-neutral-300
                flex
                flex-col
                justify-center
                items-center
                gap-4
                text-neutral-600
            "
        >
            <TbPhotoPlus size={50} />

            <div className="font-bold text-lg">
                Click to upload
            </div>

            {value && (
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        alt="Upload"
                        fill
                        style={{ objectFit: "cover" }}
                        src={value}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;