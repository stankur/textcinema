import Link from "next/link"

export default function Blog() {
  return (
    <div className="flex-1 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="text-gray-400 hover:text-white mb-8 inline-block"
        >
          Back
        </Link>
        
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
        
        <div className="space-y-8">
          <article>
            <Link href="/blog/llm-for-making-complex-information-make-sense">
              <h2 className="text-2xl font-semibold hover:text-gray-300 cursor-pointer">
                LLM + Algorithms for Natural Language Data Analytics
              </h2>
            </Link>
          </article>
        </div>
      </div>
    </div>
  )
}