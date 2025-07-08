export const useCases = {
  "youtube transcripts": {
    items: [
      "Hey everyone, welcome to my channel. Today I'm going to show you how to build a startup from scratch. The first thing you need to understand is product-market fit...",
      "In this video, I'll walk through the React useEffect hook and how to avoid infinite loops. Let's start with a basic example of fetching data...",
      "As a product manager, your main job is to bridge the gap between engineering and business. You need to understand both the technical constraints and the business goals...",
      "So I was debugging this memory leak in our Node.js application and found that we weren't properly cleaning up event listeners. Here's how I fixed it...",
      "Today we're going to talk about go-to-market strategy for B2B SaaS products. The key is to identify your ideal customer profile first..."
    ],
    suggestions: [
      "startup founders",
      "engineers", 
      "product managers"
    ],
    prompts: [
      "Does this content contain material that would be specifically relevant and valuable to startup founders? Please output your answer as a single YES/NO without metacomments.",
      "Does this content contain technical information, programming concepts, or engineering-related material? Please output your answer as a single YES/NO without metacomments.",
      "Does this content discuss product management concepts, methodologies, or responsibilities? Please output your answer as a single YES/NO without metacomments."
    ],
    // Cost estimator data
    itemCount: 5,
    avgTokensPerItem: 150,
    promptTokens: 25
  },
  "email inbox": {
    items: [
      "Hi John, thanks for reaching out about the partnership opportunity. I'd love to schedule a call next week to discuss this further. Best regards, Sarah",
      "🎉 FLASH SALE! 50% off all premium courses this weekend only! Use code SAVE50 at checkout. Limited time offer!",
      "Your account has been compromised. Click here immediately to verify your identity and secure your account. Urgent action required!",
      "Meeting reminder: Weekly standup tomorrow at 10 AM PST. Please prepare your updates on the current sprint progress.",
      "Re: Budget approval for Q1 marketing campaign. I've reviewed the proposal and have a few questions about the attribution model..."
    ],
    suggestions: [
      "need a reply",
      "advertisement",
      "likely spam"
    ],
    prompts: [
      "Does this email require a personal response or action from the recipient? Please output your answer as a single YES/NO without metacomments.",
      "Is this email primarily promotional or advertising content trying to sell a product or service? Please output your answer as a single YES/NO without metacomments.",
      "Does this email appear to be spam, phishing, or potentially fraudulent? Please output your answer as a single YES/NO without metacomments."
    ],
    // Cost estimator data
    itemCount: 5,
    avgTokensPerItem: 80,
    promptTokens: 20
  },
  "recipe list": {
    items: [
      "Grilled Salmon with Quinoa - Fresh Atlantic salmon seasoned with herbs, served with fluffy quinoa and steamed vegetables",
      "Classic Margherita Pizza - Wood-fired pizza with fresh mozzarella, basil, and San Marzano tomatoes on house-made dough",
      "Kung Pao Tofu - Crispy tofu cubes tossed in a spicy Sichuan sauce with peanuts, vegetables, and dried chilies",
      "Mediterranean Chickpea Salad - Protein-rich chickpeas with cucumber, tomatoes, red onion, and tahini dressing",
      "Beef and Broccoli Stir-fry - Tender beef strips with fresh broccoli in a savory garlic-ginger sauce over jasmine rice"
    ],
    suggestions: [
      "vegan",
      "pescatarian", 
      "Chinese food"
    ],
    prompts: [
      "Is this recipe completely vegan (contains no animal products including meat, dairy, eggs, or honey)? Please output your answer as a single YES/NO without metacomments.",
      "Is this recipe suitable for pescatarians (vegetarian diet that includes fish and seafood)? Please output your answer as a single YES/NO without metacomments.",
      "Is this recipe for Chinese cuisine or does it use primarily Chinese cooking techniques and ingredients? Please output your answer as a single YES/NO without metacomments."
    ],
    // Cost estimator data
    itemCount: 5,
    avgTokensPerItem: 60,
    promptTokens: 15
  },
  "customer feedback": {
    items: [
      "The mobile app keeps crashing when I try to upload photos. This has been happening for the past week and it's really frustrating.",
      "I love the new dashboard design! It would be awesome if you could add a dark mode option though. The bright white background strains my eyes during long work sessions.",
      "Your customer service team was incredibly helpful when I had billing questions. They resolved everything quickly and professionally.",
      "The search functionality is too slow. Sometimes it takes 10+ seconds to find what I'm looking for, which really hurts productivity.",
      "Could you please add keyboard shortcuts for common actions? As a power user, I'd love to navigate the app without always reaching for the mouse."
    ],
    suggestions: [
      "feature request",
      "bug"
    ],
    prompts: [
      "Is this customer feedback requesting a new feature, enhancement, or functionality that doesn't currently exist? Please output your answer as a single YES/NO without metacomments.",
      "Is this customer feedback reporting a bug, technical issue, or something that is broken or not working as expected? Please output your answer as a single YES/NO without metacomments."
    ],
    // Cost estimator data
    itemCount: 5,
    avgTokensPerItem: 100,
    promptTokens: 20
  }
}

export type UseCaseKey = keyof typeof useCases