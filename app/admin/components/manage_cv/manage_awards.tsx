import { AwardField, CvData } from "@/db/schema";
import { useState } from "react";

type ManageAwardProps = {
    cvData: CvData;
    setCvData: React.Dispatch<React.SetStateAction<CvData>>;
};

export default function ManageAwards({ cvData, setCvData }: ManageAwardProps) {
    const [newAward, setNewAward] = useState<AwardField>({
        title: '',
        description: '',
        order: 0,
    });

    const submitAwards = async (e: React.FormEvent) => {
        e.preventDefault();
        const maxOrder = cvData.awards.reduce((max, exp) => Math.max(max, exp.order), 0);

        setNewAward({ title: '', description: '', order: maxOrder + 1 });
        setCvData({ ...cvData, awards: [...cvData.awards, newAward] });
    };

    const reOrder = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up') {
            const tempOrder = cvData.awards[index].order;
            cvData.awards[index].order = cvData.awards[index - 1].order;
            cvData.awards[index - 1].order = tempOrder;
        } else {
            const tempOrder = cvData.awards[index].order;
            cvData.awards[index].order = cvData.awards[index + 1].order;
            cvData.awards[index + 1].order = tempOrder;
        }

        // Sort the work experience by order
        const newAward = [...cvData.awards];
        const temp = newAward[index];
        if (direction === 'up') {
            newAward[index] = newAward[index - 1];
            newAward[index - 1] = temp;
        } else {
            newAward[index] = newAward[index + 1];
            newAward[index + 1] = temp;
        }
        setCvData({ ...cvData, awards: newAward });
    }

    return (
        <div className="basis-2/3 bg-grey-900 rounded-md p-3">
            <h1 className="text-lg font-extralight">ENTER AWARD:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>

            <form onSubmit={submitAwards} className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-3">
                        <div className="flex flex-col gap-0 items-start w-full">
                            <h1 className="font-light">Award Title:</h1>
                            <input
                                type='text'
                                name="AwardTitle"
                                placeholder="Alan Steven John Award in Fine Arts"
                                value={newAward.title}
                                onChange={(e) => setNewAward({ ...newAward, title: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </input>
                            <h1 className="font-light">Award Description:</h1>
                            <textarea
                                name="AwardDescription"
                                placeholder="Offered to students with a 4.0/9.0 GPA"
                                value={newAward.description}
                                rows={4}
                                onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
                                className='p-2 border border-gray-300 rounded text-black m-1 w-full'>
                            </textarea>
                        </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start w-full ">
                        <div className="flex flex-row gap-2 w-full ">
                            <button
                                type="submit"
                                className="p-2 w-full bg-green-500 text-white rounded hover:bg-green-600  disabled:opacity-20"
                                disabled={(newAward.title == ''
                                    || newAward.description == '')}
                            >Add Award</button>
                        </div>
                    </div>
                </div>
            </form>



            <h1 className="text-lg font-extralight mt-10">CURRENT AWARDS:</h1>
            <div className="w-full h-[0.5] bg-white mt-1 mb-8"></div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                    {(cvData.awards &&  cvData.awards.length > 0) ? cvData.awards.map((award: AwardField, index: number) => (
                        <div key={index} className="flex flex-row gap-3 w-full mr-32">
                            <div className="mb-5 font-serif basis-5/6">
                                <p className="font-bold inline mr-1">{award.title}</p>
                                <br />
                                <p className="text-grey-300 inline">{award.description}</p>
                            </div>
                            <div className="flex flex-row gap-1  min-w-32 p-2 basis-1/6">
                                <div className="flex flex-col gap-1 basis-1/2">
                                    <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                        onClick={() => reOrder(index, "up")}
                                        disabled={index === 0}
                                    >↑</button>
                                    <button className="p-1 basis-1/2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-20"
                                        onClick={() => reOrder(index, 'down')}
                                        disabled={index === cvData.awards.length - 1}
                                    >↓</button>
                                </div>
                                <button
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-800 basis-1/2"
                                    onClick={() => setCvData({ ...cvData, awards: cvData.awards.filter((_, i) => i !== index) })}
                                >
                                    ✖
                                </button>
                            </div>
                        </div>


                   
                   )) : <p className="text-grey-300">No awards added yet.</p>}
                </div>
            </div>
        </div>
    )
}