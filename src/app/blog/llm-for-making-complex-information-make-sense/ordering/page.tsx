import Link from "next/link"
import HexagonLattice from "@/components/hexagon-lattice"

export default function OrderingPage() {
  return (
    <div className="bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/blog/llm-for-making-complex-information-make-sense" 
          className="text-gray-400 hover:text-white mb-8 inline-block"
        >
          Back to Article
        </Link>
        
        <div className="flex flex-col items-center space-y-4 mb-12">
          <HexagonLattice animateOrdering={true} />
          <h3 className="text-lg font-medium">
            Ordering
          </h3>
        </div>
      </div>
    </div>
  )
}