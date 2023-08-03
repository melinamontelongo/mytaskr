"use client"
import { BiLoaderAlt } from "react-icons/bi";
import { useCallback, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import Image from "next/image";
import { UnsplashPhotoType } from "@/lib/validators";
import { toast } from "react-hot-toast";

interface BoardImageBtnModal {
    selectImageAction: Function,
}

const BoardChooseImage = ({ selectImageAction }: BoardImageBtnModal) => {
    const [imageQuery, setImageQuery] = useState<string>("");
    const [imageResults, setImageResults] = useState<UnsplashPhotoType[]>([]);
    const [selectedImage, setSelectedImage] = useState<UnsplashPhotoType>();

    const { mutate: searchImageQuery, isLoading } = useMutation({
        mutationFn: async () => {
            if (!imageQuery) return [];
            const { data } = await axios.get(`https://api.unsplash.com/search/photos?query=${imageQuery}&orientation=landscape`, { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } });
            return data;
        },
        mutationKey: ["search-image"],
        onSuccess: (data) => {
            setImageResults(data.results);
        },
        onError: (err) => {
            toast.error("An error occurred while searching for photos.")
        }
    });

    const { mutate: triggerDownload } = useMutation({
        mutationFn: async () => {
            if (!selectedImage) return;
            const { data } = await axios.get(`${selectedImage.links.download_location}`, { headers: { Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}` } })
            console.log(data);
            return data;
        }
    })

    //  Debounce
    const request = debounce(() => {
        searchImageQuery();
    }, 2000);

    const debounceRequest = useCallback(() => {
        request();
    }, [request]);
    return (<>
        <>
            <div className="form-control mb-2">
                <input
                    type="text"
                    className="input input-bordered rounded"
                    placeholder="Search..."
                    value={imageQuery}
                    onInput={(e: any) => {
                        setImageResults([]);
                        setImageQuery(e.target.value);
                        debounceRequest();
                    }} />
            </div>
            <div className="flex sm:flex-row flex-col items-center justify-center flex-wrap gap-2">
                {imageQuery.length > 0 ? (<>
                    {isLoading && <BiLoaderAlt className="animate-spin text-2xl mx-auto" />}
                    {imageResults && imageResults.length > 0 && (
                        imageResults.map((result: any) => {
                            return (
                                <div key={result.id} className={`w-40 h-40 relative group cursor-pointer`} onClick={() => {
                                    setSelectedImage(result)
                                    selectImageAction(result)
                                }}>
                                    <div className={`relative w-40 h-40  ${selectedImage?.id === result.id && "border border-2 border-base-content"}`}>
                                        <Image src={result.urls.small} alt={result.alt_description} style={{ objectFit: "cover" }} fill={true} />
                                    </div>
                                    <div className="absolute md:group-hover:visible md:invisible bottom-0 left-0 bg-base-200/50 md:h-full md:w-full h-1/3 flex justify-center items-center">
                                        <p className="text-sm text-center">Photo by { }
                                            <a href={`https://unsplash.com/@${result.user.username}?utm_source=mytaskr&utm_medium=referral`} target="_blank" className="font-bold underline">
                                                {result.user.username}
                                            </a>
                                            { } on { }
                                            <a href="https://unsplash.com/?utm_source=mytaskr&utm_medium=referral" className="font-bold underline" target="_blank">
                                                Unsplash
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )
/*                         :
                        !isLoading && <p>No results found.</p> */
                    }
                </>) : null}
            </div>
            {selectedImage &&
                <div className="my-2">
                    <p className="text-sm text-center">Selected photo by { }
                        <a href={`https://unsplash.com/@${selectedImage.user.username}?utm_source=mytaskr&utm_medium=referral`} target="_blank" className="font-bold underline">
                            {selectedImage.user.username}
                        </a>
                        { } on { }
                        <a href="https://unsplash.com/?utm_source=mytaskr&utm_medium=referral" className="font-bold underline" target="_blank">
                            Unsplash
                        </a>
                    </p>
                </div>
            }
            {imageResults.length > 0 &&
                <div className="flex justify-center gap-2 mt-5">
                    <label htmlFor={`boardImage`} className="btn btn-sm btn-primary rounded normal-case" onClick={() => triggerDownload()}>Select</label>
                    <label htmlFor={`boardImage`} className="btn btn-sm bg-base-300 rounded normal-case" onClick={() => {
                        setSelectedImage(undefined)
                        selectImageAction(undefined)
                        setImageResults([])
                        setImageQuery("");
                    }}>Cancel</label>
                </div>
            }
        </>
    </>)
}

export default BoardChooseImage;