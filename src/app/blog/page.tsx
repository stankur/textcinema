import Link from "next/link"

export default function Blog() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="text-gray-400 hover:text-white mb-8 inline-block"
        >
          Back
        </Link>
        
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
        
        <div className="space-y-8">
          <article className="border-b border-gray-800 pb-8">
            <Link href="/blog/llm-for-making-complex-information-make-sense">
              <h2 className="text-2xl font-semibold mb-4 hover:text-gray-300 cursor-pointer">
                LLM for making complex information make sense
              </h2>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Coming soon...
            </p>
          </article>
        </div>
      </div>
    </div>
  )
}