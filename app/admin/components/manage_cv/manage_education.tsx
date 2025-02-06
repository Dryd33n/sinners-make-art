import { CvData, EducationField } from "@/db/schema";
import { useState } from "react";

type ManageEducationProps = {
    cvData: CvData;
    setCvData: React.Dispatch<React.SetStateAction<CvData>>;
};

export default function ManageEducation({ cvData, setCvData }: ManageEducationProps) {
    const [newEducation, setNewEducation] = useState<EducationField>({
        title: '',
        location: '',
        type: '',
        date: '',
        order: 0,
    });

    const submitExperience = async (e: React.FormEvent) => {
        e.preventDefault();
        const maxOrder = cvData.education.reduce((max, exp) => Math.max(max, exp.order), 0);

        setNewEducation({ title: '', location: '', date: '', type: '', order: maxOrder + 1 });
        setCvData({ ...cvData, education: [...cvData.education, newEducation] });
    };

    const reOrder = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up') {
            const tempOrder = cvData.education[index].order;
            cvData.education[index].order = cvData.education[index - 1].order;
            cvData.education[index - 1].order = tempOrder;
        } else {
            const tempOrder = cvData.education[index].order;
            cvData.education[index].order = cvData.education[index + 1].order;
            cvData.education[index + 1].order = tempOrder;
        }

        const newEducation = [...cvData.education];
        const temp = newEducation[index];
        if (direction === 'up') {
            newEducation[index] = newEducation[index - 1];
            newEducation[index - 1] = temp;
        } else {
            newEducation[index] = newEducation[index + 1];
            newEducation[index + 1] = temp;
        }
        setCvData({ ...cvData, education: newEducation });
    }

    return (
        <div className="basis-2/3 bg-grey-900 rounded-md p-3">
            <h1 className="text-lg font-extralight">ENTER EDUCATION:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>

            <form onSubmit={submitExperience} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Education Institution:</h1>
                            <input type="text"
                                name="Title"
                                placeholder="UVic"
                                value={newEducation.title}
                                onChange={(e) => setNewEducation({ ...newEducation, title: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>
                        </div>
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Education Location:</h1>
                            <input type="text"
                                name="Location"
                                placeholder="Victoria, BC"
                                value={newEducation.location}
                                onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>
                        </div>
                        <div className="flex flex-col gap-0 items-start basis-1/3">
                            <h1 className="font-light">Education Timeframe:</h1>
                            <input type="text"
                                name="Date"
                                placeholder="08/2025 - Current"
                                value={newEducation.date}
                                onChange={(e) => setNewEducation({ ...newEducation, date: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>

                        </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start ">
                        <h1 className="font-light">Degree Name:</h1>
                        <div className="flex flex-row gap-2 w-full ">
                            <input
                                name="Description"
                                placeholder="Bachelor of Fine Arts"
                                value={newEducation.type}
                                onChange={(e) => setNewEducation({ ...newEducation, type: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black mx-1 w-full basis-5/6'>
                            </input>
                            <button
                                type="submit"
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 basis-1/6 disabled:opacity-20"
                                disabled={!(newEducation.title !== ''
                                    && newEducation.location !== ''
                                    && newEducation.date !== ''
                                    && newEducation.type !== '')}
                            >Add Education</button>
                        </div>
                    </div>
                </div>
            </form>



            <h1 className="text-lg font-extralight mt-10">CURRENT EDUCATION:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                    {(cvData.education && cvData.education.length > 0 )? cvData.education.map((education: EducationField, index: number) => (
                        <div key={index} className="flex flex-row gap-3 w-full mr-32">
                          <div className="mb-5 basis-5/6">
                                <div className="flex flex-row text-xl gap-1 flex-wrap">
                                    <h1 className="font-bold">{education.title},</h1>
                                    <h1>{education.location}</h1>
                                    <p>—</p>
                                    <h1 className="italic">{education.type}</h1>
                                </div>
                                <p className="font-sans text-sm text-grey-300 my-1">{education.date}</p>
                            </div>
                            <div className="flex flex-row gap-1  min-w-32 p-2 basis-1/6">
                                    <div className="flex flex-col gap-1 basis-1/2">
                                        <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                                onClick={() => reOrder(index, "up")}
                                                disabled={index === 0}
                                                >↑</button>
                                        <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                                onClick={() => reOrder(index, 'down')}
                                                disabled={index === cvData.education.length - 1}
                                                >↓</button>
                                    </div>
                                    <button
                                        className="p-1 bg-red-500 text-white rounded hover:bg-red-800 basis-1/2"
                                        onClick={() => setCvData({ ...cvData, education: cvData.education.filter((_, i) => i !== index) })}
                                    >
                                        ✖
                                    </button>
                            </div>
                        </div>


                    )) : <div className="text-grey-300">No education entered yet.</div>}
                </div>
            </div>
        </div>
    )
}