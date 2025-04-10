"use client";

import Link from "next/link";

export default function Home() {
  return <ClientContent />;
}

function ClientContent() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* A 3x3 grid. Decreased gap from 4 to 2 */}
      <div className="grid grid-cols-3 grid-rows-3 gap-2">
        {/* Top Center: WriteMate */}
        <div className="col-start-2 row-start-1">
          <div
            onClick={() => console.log("WriteMate card touched")}
            className="w-48 h-48 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer transform rotate-45"
          >
            <div className="w-full h-full flex flex-col justify-center items-center transform -rotate-45">
              <img src="/handwritten.png" alt="WriteMate" className="w-12 h-12 mb-2" />
              <span className="text-lg font-semibold text-gray-700">WriteMate</span>
            </div>
          </div>
        </div>

        {/* Center Left: Think2Comic */}
        <div className="col-start-1 row-start-2">
          <Link href="/comic">
            <div className="w-48 h-48 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer transform rotate-45">
              <div className="w-full h-full flex flex-col justify-center items-center transform -rotate-45">
                <img src="/comic.png" alt="Think2Comic" className="w-12 h-12 mb-2" />
                <span className="text-lg font-semibold text-gray-700">Think2Comic</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center Right: EchoMentor */}
        <div className="col-start-3 row-start-2">
          <Link href="/dashboard">
            <div className="w-48 h-48 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer transform rotate-45">
              <div className="w-full h-full flex flex-col justify-center items-center transform -rotate-45">
                <img src="/voice-assistant.png" alt="EchoMentor" className="w-12 h-12 mb-2" />
                <span className="text-lg font-semibold text-gray-700">EchoMentor</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Center: SmartLearn */}
        <div className="col-start-2 row-start-3">
          <Link href="/createCourse">
            <div className="w-48 h-48 bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer transform rotate-45">
              <div className="w-full h-full flex flex-col justify-center items-center transform -rotate-45">
                <img src="/smartstudy.png" alt="SmartLearn" className="w-12 h-12 mb-2" />
                <span className="text-lg font-semibold text-gray-700">SmartLearn</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
