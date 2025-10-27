export interface ChatResponse {
  trigger: string[];
  response: string;
  type: 'general' | 'emergency' | 'safety_query' | 'route';
}

export const chatbotResponses: ChatResponse[] = [
  {
    trigger: ['hello', 'hi', 'hey', 'greetings'],
    response: "Hello! I'm your Women's Safety Assistant. I'm here to help keep you safe. You can ask me about safe routes, nearby safe places, or if you feel unsafe, just let me know.",
    type: 'general'
  },
  {
    trigger: ['help', 'sos', 'emergency', 'danger', 'scared', 'unsafe'],
    response: "I'm here with you. Stay calm. I'm locating the nearest police station and safe place. Would you like me to call emergency services (Dial 112) or your emergency contact?",
    type: 'emergency'
  },
  {
    trigger: ['follow', 'following', 'someone following'],
    response: "Stay calm and act confident. Walk towards a well-lit, crowded area. Don't go home if you're being followed. I'm finding the nearest police station for you. Would you like me to alert your emergency contacts?",
    type: 'emergency'
  },
  {
    trigger: ['safe route', 'route to', 'directions', 'navigate', 'how to reach'],
    response: "I'll help you find the safest route. Please share your destination, and I'll avoid unsafe areas and show you well-lit paths with good foot traffic.",
    type: 'route'
  },
  {
    trigger: ['is it safe', 'safe area', 'safe to go', 'safety'],
    response: "I'll check the safety information for that area. Which location would you like me to check?",
    type: 'safety_query'
  },
  {
    trigger: ['police', 'police station', 'nearest police'],
    response: "Let me find the nearest police station to your current location.",
    type: 'safety_query'
  },
  {
    trigger: ['alone', 'feel alone', 'lonely', 'scared alone'],
    response: "You're not alone, I'm here with you. Would you like me to: 1) Show you nearby safe places 2) Find the nearest police station 3) Alert your emergency contacts? Just let me know.",
    type: 'general'
  },
  {
    trigger: ['late night', 'night', 'dark', 'after dark'],
    response: "Traveling at night requires extra caution. I recommend: 1) Use well-lit main roads 2) Stay in areas with foot traffic 3) Share your live location with trusted contacts. Would you like me to show safe routes?",
    type: 'general'
  },
  {
    trigger: ['harassment', 'harass', 'bothering', 'uncomfortable'],
    response: "I'm sorry you're experiencing this. Your safety is priority. Move to a crowded area if possible. Document details if safe to do so. Would you like me to: 1) Call emergency services 2) Alert your contacts 3) Guide you to nearest police station?",
    type: 'emergency'
  },
  {
    trigger: ['taxi', 'cab', 'auto', 'ride'],
    response: "Safety tips for rides: 1) Share ride details with someone 2) Check driver's license plate matches app 3) Sit behind driver 4) Keep phone charged and handy. Track your route and stay alert.",
    type: 'general'
  },
  {
    trigger: ['thank', 'thanks', 'appreciate'],
    response: "You're very welcome! Your safety is my priority. I'm always here whenever you need me. Stay safe!",
    type: 'general'
  },
  {
    trigger: ['call', 'phone', 'contact'],
    response: "I can help you make emergency calls. Would you like to call: 1) Police (100/112) 2) Women's Helpline (181) 3) Your emergency contact?",
    type: 'emergency'
  },
  {
    trigger: ['where am i', 'location', 'my location'],
    response: "Let me check your current location and nearby safety information.",
    type: 'safety_query'
  }
];

export function findBestResponse(userMessage: string): ChatResponse | null {
  const lowerMessage = userMessage.toLowerCase();

  for (const response of chatbotResponses) {
    for (const trigger of response.trigger) {
      if (lowerMessage.indexOf(trigger) !== -1) {
        return response;
      }
    }
  }

  return null;
}

export const distressKeywords = [
  'help', 'sos', 'emergency', 'danger', 'scared', 'unsafe',
  'following', 'follow me', 'harassment', 'harass',
  "don't feel safe", "i don't feel safe", 'not safe'
];

export function detectDistressKeyword(text: string): boolean {
  const lowerText = text.toLowerCase();
  return distressKeywords.some(keyword => lowerText.indexOf(keyword) !== -1);
}
