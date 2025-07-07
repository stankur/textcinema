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
          className="inline-block px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
        >
          Blog
        </Link>
      </div>
    </div>
  )
}
