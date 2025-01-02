import { db } from '@/db';
import { NextResponse } from 'next/server';
import { cvExperience, cvSkills, cvAwards, cvProjects, cvEducation } from '@/db/schema'; // Import your tables
import { ExperienceField, SkillField, AwardField, ProjectField, EducationField } from '@/db/schema';

export type CvData = {
  experience: ExperienceField[];
  skills: SkillField[];
  awards: AwardField[];
  projects: ProjectField[];
  education: EducationField[];
};

export async function GET() {
  try {
    // Fetching data from all the cv_* tables
    const experiences = await db.select({
      title: cvExperience.title,
      location: cvExperience.location,
      date: cvExperience.date,
      description: cvExperience.description,
      order: cvExperience.order,
    }).from(cvExperience).execute();

    const skills = await db.select({
      skill: cvSkills.skill,
      order: cvSkills.order,
    }).from(cvSkills).execute();

    const awards = await db.select({
      title: cvAwards.title,
      description: cvAwards.description,
      order: cvAwards.order,
    }).from(cvAwards).execute();

    const projects = await db.select({
      title: cvProjects.title,
      genre: cvProjects.genre,
      description: cvProjects.description,
      order: cvProjects.order,
    }).from(cvProjects).execute();

    const education = await db.select({
      title: cvEducation.title,
      location: cvEducation.location,
      type: cvEducation.type,
      date: cvEducation.date,
      order: cvEducation.order,
    }).from(cvEducation).execute();

    // Formatting the response data
    const cvData: CvData = {
      experience: experiences,
      skills: skills,
      awards: awards,
      projects: projects,
      education: education,
    };

    return NextResponse.json({ success: true, data: cvData }, { status: 200 });
  } catch (error) {
    console.error('Error loading CV data:', error);
    return NextResponse.json({ error: 'Error loading CV data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    const { experience, skills, awards, projects, education } = await req.json();
    const cvData: CvData = { experience, skills, awards, projects, education };

    //clear all tables
    try{
        await db.delete(cvExperience).execute();
        await db.delete(cvSkills).execute();
        await db.delete(cvAwards).execute();
        await db.delete(cvProjects).execute();
        await db.delete(cvEducation).execute();
    }catch(error){
        console.error('Error clearing tables:', error);
        return NextResponse.json({ error: 'Error clearing tables' }, { status: 500 });
    }

    // Insert data into tables
    try{
        await db.insert(cvExperience).values(cvData.experience).execute();
        await db.insert(cvSkills).values(cvData.skills).execute();
        await db.insert(cvAwards).values(cvData.awards).execute();
        await db.insert(cvProjects).values(cvData.projects).execute();
        await db.insert(cvEducation).values(cvData.education).execute();

        return NextResponse.json({ success: true }, { status: 200 });
    }catch(error){
        console.error('Error inserting data:', error);
        return NextResponse.json({ error: 'Error inserting data' }, { status: 500 });
    }
}
