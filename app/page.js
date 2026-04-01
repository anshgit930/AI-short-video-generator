// import { Button } from "@/components/ui/button";
// import { UserButton } from "@clerk/nextjs";
// import Image from "next/image";

// export default function Home() {
//   return (
//     <div >
//      <h2> Tailwind is working!</h2>
//       <Button>Subscribe</Button>
 
//       <UserButton/>
//     </div>
//   );
// }
"use client"
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  
  const youtubeVideoUrl = "https://www.youtube.com"; 

  const creators = [
    {
      id: 1,
      name: "Ansh Sharma",
      education: "B.Tech (CSE)",
      image: "/AnshOP.jpeg",
      linkedin: "https://www.linkedin.com/in/ansh-sharma-405557262/",
      email: "mailto:anshuujjn@gmail.com" 
    },
    {
      id: 2,
      name: "Aditya Bhagat",
      education: "B.Tech (CSE)",
      image: "/creatorQ.jpeg",
      linkedin: "https://www.linkedin.com/in/aditya-bhagat-16998a368?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      email: "mailto:Adityabhagat161@gmail.com"
    },
    {
      id: 3,
      name: "Jatin Kumar Kesharwani",
      education: "B.Tech (CSE)",
      image: "/creator3.jpeg",
      linkedin: "https://www.linkedin.com/in/jatin-kesharwani-50318b251?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      email: "mailto:Kesharwanijatin41@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* --- NAVBAR --- */}
      <header className="p-5 flex justify-between items-center shadow-sm border-b sticky top-0 bg-white z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-white font-bold text-2xl w-10 h-10 flex items-center justify-center">
            A
          </div>
          <h2 className="font-bold text-2xl tracking-tight hidden md:block text-gray-800">
            Short Vid
          </h2>
        </div>
        
        <div className="flex gap-4 items-center">
          <SignedIn>
            <Link href={'/dashboard'}>
               <Button variant="ghost" className="text-gray-600 font-semibold hover:bg-gray-100">
                 Dashboard
               </Button>
            </Link>
            <div className="flex-shrink-0 border-2 border-primary rounded-full p-0.5">
               <UserButton />
            </div>
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
               <Button className="rounded-full px-6 shadow-lg">Get Started</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex flex-col items-center justify-center text-center mt-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
          Create Viral Shorts <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
            In Seconds, Not Hours
          </span>
        </h1>
        
        <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-3xl leading-relaxed">
          AI-powered video generation for creators. Auto-script, voiceover, and images in one click.
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-5">
          <Link href={'/dashboard'}>
             <Button className="px-12 py-7 text-xl rounded-full shadow-xl font-bold hover:scale-105 transition-all">
               Create My First Video
             </Button>
          </Link>
          
          <a href={youtubeVideoUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="px-10 py-7 text-xl rounded-full border-2 font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-600 transition-all">
              Watch Showcase 🎬
            </Button>
          </a>
        </div>

        {/* --- MEET THE CREATORS SECTION --- */}
        <div className="mt-32 w-full mb-20">
          <h2 className="text-4xl font-black text-gray-800 mb-4">Meet the Creators</h2>
          <p className="text-gray-500 mb-12">The minds behind this AI Video Generator</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {creators.map((creator) => (
              <div key={creator.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all group flex flex-col items-center">
                
                {/* --- IMAGE SECTION (FIXED) --- */}
                <div className="relative w-full h-72 bg-gray-100 rounded-3xl mb-6 overflow-hidden border">
                  {creator.image ? (
                    <Image 
                      src={creator.image} 
                      alt={creator.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      Photo Missing
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-900">{creator.name}</h3>
                <p className="text-primary font-semibold text-sm mt-2 uppercase tracking-wide">
                  {creator.education}
                </p>

                {/* --- SOCIAL LINKS --- */}
                <div className="mt-8 flex justify-center gap-6 w-full">
                  <a 
                    href={creator.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 max-w-[100px] h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    Linkedin
                  </a>

                  <a 
                    href={creator.email} 
                    className="flex-1 max-w-[100px] h-12 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center font-black text-sm border border-gray-200 hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t py-16 bg-gray-50 flex flex-col items-center">
        <p className="text-gray-400 text-sm">© 2026 AI Short Video Generator Project Made with 💖 by Ansh Sharma</p>
      </footer>
    </div>
  );
}