"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from '@/app/_context/VideoDataContext';
// import { useUser } from '@clerk/clerk-react';
import { db } from '@/configs/db';
import { Users, VideoData } from '@/configs/schema';
import PlayerDialog from '../_components/PlayerDialog';
// import { useRouter } from 'next/router';
import { UserDetailContext } from '@/app/_context/UserDetailContext';
import { toast } from 'sonner';
import { eq } from 'drizzle-orm';
import { useUser } from "@clerk/nextjs"; // YE SAHI HAI
import { useRouter } from 'next/navigation'; // YE SAHI HAI

function CreateNew() {
  const [formData,setFormData]=useState([]);
  const [loading,setLoading]=useState(false);
  const [videoScript,setVideoScript]=useState();
  const [audioFileUrl,setAudioFileUrl]=useState();
  const [captions,setCaptions]=useState();
  const [imageList,setImageList]=useState();
  const [playVideo,setPlayVideo]=useState(false);
  const [videoId,setVideoId]=useState(1);
  

  
  const {videoData,setVideoData}=useContext(VideoDataContext);
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  const {user}=useUser();
  const onHandleInputChange=(fieldName,fieldValue)=>{
    console.log(fieldName,fieldValue)

    setFormData(prev=>({
      ...prev,
      [fieldName]:fieldValue
    }))
  }

  const onCreateClickHandler=()=>{
    if(userDetail?.credits<=0){
      toast("you don't have enough Credits")
      return ;
    }
    GetVideoScript();
  }

  //Get video script
  const GetVideoScript=async()=>{
    setLoading(true);
    const prompt='Write a script to generate a '+formData.duration+' video on topic:'+formData.topic+' along with AI image prompt in '+formData.imageStyle+' format for each scene. Return result in JSON format with fields imagePrompt and ContentText.'
   console.log(prompt)
    const resp=await axios.post('/api/get-video-script',{
      prompt: prompt
    });
    if(resp.data.result){
      setVideoData(prev=>({
        ...prev,
        'videoScript':resp.data.result
      }))
      setVideoScript(resp.data.result);
      await GenerateAudioFile(resp.data.result);
    }
  }

  //Generate Audio File and Save to Firebase Storage

  const GenerateAudioFile=async(videoScriptData)=>{
  setLoading(true)
      let script='';
      const id=uuidv4();
    videoScriptData.forEach(item=>{
      script=script+item.ContentText+' ';
    })
    const resp = await axios.post('/api/generate-audio',{
      text:script,
      id:id
    });
    setVideoData(prev=>({
        ...prev,
        'audioFileUrl':resp.data.result
      }))
      setAudioFileUrl(resp.data.result);
      resp.data.result&& await GenerateAudioCaption(resp.data.result,videoScriptData)
    
  }

// Used to generatw caption from audio file

const GenerateAudioCaption=async(fileUrl,videoScriptData)=>{
  setLoading(true);
  console.log(fileUrl)
  const resp = await axios.post('/api/generate-caption',{
    audioFileUrl:fileUrl
  })
    setCaptions(resp?.data?.captions);
    setVideoData(prev=>({
        ...prev,
        'captions':resp.data.captions
      }));
    resp.data.captions && await GenerateImage(videoScriptData);
}

// used to generate AI Images
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const GenerateImage=async(videoScriptData)=>{

  let images=[];

  for(const element of videoScriptData)
  {
    try{
      // delay before each request to avoid hitting Replicate rate limit
      await sleep(2000);

      const resp=await axios.post('/api/generate-image',{
        prompt:element.imagePrompt
      });
      console.log(resp.data.result);
      images.push(resp.data.result);
    }catch(e)
    {
      console.log('Error:'+e);
    }
  } 
  setVideoData(prev=>({
        ...prev,
        'imageList':images
      }))

  setImageList(images)
  setLoading(false);
}

useEffect(()=>{
  console.log(videoData);
  if(Object.keys(videoData).length==4)
  {
    SaveVideoData(videoData);
  }
},[videoData])


const SaveVideoData = async (videoData) => {
  setLoading(true);

  try {
    const result = await db.insert(VideoData).values({
  script: JSON.stringify(videoData?.videoScript),   // JSON column → stringify
  audioFileUrl: videoData?.audioFileUrl,
  captions: JSON.stringify(videoData?.captions),    // JSON column → stringify
  imageList: videoData?.imageList,                  // array column → plain array
  createdBy: user?.primaryEmailAddress?.emailAddress
}).returning({ id: VideoData.id });

   await UpdateUserCredits();
    setVideoId(result[0].id);
    setPlayVideo(true)
    console.log("Saved video data:", result);
  } catch (e) {
    console.error("Error saving video data:", e);
  } finally {
    setLoading(false);
  }
};

//used to update user credits

  const UpdateUserCredits=async()=>{
    const result=await db.update(Users).set({
      credits:userDetail?.credits-10
    }).where(eq(Users?.email,user?.primaryEmailAddress?.emailAddress))
    console.log(result);
    setUserDetail(prev=>({
      ...prev,
      "credits":userDetail?.credits-10
    }))

    setVideoData(null);
  }

  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center'></h2>

      <div className='mt-10 shadow-md p-10'>
        {/* select topic */}
          <SelectTopic onUserSelect={onHandleInputChange} />
        {/* select style */}
          <SelectStyle onUserSelect={onHandleInputChange}/>
        {/* duration */}
          <SelectDuration onUserSelect={onHandleInputChange}/>
        {/* create button  */}

        <Button className="cursor-pointer mt-10 w-full" onClick={onCreateClickHandler}>Create Short Video</Button>
      </div>

    <CustomLoading loading={loading}/>
    <PlayerDialog playVideo={playVideo} setPlayVideo={setPlayVideo} videoId={videoId}/>
    </div>
  )
}

export default CreateNew
