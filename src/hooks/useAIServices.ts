
import { useEffect, useRef } from 'react';
import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';

const VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // Sarah's voice ID

interface AIResponse {
  content: string;
}

export const useAIServices = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const conversation = useConversation();

  const generateContent = async (type: string): Promise<string> => {
    const prompt = getPromptForType(type);
    
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
        body: JSON.stringify({
          model: "mistral-tiny",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Store content in history
      const { data: insertData, error } = await supabase
        .from('content_history')
        .insert([
          {
            user_id: (await supabase.auth.getUser()).data.user?.id,
            content_type: type,
            content: content,
          },
        ]);

      if (error) {
        console.error('Error storing content history:', error);
      }

      return content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  const synthesizeSpeech = async (text: string): Promise<void> => {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + VOICE_ID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': `${process.env.ELEVEN_LABS_API_KEY}`,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to synthesize speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw error;
    }
  };

  const getPromptForType = (type: string): string => {
    switch (type) {
      case 'news':
        return "Generate a brief, engaging news update in a radio host style. Keep it concise and conversational.";
      case 'jokes':
        return "Tell a short, family-friendly joke in a radio host style. Make it fun and engaging.";
      case 'music':
        return "Suggest a song or artist with a brief, engaging description in a radio host style. Include why listeners might enjoy it.";
      default:
        return "Generate a brief, engaging radio host message.";
    }
  };

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    generateContent,
    synthesizeSpeech,
  };
};
