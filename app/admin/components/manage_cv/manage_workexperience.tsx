import { CvData, WorkField } from "@/db/schema";
import { useState } from "react";

type ManageWorkProps = {
    cvData: CvData;
    setCvData: React.Dispatch<React.SetStateAction<CvData>>;
};

export default function ManageWork({ cvData, setCvData }: ManageWorkProps) {
    const [newWork, setNewWork] = useState<WorkField>({
        title: '',
        location: '',
        date: '',
        description: '',
        order: 0,
    });

    const submitExperience = async (e: React.FormEvent) => {
        e.preventDefault();
        const maxOrder = cvData.work.reduce((max, exp) => Math.max(max, exp.order), 0);

        setNewWork({ title: '', location: '', date: '', description: '', order: maxOrder + 1 });
        setCvData({ ...cvData, work: [...cvData.work, newWork] });
    };

    const reOrder = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up') {
            const tempOrder = cvData.work[index].order;
            cvData.work[index].order = cvData.work[index - 1].order;
            cvData.work[index - 1].order = tempOrder;
        } else {
            const tempOrder = cvData.work[index].order;
            cvData.work[index].order = cvData.work[index + 1].order;
            cvData.work[index + 1].order = tempOrder;
        }

        // Sort the work experience by order
        const newWork = [...cvData.work];
        const temp = newWork[index];
        if (direction === 'up') {
            newWork[index] = newWork[index - 1];
            newWork[index - 1] = temp;
        } else {
            newWork[index] = newWork[index + 1];
            newWork[index + 1] = temp;
        }
        setCvData({ ...cvData, work: newWork });
    }

    return (
        <div className="basis-2/3 bg-grey-900 rounded-md p-3">
            <h1 className="text-lg font-extralight">ENTER WORK:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>

            <form onSubmit={submitExperience} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Position Title:</h1>
                            <input type="text"
                                name="Title"
                                placeholder="Photographer"
                                value={newWork.title}
                                onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>
                        </div>
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Position Location:</h1>
                            <input type="text"
                                name="Location"
                                placeholder="Victoria, BC"
                                value={newWork.location}
                                onChange={(e) => setNewWork({ ...newWork, location: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>
                        </div>
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Position Timeframe:</h1>
                            <input type="text"
                                name="Date"
                                placeholder="08/2025 - Current"
                                value={newWork.date}
                                onChange={(e) => setNewWork({ ...newWork, date: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>

                        </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start ">
                        <h1 className="font-light">Position Description:</h1>
                        <div className="flex flex-row gap-2 w-full ">
                            <textarea
                                name="Description"
                                placeholder="Enter work description"
                                value={newWork.description}
                                onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
                                rows={2}
                                className='p-2 border border-gray-300 rounded text-black mx-1 w-full basis-5/6'>
                            </textarea>
                            <button
                                type="submit"
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 basis-1/6 disabled:opacity-20"
                                disabled={!(newWork.title !== ''
                                    && newWork.location !== ''
                                    && newWork.date !== ''
                                    && newWork.description !== '')}
                            >Add Work Experience</button>
                        </div>
                    </div>
                </div>
            </form>



            <h1 className="text-lg font-extralight mt-10">CURRENT WORK:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                    {(cvData.work && cvData.work.length > 0) ? cvData.work.map((work: WorkField, index: number) => (
                        <div key={index} className="flex flex-row gap-3 w-full mr-32">
                            <div className="mb-5 font-serif basis-5/6">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{work.title},</h1>
                                    <h1>{work.location}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{work.date}</p>
                                <p>{work.description}</p>
                            </div>
                            <div className="flex flex-row gap-1  min-w-32 p-2 basis-1/6">
                                    <div className="flex flex-col gap-1 basis-1/2">
                                        <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                                onClick={() => reOrder(index, "up")}
                                                disabled={index === 0}
                                                >↑</button>
                                        <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                                onClick={() => reOrder(index, 'down')}
                                                disabled={index === cvData.work.length - 1}
                                                >↓</button>
                                    </div>
                                    <button
                                        className="p-1 bg-red-500 text-white rounded hover:bg-red-800 basis-1/2"
                                        onClick={() => setCvData({ ...cvData, work: cvData.work.filter((_, i) => i !== index) })}
                                    >
                                        ✖
                                    </button>
                            </div>
                        </div>


                    )): <div className="text-grey-300">No work experience added yet.</div>}
                </div>
            </div>
        </div>
    )
}