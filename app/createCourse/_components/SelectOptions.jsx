import Image from 'next/image'
import React, { useState } from 'react'

function SelectOptions({selectedStudyType}) {
    const Options=[
        {
            name:"Exam",
            icon:"/exam.png"
        },
        {
            name:"Practice",
            icon:"/practice.png"
        },
        {
            name:"Coding Prep",
            icon:"/code.png"
        },
        {
            name:"Others",
            icon:"/knowledge.png"
        },
    ]
    const [selectedOption,setSelectedOption] = useState();
return (
    <div className='mt-5'>
        <h2 className='text-center mb-2 text-lg'>For Which you want to create your personal study material? </h2>
        <div className='grid grid-cols-2 mt-5 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center'>
            {Options.map((option, index) => (
                <div key={index} className={`flex flex-col items-center hover:border-primary
                     justify-center border rounded-xl p-4 cursor-pointer
                     ${option?.name==selectedOption&&'border-primary'}`}
                onClick={() => {setSelectedOption(option.name);selectedStudyType(option.name)}}>
                    <Image src={option.icon} alt={option.name} width={50} height={50} />
                    <h2 className='text-sm mt-2'>{option.name}</h2>
                </div>
            ))}
        </div>
    </div>
)
}

export default SelectOptions
