import Tooltip from "@/app/components/global/tooltip";
import { useState } from "react";
import ReactPlayer from "react-player";

interface VideoSelectorProps{
    onChange: (videoLink: string) => void;
}

export default function VideoSelector({ onChange }: VideoSelectorProps){
    const [videoString, setVideoString] = useState("");

    const handleChangeVideoString = (videoLink: string) => {
        setVideoString(videoLink);
        onChange(videoLink)
    }

    return(<>
        <div className="bg-grey-700 p-2">
                                <div className="flex">
                                    <Tooltip>
                                        <p>Video links from the following sites are supported:</p>
                                        <ol className="list-disc pl-4">
                                           <li>Youtube</li>
                                           <li>Vimeo</li>
                                           <li>DailyMotion</li>
                                           <li>Facebook</li> 
                                           <li>Streamable</li>
                                           <li>Twitch</li>
                                        </ol>
                                        <p>And more... Refer to guide for all supported formats</p>
                                    </Tooltip>
                                    <h3 className="text-lg font-medium mb-4">Video Embed</h3>
                                </div>
                                <label>
                                    Enter Video Embed Code:
                                    <textarea
                                        value={videoString}
                                        onChange={(e) => handleChangeVideoString(e.target.value)}
                                        rows={2}
                                        cols={41}
                                        placeholder="Paste your video link here:"
                                        className=" p-2 border border-gray-300 rounded text-black m-2"
                                    />
                                </label>
                                <h3 className="text-lg font-medium mb-4">Video Preview</h3>
                                {videoString ? (
                                        <ReactPlayer url={videoString} 
                                                    controls={true}
                                                    width={400}
                                                    height={230}/>                     
                                ) : (
                                    <p>No preview available. Past an video link to see the result.</p>
                                )}
                            </div>
    </>)
}