"use client";

// https://www.npmjs.com/package/react-uploader
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader"; // Installed by "react-uploader".

import Image from 'next/image'
import React from 'react'
import { useState } from "react";
import LoadingDots from "@/components/LoafdingDots";

// Initialize once (at the start of your app).
const uploader = Uploader({
    apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
        ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
        : "free",
});

// Configuration options: https://www.bytescale.com/docs/upload-widget/frameworks/react#customize
const options = {
    maxFileCount: 1,
    mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
    editor: { images: { crop: false } },
    styles: {
        colors: {
            primary: "#2563EB", // Primary buttons & links
            error: "#2563EB", // Error messages
            shade100: "#2563EB", // Standard text
            shade200: "#fffe", // Secondary button text
            shade300: "#fffd", // Secondary button text (hover)
            shade400: "#2563EB", // Welcome text
            shade500: "#fff9", // Modal close button
            shade600: "#2563EB", // Border
            shade700: "#fff2", // Progress indicator background
            shade800: "#fff1", // File item background
            shade900: "#ffff", // Various (draggable crop buttons, etc.)
        },
    },
};

export default function DetectPage() {
    const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
    const [photoName, setPhotoName] = useState<string | null>(null);
    const [restoredImage, setRestoredImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const UploadDropZone = () => (
        <UploadDropzone
            uploader={uploader}
            options={options}
            onUpdate={(file) => {
                if (file.length !== 0) {
                    setPhotoName(file[0].originalFile.originalFileName);
                    setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
                    GetPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
                }
            }}
            width="670px"
            height="250px"
        />
    );

    async function GetPhoto(fileUrl: string) {
        try {
            setLoading(true);
            const res = await fetch('/api/edit-photo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ image: fileUrl })
            });

            if (res.status !== 200) {
                console.error('Server returned an error status:', res.status);
                return;
            }

            let newPhoto = await res.json();
            setRestoredImage(newPhoto[0]);
            setLoading(false);
            console.log(restoredImage)
        } catch (error) {
            console.error('There was an error making the API call:', error);
            setLoading(false);
        }
    }

    async function deleteImage() {
        setRestoredImage(null);
        setOriginalPhoto(null);
    }

    // For debugging
    // const makeApiCall = async () => {
    //     try {
    //         const res = await fetch('/api/edit-photo', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ image: 'https://cdn.create.vista.com/api/media/small/51818167/stock-photo-family-portrait-with-thumbs-up' })
    //         });

    //         if (res.status !== 200) {
    //             console.error('Server returned an error status:', res.status);
    //             return;
    //         }

    //         let newPhoto = await res.json();
    //         setRestoredImage(newPhoto[0]);
    //         console.log(restoredImage)
    //     } catch (error) {
    //         console.error('There was an error making the API call:', error);
    //     }
    // }


    return (
        <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
            <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">


                {!restoredImage && !originalPhoto &&
                    <>
                        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-black sm:text-6xl mb-6">
                            Get your <span className="text-blue-700">googly eyes</span> now!
                        </h1>
                        <UploadDropZone />
                    </>
                }
                {restoredImage && (
                    <>
                        <div className="mt-5 mb-11">
                            <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-black sm:text-6xl mb-6">
                                <span className="text-blue-700">Googly eyes!</span>
                            </h1>
                            <Image
                                alt="original photo"
                                src={restoredImage}
                                className="rounded-2xl h-96 w-full"
                                width={475}
                                height={475}
                            />
                        </div>


                        <button
                            onClick={deleteImage}
                            className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
                        >Delete Image</button>
                    </>
                )}
                {loading && (
                    <button
                        disabled
                        className="bg-blue-500 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
                    >
                        <span className="pt-4">
                            <LoadingDots color="white" style="large" />
                        </span>
                    </button>
                )}

                {/* For debugging */}
                {/* <button onClick={makeApiCall}>make call</button> */}

            </main>
        </div>
    )
}
