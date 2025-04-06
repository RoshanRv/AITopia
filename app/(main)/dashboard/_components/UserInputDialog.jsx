import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { UserContext } from '@/app/_context/UserContext';

function UserInputDialog({children, CoachingOptions}) {
    const [topic,setTopic] = useState();
    const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
    const [loading,setLoading] = useState(false); 
    const [openDialog,setOpenDialog] = useState(false);
    const router = useRouter();
    const {userData} = useContext(UserContext);

    const onClickNext = async()=>{
        setLoading(true);
        const result = await createDiscussionRoom({
            topic:topic,
            coachingOptions:CoachingOptions?.name,
            expertName: "kore" ,
            uid:userData?._id
        })
        setLoading(false);
        setOpenDialog(false);
        router.push('/discussion-room/' + result);
    }
return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{CoachingOptions.name}</DialogTitle>
                        <DialogDescription asChild>
                            <div className='mt-3'>
                                <h2 className='text-black'>Enter a Topic to master your skills in {CoachingOptions.name}</h2>
                                <Textarea placeholder = "Enter your Topic here..." className="mt-2" 
                                onChange={(e)=>setTopic(e.target.value)}/>
                                <h2 className='text-black mt-5'>Coaching Assistant</h2>
                                <div className='flex flex-col items-center justify-center mt-3'>
                                    <Image 
                                        src="/ai.gif" 
                                        alt="Kore AI"
                                        width={100}
                                        height={100}
                                        className="h-[80px] w-[80px] object-cover rounded-full"
                                    />
                                    <h2 className='text-center font-bold mt-2'>Kore AI</h2>
                                </div>
                                <div className='flex gap-5 justify-end mt-5'>
                                    <DialogClose asChild>
                                        <Button variant={'ghost'}>Cancel</Button>
                                    </DialogClose>
                                    <Button disabled={!topic || loading} onClick={onClickNext}>
                                    {loading && <LoaderCircle className='animate-spin'/>}Next</Button>
                                </div>
                            </div>
                        </DialogDescription>
                </DialogHeader>
            </DialogContent>
</Dialog>
)
}

export default UserInputDialog