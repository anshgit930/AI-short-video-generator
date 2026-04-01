import { getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios";
import { ref, uploadString } from "firebase/storage";
import { storage } from "../../../configs/FirebaseConfig";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
      { input }
    );


//save to firebase
const base64Image="data:image/png;base64,"+ await ConvertImage(output[0])
const fileName='ai-short-video-files/'+Date.now()+".png"
const storageRef=ref(storage,fileName);

await uploadString(storageRef,base64Image,'data_url');

const downloadUrl=await getDownloadURL(storageRef);
console.log(downloadUrl);


return NextResponse.json({result:downloadUrl});

    }catch(e)
    {
       console.error("Error generating image:", e);
  return NextResponse.json(
    { error: "Failed to generate image", details: e.message || e },
    { status: 500 }
  );


    }
}

const ConvertImage=async(imageUrl)=>{
try{
    const resp=await axios.get(imageUrl,{responseType:'arraybuffer'});

    const base64Image=Buffer.from(resp.data).toString('base64');
    return base64Image;

}catch(e){
    console.log('Error1:' , e)
    return null
}
}