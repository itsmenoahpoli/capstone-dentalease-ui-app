import { OPENAI_CONFIG } from "@/config/openai.config";

const { BASE_URL, API_KEY } = OPENAI_CONFIG;

type ChatContextItem = {
  question: string;
  answer: string;
};

type GetResponseOptions = {
  userMessage: string;
  contextData: ChatContextItem[];
  openAiApiKey?: string;
};

export const contextData: ChatContextItem[] = [
  {
    question: "What is DentalEase?",
    answer:
      "DentalEase is a comprehensive dental clinic management system designed to streamline dental practice operations. It offers appointment scheduling, patient records management, billing, and administrative tools to help dental professionals provide better patient care.",
  },
  {
    question: "What services does DentalEase offer?",
    answer:
      "DentalEase offers a wide range of dental services including:\n\n• General dentistry and check-ups\n• Cosmetic dentistry\n• Orthodontics and braces\n• Oral surgery\n• Emergency dental care\n• Preventive care and cleanings\n• X-rays and diagnostic services",
  },
  {
    question: "How can I book an appointment?",
    answer:
      "To book an appointment:\n\n1. Visit our website or mobile app\n2. Click on 'Book Appointment'\n3. Select your preferred date and time\n4. Choose the type of service you need\n5. Fill in your contact information\n6. Confirm your booking\n\nYou'll receive a confirmation email and SMS with your appointment details.",
  },
  {
    question: "What are the available payment methods?",
    answer:
      "DentalEase accepts various payment methods for your convenience:\n\n• Cash payments\n• Credit/Debit cards\n• Health insurance coverage\n• Payment plans and financing options\n• Online payments through our secure portal",
  },
  {
    question: "What are your operating hours?",
    answer:
      "Our dental clinic operates:\n\n• Monday to Friday: 8:00 AM - 6:00 PM\n• Saturday: 9:00 AM - 4:00 PM\n• Sunday: Closed\n\nEmergency appointments are available outside regular hours for urgent dental care.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "Yes, we accept most major dental insurance plans. Please bring your insurance card and ID to your appointment. We'll verify your coverage and help you understand your benefits and any out-of-pocket costs.",
  },
  {
    question: "What should I bring to my first appointment?",
    answer:
      "For your first appointment, please bring:\n\n• Photo ID\n• Insurance card (if applicable)\n• List of current medications\n• Previous dental records (if available)\n• Emergency contact information\n\nPlease arrive 15 minutes early to complete registration forms.",
  },
  {
    question: "How do I cancel or reschedule an appointment?",
    answer:
      "To cancel or reschedule your appointment:\n\n• Call our office at least 24 hours in advance\n• Use our online patient portal\n• Send us a message through our website\n• Contact us via email\n\nWe appreciate advance notice to accommodate other patients.",
  },
];

export async function getChatResponse({
  userMessage,
}: GetResponseOptions): Promise<string> {
  const normalizedMessage = userMessage.trim().toLowerCase();

  if (
    normalizedMessage.includes("appointment") &&
    normalizedMessage.includes("date")
  ) {
    return await checkAppointmentDate(userMessage);
  }

  const exactMatch = contextData.find(
    (item) => item.question.trim().toLowerCase() === normalizedMessage
  );

  if (exactMatch) return exactMatch.answer;

  const partialMatch = contextData.find((item) =>
    normalizedMessage.includes(item.question.toLowerCase())
  );

  if (partialMatch) return partialMatch.answer;

  if (API_KEY) {
    return await fetchGptResponse(userMessage, contextData);
  }

  return "Sorry, I couldn't find an answer to your question. Try rephrasing or ask something else.";
}

async function checkAppointmentDate(userMessage: string): Promise<string> {
  try {
    const dateMatch = userMessage.match(
      /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b/
    );

    if (!dateMatch) {
      return "Please provide a specific date for your appointment query. For example: 'Is March 15, 2024 available for an appointment?'";
    }

    const date = new Date(dateMatch[0]);

    if (isNaN(date.getTime())) {
      return "I couldn't understand the date format. Please use MM/DD/YYYY or YYYY-MM-DD format.";
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date < tomorrow) {
      return "Sorry, we cannot schedule appointments for today or past dates. Please choose a future date.";
    }

    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) {
      return "We are closed on Sundays. Please choose a different date for your appointment.";
    }

    const isWeekend = dayOfWeek === 6;
    const hour = date.getHours();

    if (isWeekend && (hour < 9 || hour >= 16)) {
      return "On Saturdays, we are only available from 9:00 AM to 4:00 PM. Please choose a different time.";
    }

    if (!isWeekend && (hour < 8 || hour >= 18)) {
      return "On weekdays, we are available from 8:00 AM to 6:00 PM. Please choose a time within our operating hours.";
    }

    return `Great! ${date.toLocaleDateString()} appears to be available for an appointment. Our team will confirm the exact time slot when you contact us. You can book this appointment through our website or by calling our office.`;
  } catch (error) {
    return "I encountered an error while checking the appointment date. Please try again or contact our office directly.";
  }
}

async function fetchGptResponse(
  userMessage: string,
  contextData: ChatContextItem[]
): Promise<string> {
  const contextAsText = contextData
    .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");

  const prompt = `You are a helpful dental clinic assistant for DentalEase. Only answer using the following data and be friendly and professional:\n\n${contextAsText}\n\nUser: ${userMessage}\nAssistant:`;

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful dental clinic assistant for DentalEase. Be friendly, professional, and only use the provided context information.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return (
      json?.choices?.[0]?.message?.content?.trim() ||
      "Apologies, I don't have the information to answer this query. Please contact our office directly for assistance."
    );
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm having trouble connecting to our knowledge base. Please try again or contact our office directly for assistance.";
  }
}
