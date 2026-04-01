import textToSpeech from "@google-cloud/text-to-speech";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { NextResponse } from "next/server";
import { storage } from "../../../configs/FirebaseConfig";
const fs = require('fs');
const util = require('util');
const client = new textToSpeech.TextToSpeechClient({
    apiKey:process.env.GOOGLE_API_KEY
});

export async function POST(req) {
    try{
    const {text,id}=await req.json();
    const storageRef=ref(storage,'ai-short-video-files/'+id+'.mp3');
    const request = {
        input:{text: text},
        voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
        audioConfig: {audioEncoding: 'MP3'},
    };

const [response]= await client.synthesizeSpeech(request);

const audioBuffer=Buffer.from(response.audioContent,'binary');

await uploadBytes(storageRef,audioBuffer,{contentType:'audio/mp3'});

const downloadUrl=await getDownloadURL(storageRef);
console.log(downloadUrl);
return NextResponse.json({result:downloadUrl});
}catch(e){
    console.error("Error generating audio:", e);
    return NextResponse.json(
      { error: "Failed to generate audio", details: e.message || e },
      { status: 500 }
    );

}
}