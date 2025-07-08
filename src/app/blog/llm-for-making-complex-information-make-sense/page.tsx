"use client"

import Link from "next/link"
import HexagonLattice from "@/components/hexagon-lattice"

export default function Article() {
  return (
    <div className="flex-1 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/blog" 
          className="text-gray-400 hover:text-white mb-8 inline-block"
        >
          Back to Blog
        </Link>
        
        <h1 className="text-4xl font-bold mb-12">
          LLM + Algorithms for Natural Language Data Analytics
        </h1>
        
        <section className="mb-16">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <HexagonLattice animateFilter={true} />
              <h3 
                className="text-lg font-medium cursor-pointer hover:text-gray-300"
                onClick={() => window.location.href = '/blog/llm-for-making-complex-information-make-sense/filtering'}
              >
                Filtering
              </h3>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}