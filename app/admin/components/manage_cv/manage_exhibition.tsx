import { CvData, ExhibitionField } from "@/db/schema";
import { useState } from "react";

type ManageExhibitionProps = {
    cvData: CvData;
    setCvData: React.Dispatch<React.SetStateAction<CvData>>;
};

export default function ManageExhibition({ cvData, setCvData }: ManageExhibitionProps) {
    const [newExhibition, setNewExhibition] = useState<ExhibitionField>({
        title: '',
        location: '',
        date: '',
        description: '',
        order: 0,
    });

    const submitExperience = async (e: React.FormEvent) => {
        e.preventDefault();
        const maxOrder = (cvData.exhibition && cvData.exhibition.length > 0) ? cvData.exhibition.reduce((max, exp) => Math.max(max, exp.order), 0) : 0;

        setNewExhibition({ title: '', location: '', date: '', description: '', order: maxOrder + 1 });
        if(!cvData.exhibition) cvData.exhibition = [];
        setCvData({ ...cvData, exhibition: [...cvData.exhibition, newExhibition] });
    };

    const reOrder = (index: number, direction: 'up' | 'down') => {
        // Update the order property

        if (direction === 'up') {
            const tempOrder = cvData.exhibition[index].order;
            cvData.exhibition[index].order = cvData.exhibition[index - 1].order;
            cvData.exhibition[index - 1].order = tempOrder;
        } else {
            const tempOrder = cvData.exhibition[index].order;
            cvData.exhibition[index].order = cvData.exhibition[index + 1].order;
            cvData.exhibition[index + 1].order = tempOrder;
        }


        const newExhibitions = [...cvData.exhibition];
        const temp = newExhibitions[index];
        if (direction === 'up') {
            newExhibitions[index] = newExhibitions[index - 1];
            newExhibitions[index - 1] = temp;
        } else {
            newExhibitions[index] = newExhibitions[index + 1];
            newExhibitions[index + 1] = temp;
        }
        setCvData({ ...cvData, exhibition: newExhibitions });
    }

    return (
        <div className="basis-2/3 bg-grey-900 rounded-md p-3">
            <h1 className="text-lg font-extralight">ENTER EXHIBITION:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>

            <form onSubmit={submitExperience} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Exhibition Name:</h1>
                            <input type="text"
                                name="Title"
                                placeholder="Interoception"
                                value={newExhibition.title}
                                onChange={(e) => setNewExhibition({ ...newExhibition, title: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>
                        </div>
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Exhibition Location:</h1>
                            <input type="text"
                                name="Location"
                                placeholder="UVic Audain Gallery"
                                value={newExhibition.location}
                                onChange={(e) => setNewExhibition({ ...newExhibition, location: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>
                        </div>
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Exhibition Date:</h1>
                            <input type="text"
                                name="Date"
                                placeholder="08/2025 - Current"
                                value={newExhibition.date}
                                onChange={(e) => setNewExhibition({ ...newExhibition, date: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>

                        </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start ">
                        <h1 className="font-light">Exhibition Description:</h1>
                        <div className="flex flex-row gap-2 w-full ">
                            <textarea
                                name="Description"
                                placeholder="Enter experience description"
                                value={newExhibition.description}
                                onChange={(e) => setNewExhibition({ ...newExhibition, description: e.target.value })}
                                rows={2}
                                className='p-2 border border-gray-300 rounded text-black mx-1 w-full basis-5/6'>
                            </textarea>
                            <button
                                type="submit"
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 basis-1/6 disabled:opacity-20"
                                disabled={!(newExhibition.title !== ''
                                    && newExhibition.location !== ''
                                    && newExhibition.date !== ''
                                    && newExhibition.description !== '')}
                            >Add Exhibition</button>
                        </div>
                    </div>
                </div>
            </form>



            <h1 className="text-lg font-extralight mt-10">CURRENT EXHIBITIONS:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                    {(cvData.exhibition && cvData.exhibition.length > 0) ? cvData.exhibition.map((experience: ExhibitionField, index: number) => (
                        <div key={index} className="flex flex-row gap-3 w-full mr-32">
                            <div className="mb-5 font-serif basis-5/6">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{experience.title},</h1>
                                    <h1>{experience.location}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{experience.date}</p>
                                <p>{experience.description}</p>
                            </div>
                            <div className="flex flex-row gap-1  min-w-32 p-2 basis-1/6">
                                <div className="flex flex-col gap-1 basis-1/2">
                                    <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                        onClick={() => reOrder(index, "up")}
                                        disabled={index === 0}
                                    >↑</button>
                                    <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                        onClick={() => reOrder(index, 'down')}
                                        disabled={index === cvData.exhibition.length - 1}
                                    >↓</button>
                                </div>
                                <button
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-800 basis-1/2"
                                    onClick={() => setCvData({ ...cvData, exhibition: cvData.exhibition.filter((_, i) => i !== index) })}
                                >
                                    ✖
                                </button>
                            </div>
                        </div>


                    )): <div className="text-grey-300">No exhibitions added yet.</div>}
                </div>
            </div>
        </div>
    )
}