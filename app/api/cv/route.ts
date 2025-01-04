import { db } from '@/db';
import { NextResponse } from 'next/server';
import { cvExperience, cvSkills, cvAwards, cvEducation, cvWorkexperience } from '@/db/schema'; // Import your tables
import { ExhibitionField, SkillField, AwardField, WorkField, EducationField } from '@/db/schema';

export type CvData = {
  exhibition: ExhibitionField[];
  skills: SkillField[];
  awards: AwardField[];
  work: WorkField[];
  education: EducationField[];
};

export async function GET() {
  try {
    // Fetching data from all the cv_* tables
    let experiences = await db.select({
      title: cvExperience.title,
      location: cvExperience.location,
      date: cvExperience.date,
      description: cvExperience.description,
      order: cvExperience.order,
    }).from(cvExperience).execute();

    let skills = await db.select({
      skill: cvSkills.skill,
      order: cvSkills.order,
    }).from(cvSkills).execute();

    let awards = await db.select({
      title: cvAwards.title,
      description: cvAwards.description,
      order: cvAwards.order,
    }).from(cvAwards).execute();

    let work = await db.select({
      title: cvWorkexperience.title,
      location: cvWorkexperience.location,
      date: cvWorkexperience.date,
      description: cvWorkexperience.description,
      order: cvWorkexperience.order,
    }).from(cvWorkexperience).execute();

    let education = await db.select({
      title: cvEducation.title,
      location: cvEducation.location,
      type: cvEducation.type,
      date: cvEducation.date,
      order: cvEducation.order,
    }).from(cvEducation).execute();

    // Formatting the response data
    if (!experiences) experiences = [];
    if (!skills) skills = [];
    if (!awards) awards = [];
    if (!work) work = [];
    if (!education) education = [];

    const cvData: CvData = {
      exhibition: experiences,
      skills: skills,
      awards: awards,
      work: work,
      education: education,
    };
    return NextResponse.json({ success: true, data: cvData }, { status: 200 });
  } catch (error) {
    console.error('Error loading CV data:', error);
    return NextResponse.json({ error: 'Error loading CV data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const { exhibition, skills, awards, work, education } = await req.json();
    const cvData: CvData = { exhibition, skills, awards, work, education };

    console.log('Received CV data:', cvData);

    //clear all tables
    try{
        await db.delete(cvExperience).execute();
        await db.delete(cvSkills).execute();
        await db.delete(cvAwards).execute();
        await db.delete(cvWorkexperience).execute();
        await db.delete(cvEducation).execute();
    }catch(error){
        console.error('Error clearing tables:', error);
        return NextResponse.json({ error: 'Error clearing tables' }, { status: 500 });
    }

    // Insert data into tables
    try{
        await db.insert(cvExperience).values(cvData.exhibition).execute();
        await db.insert(cvSkills).values(cvData.skills).execute();
        await db.insert(cvAwards).values(cvData.awards).execute();
        await db.insert(cvWorkexperience).values(cvData.work).execute();
        await db.insert(cvEducation).values(cvData.education).execute();

        return NextResponse.json({ success: true }, { status: 200 });
    }catch(error){
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
    }
}
