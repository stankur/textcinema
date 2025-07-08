import Link from "next/link"
import HexagonLattice from "@/components/hexagon-lattice"
import FilteringDemo from "@/components/filtering-demo"
import CostEstimator from "@/components/cost-estimator"

export default function FilteringPage() {
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
          <HexagonLattice animateFilter={true} />
          <h3 className="text-lg font-medium">
            Filtering
          </h3>
        </div>
        
        <div className="max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-8">Introduction</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Filtering is a common process we do when we are organizing information. We have a large set of items and we want to take only those that fit some criteria.
              </p>
              <p>
                It gets challenging when we want to filter based on a criteria that is not immediately accessible by code, and needs some human knowledge to assess.
              </p>
              <p>
                For example if we have a list of grocery item and we want to find out the ones that are suitable for vegan. This is hard to do purely with algorithm since we need to know what the ingredients of a grocery item is, and we need to know whether each ingredient is vegan.
              </p>
            </div>
          </section>

          <section>
            <div className="my-20">
              <FilteringDemo />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-10">Estimating costs</h2>
            <div className="space-y-4 text-gray-300 mb-6">
              <p>
                LLM based operations are indeterministic and often hard to estimate for costs. However, it is very easy to estimate costs for filtering.
              </p>
              <p>
                We know the <strong># tokens we pass to LLM</strong>, we know <strong># tokens of the output</strong> (simple YES/NO), and we know the <strong>price per input token</strong> and <strong>price per output token</strong> per LLM model. Hence, we can calculate the total price beforehand.
              </p>
              <p>For the demo above, here are the costs.</p>
            </div>
            <div className="my-20">
              <CostEstimator />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-8">Quality assurance</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                LLMs are nondeterministic, and the major concerns for using it for filtering are inconsistencies and inaccuracy. This is especially true for filters which are subjective, or complex.
              </p>
              <p>
                We can mitigate this by evaluating against a dataset that is manually labeled by ourselves, to measure how closely it aligns with our expectations, with simple metrics like precision and recall.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-8">Preventing overfit</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Concerns for the small dataset for prompt iteration is overfitting. This likely stems from training classical ML models, where we update weights algorithmically, with no human judgement.
              </p>
              <p>
                Iterating prompts for better filtering can actually be less prone to overfitting than ML model training.
              </p>
              <p>
                A good way to tell the LLM to output its reasons for its prediction. Then you can collect its reasons from the false predictions, and inspect.
              </p>
              <p>
                A smell of overfitting comes from specifying in the prompt, &ldquo;if the input is like this, please output this&rdquo;. Instead of fixing the LLM on a case by case basis, it would be better to uncover patterns from the reasoning of the LLM. It often uncovers missing context in the prompt.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
