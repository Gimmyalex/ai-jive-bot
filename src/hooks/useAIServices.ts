
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

  const generateContent = async (type: string, customPrompt?: string): Promise<string> => {
    const prompt = customPrompt || getPromptForType(type);
    
    try {
      // Get the Mistral API key from Supabase
      const { data: mistralKeyData, error: mistralKeyError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'MISTRAL_API_KEY')
        .single();

      if (mistralKeyError) {
        console.error('Error fetching Mistral API key:', mistralKeyError);
        throw new Error('Could not retrieve Mistral API key');
      }

      if (!mistralKeyData?.value) {
        console.error('No Mistral API key found in database');
        throw new Error('No Mistral API key found');
      }

      console.log('Making request to Mistral API...');
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mistralKeyData.value}`,
        },
        body: JSON.stringify({
          model: "mistral-small-latest",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mistral API error details:', errorData);
        throw new Error(`Mistral API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Store content in history
      const { error: historyError } = await supabase
        .from('content_history')
        .insert([
          {
            user_id: (await supabase.auth.getUser()).data.user?.id,
            content_type: type,
            content: content,
          },
        ]);

      if (historyError) {
        console.error('Error storing content history:', historyError);
      }

      return content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  };

  const synthesizeSpeech = async (text: string, volume: number = 1): Promise<void> => {
    try {
      // Get the ElevenLabs API key from Supabase
      const { data: elevenLabsKeyData, error: elevenLabsKeyError } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'ELEVEN_LABS_API_KEY')
        .single();

      if (elevenLabsKeyError) {
        console.error('Error fetching ElevenLabs API key:', elevenLabsKeyError);
        throw new Error('Could not retrieve ElevenLabs API key');
      }

      if (!elevenLabsKeyData?.value) {
        console.error('No ElevenLabs API key found in database');
        throw new Error('No ElevenLabs API key found');
      }

      console.log('Making request to ElevenLabs API...');
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsKeyData.value,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('ElevenLabs API error details:', errorData);
        throw new Error(`ElevenLabs API error: ${JSON.stringify(errorData)}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = volume;
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
