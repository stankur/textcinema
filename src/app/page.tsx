import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white">
          make shit make sense
        </h1>
        <Link 
          href="/blog" 
          className="text-sm transition-colors cursor-pointer text-gray-500 hover:text-gray-300"
        >
          Blog
        </Link>
      </div>
    </div>
  )
}
