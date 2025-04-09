'use client'

import React, { useState } from 'react'
import SelectOptions from './_components/SelectOptions'
import { Button } from '@/components/ui/button';
import TopicInput from './_components/TopicInput';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@stackframe/stack'
import { toast } from 'sonner';
import { createStudyMaterial } from '@/services/api';
import { generateCourseOutline } from '@/services/GlobalServices';

function CreateCourse() {
  const user = useUser();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = (fieldName, fieldValue) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }))
  }

  const GenerateCourseOutline = async () => {
    setIsLoading(true);
    try {
      const courseId = uuidv4();
      const result = await generateCourseOutline(
        formData.topic,
        formData.courseType,
        formData.difficultyLevel
      );

      const dbResult = await createStudyMaterial({
        courseId,
        courseType: formData.courseType,
        topic: formData.topic,
        difficultyLevel: formData.difficultyLevel,
        courseLayout: result, // AI-generated content
        createdBy: user?.primaryEmail,
        status: 'completed'
      });

      console.log("Saved to DB:", dbResult);
      toast.success('Course created successfully!');
      
    } catch (error) {
      console.error("Error:", error);
      toast.error('Failed to create course');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20'>
      <h2 className='font-bold text-4xl text-primary'>Start Building Your Personal Study Material</h2>
      <p className='text-gray-500 text-lg'>Fill All Details in order to generate study material for your next project</p>
    
      <div className='mt-10 w-full max-w-2xl'>
        {step === 0 ? 
          <SelectOptions selectedStudyType={(value) => handleUserInput('courseType', value)} />
          :
          <TopicInput 
            setTopic={(value) => handleUserInput('topic', value)}
            setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)} 
          />
        }
      </div>
      <div className='flex justify-between w-full max-w-2xl mt-10'>
        {step !== 0 ? <Button variant='outline' onClick={() => setStep(step - 1)}>Previous</Button> : <div />}
        {step === 0 ? 
          <Button onClick={() => setStep(step + 1)}>Next</Button> :
          <Button onClick={GenerateCourseOutline} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        }
      </div>
    </div>
  )
}

export default CreateCourse