import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Define quests data
const questsData = {
  tired: {
    meditate: [
      {
        title: "AFK Nap 💤 ",
        description: "Close your eyes and pretend you’re buffering...",
      },
      {
        title: "Cloud Watch Mode ☁️",
        description:
          "Lie down, stare at clouds, and pretend you're in a Studio Ghibli movie.",
      },
      {
        title: "Cloud Drift 🌥️",
        description:
          "Close your eyes and imagine yourself floating on a soft cloud for 5 minutes. Feel the weight leave your body.",
      },
      {
        title: "Raindrop Relief 🌧️",
        description:
          "Picture the sound of raindrops gently falling, relaxing every part of your body with each drop.",
      },
    ],
    move: [
      {
        title: "NPC Stroll 🚶‍♂️",
        description:
          "Walk around aimlessly like a background character in GTA.",
      },
      {
        title: "Stretch & Yawn 🧘‍♂️😴",
        description:
          "Do the slowest, most dramatic stretch and yawn combo ever.",
      },
      {
        title: "Sloth Stretch 🦥",
        description:
          "Stretch your body slowly like a waking sloth—big yawns encouraged!",
      },
      {
        title: "Bed-to-Fridge Journey 🛏️➡️🥶",
        description:
          "Roll out of bed, shuffle like a zombie to the fridge, and back, in the slowest possible motion.",
      },
    ],
    music: [
      {
        title: "Lofi & Vibes 🎧",
        description:
          "Play a lo-fi playlist and pretend you’re studying for an exam you *definitely* didn’t prepare for.",
      },
      {
        title: "Sad Boi Hour 🎶😔",
        description:
          "Put on a sad playlist and stare out the window like you’re in a music video.",
      },
      {
        title: "Sleepy Soundtrack 💤🎵",
        description:
          "Put on a soft, ambient track and imagine you're in a peaceful dream sequence.",
      },
    ],
    sleep: [
      {
        title: "Sleep-Deprived Core 🛏️😴",
        description:
          "Lie down and whisper 'just 5 minutes' like you *totally* won’t pass out.",
      },
      {
        title: "Dream Speedrun 🏃‍♂️💤",
        description:
          "Try to fall asleep as fast as possible. Bonus points if you lucid dream.",
      },

      {
        title: "Blanket Cocoon 🛏️🦋",
        description:
          "Wrap yourself up in a blanket and pretend you're the fluffiest caterpillar, ready to sleep through anything.",
      },
    ],
  },
  bored: {
    meditate: [
      {
        title: "Meditation for the Internet Age 📱💭",
        description: "Sit and scroll Instagram like it's your full-time job.",
      },
      {
        title: "Breathing Buddy 🌬️",
        description:
          "Find an object to stare at and focus on your breath, only when you blink, let the object move.",
      },
      {
        title: "Inner Safari 🦁🌳",
        description:
          "Meditate on the sounds and movements of an imaginary jungle. What animals do you hear?",
      },
      {
        title: "Colorful Thoughts 🎨",
        description:
          "Close your eyes and imagine different colors swirling in your mind, one for every thought.",
      },
    ],
    move: [
      {
        title: "Dramatic Walk 🚶‍♂️🎬",
        description: "Walk around like you’re in an action movie scene.",
      },
      {
        title: "Dance Party 💃🎉",
        description:
          "Find a playlist and dance like no one’s watching. Bonus points if it’s in public!",
      },
      {
        title: "Freestyle Funk 🎶🕺",
        description:
          "Put on a random song and dance however your body wants—no rules!",
      },
      {
        title: "Air Guitar Solo 🎸🤘",
        description:
          "Pretend you're playing an epic air guitar solo to your favorite song!",
      },
    ],
    music: [
      {
        title: "Sing Your Heart Out 🎤💖",
        description:
          "Find your favorite song and belt it out. Doesn't matter if you're off-key!",
      },
      {
        title: "Vibe to Chill Beats 🎧🌊",
        description:
          "Create a chill playlist and pretend you're in a feel-good montage.",
      },
      {
        title: "Surprise Shuffle 🎵✨",
        description:
          "Hit shuffle on your playlist and make up a story about the first song.",
      },
      {
        title: "Karaoke Challenge 🎤🎶",
        description:
          "Sing to the next song that plays, whether you know it or not!",
      },
    ],
    sleep: [
      {
        title: "Nap Before Sleep 🛏️💤",
        description:
          "Lay down and try to take a power nap. Just relax, no pressure.",
      },
      {
        title: "Sleep Cycle Challenge ⏰🌙",
        description: "Try to follow the perfect sleep schedule for a week.",
      },
      {
        title: "Dream Explorer 🌌💭",
        description:
          "Close your eyes and imagine you're exploring a completely new world in your dreams.",
      },
      {
        title: "Nap Mode: Activate 🛋️😴",
        description:
          "Lie down, close your eyes, and just let yourself drift into a power nap.",
      },
    ],
  },

  love: {
    meditate: [
      {
        title: "Heart Sync ❤️💓",
        description:
          "Close your eyes and focus on your heartbeat. Imagine it pulsing in sync with someone you love.",
      },
      {
        title: "Love Orbit 💕🌍",
        description:
          "Visualize your love orbiting around you like a soft, glowing light, calming your mind.",
      },
    ],
    move: [
      {
        title: "Love Strut 💃💘",
        description:
          "Walk around like you’re in a rom-com, arms swinging, smiling like you're in love.",
      },
      {
        title: "Twirl of Joy 💫💃",
        description:
          "Spin around in delight like you're dancing in the arms of your true love.",
      },
    ],
    music: [
      {
        title: "Love Letter Lyrics 💌🎶",
        description: "Pick a love song and write down your favorite line.",
      },
      {
        title: "Heartstrings Melody 🎵❤️",
        description:
          "Listen to a romantic playlist and imagine your love story unfolding.",
      },
    ],
    sleep: [
      {
        title: "Dream Date 💑🌙",
        description:
          "Visualize the most romantic dream scenario and drift into it.",
      },
      {
        title: "Cuddle Mode 🛏️💞",
        description:
          "Picture yourself curled up next to your loved one, feeling safe and warm.",
      },
    ],
  },

  dead: {
    meditate: [
      {
        title: "Corpse Mode ⚰️💀",
        description:
          "Lie down completely still in Savasana and imagine yourself dissolving into the universe.",
      },
      {
        title: "Eternal Rest 🕊️💭",
        description:
          "Breathe deeply and slowly, visualizing yourself entering a peaceful eternal slumber.",
      },
    ],
    move: [
      {
        title: "Zombie Shuffle 🧟‍♂️",
        description: "Walk around the room as a zombie. Bonus if you groan.",
      },
      {
        title: "Ghostly Glide 👻",
        description:
          "Move silently, with no effort, like you're a wandering spirit.",
      },
    ],
    music: [
      {
        title: "Haunted Echo 👻🎶",
        description: "Sing in an eerie, ghostly voice and let it fade away.",
      },
      {
        title: "Vampire Lullaby 🦇🎵",
        description:
          "Listen to dark, moody tunes and imagine being a creature of the night.",
      },
    ],
    sleep: [
      {
        title: "Rest in Peace ⚰️💤",
        description:
          "Lie still like a peaceful corpse. Focus on your breath like you're at the end of a long journey.",
      },
      {
        title: "Fading Dreams 🌙💭",
        description:
          "Imagine your thoughts fading away into nothingness as you slip into a deep sleep.",
      },
    ],
  },

  sad: {
    meditate: [
      {
        title: "Rainy Day Release 🌧️💭",
        description:
          "Visualize a gentle rain washing away your sadness. Let each drop take away a worry.",
      },
      {
        title: "Ocean of Emotions 🌊😔",
        description:
          "Close your eyes and imagine your emotions as waves. Let them come and go.",
      },
    ],
    move: [
      {
        title: "Slow Motion Steps 🐢",
        description:
          "Walk around the room in slow motion, mimicking your sadness with each step.",
      },
      {
        title: "Heavy Heart Walk 💔🚶‍♂️",
        description:
          "Walk with exaggerated steps, as if you’re carrying the weight of the world.",
      },
    ],
    music: [
      {
        title: "Melancholy Mix 🎶😞",
        description:
          "Create a playlist of the saddest songs and let yourself feel everything.",
      },
      {
        title: "Tearful Tunes 😢🎵",
        description:
          "Play a sad song and just let yourself cry, if you need to.",
      },
    ],
    sleep: [
      {
        title: "Comfort Cocoon 🛏️🥺",
        description: "Wrap yourself in a blanket like a burrito and feel safe.",
      },
      {
        title: "Restful Tears 😔💤",
        description:
          "Close your eyes, focus on your breath, and let your emotions settle as you drift off to sleep.",
      },
    ],
  },

  angry: {
    meditate: [
      {
        title: "Volcano to Pebble 🌋",
        description:
          "Breathe in, feel your anger as a raging volcano. Exhale, shrinking it into a small, smooth pebble.",
      },
      {
        title: "Mindful Fury 🔥💭",
        description:
          "Focus on your anger for 2 minutes, then slowly release it with each breath.",
      },
    ],
    move: [
      {
        title: "Punch the Air 🥊",
        description:
          "Throw imaginary punches at the air while exhaling forcefully.",
      },
      {
        title: "Kick It Out 👣💢",
        description: "Perform some high-intensity kicks to channel your anger.",
      },
    ],
    music: [
      {
        title: "Anger Anthem ⚡🎶",
        description:
          "Put on a song that gets your blood pumping and scream along.",
      },
      {
        title: "Shatter the Silence 🎸🔥",
        description:
          "Listen to intense, heavy music and let it match the intensity of your anger.",
      },
    ],
    sleep: [
      {
        title: "Storm to Stillness ⛈️",
        description:
          "Picture a raging storm in your mind, then imagine it slowly calming down.",
      },
      {
        title: "Power Down 🛏️💤",
        description:
          "Close your eyes, focus on your breath, and imagine everything around you becoming calm.",
      },
    ],
  },

  silly: {
    meditate: [
      {
        title: "Giggly Breaths 🤪",
        description:
          "Inhale deeply, exhale with a tiny giggle. Keep going until you're laughing for real.",
      },
      {
        title: "Laughter Meditation 😂🧘",
        description:
          "Sit still and just laugh for no reason, letting the giggles become your meditation.",
      },
    ],
    move: [
      {
        title: "Jellyfish Mode 🌊🐙",
        description:
          "Wiggle your arms and legs like a jellyfish floating through water.",
      },
      {
        title: "Silly Walks 🚶‍♂️🤪",
        description:
          "Try walking around with the silliest, most exaggerated steps you can imagine.",
      },
    ],
    music: [
      {
        title: "Chipmunk Mode 🐿️",
        description:
          "Sing a random song in the highest, silliest voice you can.",
      },
      {
        title: "Silly Soundtrack 🎶🤣",
        description: "Play a goofy tune and dance like you're in a cartoon.",
      },
    ],
    sleep: [
      {
        title: "Dream Giggle 😴😆",
        description:
          "Think of something ridiculously funny before drifting off, so your dreams are full of laughter.",
      },
      {
        title: "Pillow Prank 🛏️🤡",
        description:
          "Before you fall asleep, imagine that your pillow is secretly alive and making funny noises.",
      },
    ],
  },

  overwhelmed: {
    meditate: [
      {
        title: "🎈 Balloon Release",
        description:
          "Visualize each stressor as a balloon and let them float away one by one.",
      },
      {
        title: "🌬️ Breath of Control",
        description:
          "Take deep breaths in, hold, and slowly exhale, imagining your stress melting away.",
      },
    ],
    move: [
      {
        title: "💃 Shake It Off",
        description:
          "Shake every part of your body one at a time like a wet dog.",
      },
      {
        title: "🌪️ Tornado Spin",
        description:
          "Spin in place three times, then stop and breathe deeply as if you've escaped the storm.",
      },
    ],
    music: [
      {
        title: "🎶 One Sound at a Time",
        description:
          "Listen to a song, but focus on only one instrument at a time.",
      },
      {
        title: "🎧 Chill Tunes",
        description:
          "Play calming music and focus on how each note makes you feel more relaxed.",
      },
    ],
    sleep: [
      {
        title: "🛏️ Weighted Blanket Mode",
        description: "Imagine a warm, calming weight pressing you into sleep.",
      },
      {
        title: "🛌 Mindful Drift",
        description:
          "Focus on each body part from head to toe, releasing tension with every exhale.",
      },
    ],
  },

  confused: {
    meditate: [
      {
        title: "🌀 Mind Maze",
        description:
          "Imagine walking through a maze in your mind. Take deep breaths as you slowly find your way out.",
      },
      {
        title: "❓ Mystery Focus",
        description:
          "Close your eyes, focus on your breath, and let your wandering thoughts settle into clarity.",
      },
    ],
    move: [
      {
        title: "🧭 Spinning Compass",
        description:
          "Spin in place three times and see which way you feel like going.",
      },
      {
        title: "🤷‍♂️ Confused Shuffle",
        description:
          "Walk around in a random direction like you’re lost in a maze.",
      },
    ],
    music: [
      {
        title: "🔄 Reverse Listening",
        description:
          "Listen to a song backward and guess what it originally was.",
      },
      {
        title: "🎵 Dizzying Notes",
        description:
          "Play a random playlist and listen for the most unexpected sounds.",
      },
    ],
    sleep: [
      {
        title: "💭 Dream Decoder",
        description:
          "Think about a weird dream you’ve had and try to interpret it.",
      },
      {
        title: "☁️ Cloudy Thoughts",
        description:
          "Lay down, and let your mind drift like a cloud, going wherever it feels.",
      },
    ],
  },

  meh: {
    meditate: [
      {
        title: "😐 Bland Calm",
        description:
          "Sit still for 5 minutes, focusing on breathing, and try not to feel anything too strongly.",
      },
      {
        title: "🌫️ Neutral Zone",
        description:
          "Focus on the space around you, noticing the little details without getting attached to them.",
      },
    ],
    move: [
      {
        title: "🚶‍♂️ Walking Stick",
        description:
          "Walk aimlessly around your space like you’re just passing through.",
      },
      {
        title: "🐢 Sloth Mode",
        description:
          "Move slowly and without enthusiasm, like you’re a sloth just trying to get through the day.",
      },
    ],
    music: [
      {
        title: "🎶 Ambient Soundscape",
        description:
          "Play soft ambient music and let it fade into the background.",
      },
      {
        title: "🌙 Lullaby Drift",
        description:
          "Put on a mellow tune and let it wash over you like a lullaby, no pressure to feel anything.",
      },
    ],
    sleep: [
      {
        title: "😴 Yawning Drift",
        description:
          "Lay down, yawn, and slowly close your eyes. Let yourself fall asleep however it happens.",
      },
      {
        title: "🌀 Empty Mind",
        description:
          "Clear your mind completely, like you're emptying a cup. Let whatever happens next just happen.",
      },
    ],
  },

  chill: {
    meditate: [
      {
        title: "🌊 Ocean Waves",
        description:
          "Sit back and visualize yourself sitting by the ocean, feeling the breeze and hearing the waves.",
      },
      {
        title: "🌴 Peaceful Place",
        description:
          "Imagine your perfect chill spot and focus on the calm sounds and vibes of that space.",
      },
    ],
    move: [
      {
        title: "🕺 Slow Motion Mode",
        description:
          "Move in extreme slow motion for one full minute, letting every movement feel smooth and peaceful.",
      },
      {
        title: "💆 Gentle Flow",
        description:
          "Do some light stretches, gently flowing from one stretch to another with no rush.",
      },
    ],
    music: [
      {
        title: "🎧 Lo-Fi Vibes",
        description:
          "Play a lo-fi playlist and vibe out with closed eyes, letting the mellow beats take over.",
      },
      {
        title: "🌊 Chillwave Zone",
        description:
          "Find a relaxing playlist with chillwave music and let it take you into a mellow space.",
      },
    ],
    sleep: [
      {
        title: "🌙 Wave Calm",
        description:
          "Imagine yourself floating on a gentle wave, rocking back and forth to sleep.",
      },
      {
        title: "☁️ Cloud Floating",
        description:
          "Picture yourself resting on a cloud, floating slowly through a clear blue sky.",
      },
    ],
  },

  cute: {
    meditate: [
      {
        title: "🐰 Fluffy Cloud Hug",
        description:
          "Picture yourself being hugged by the fluffiest, cutest creature you can imagine.",
      },
      {
        title: "🐾 Puppy Breath",
        description:
          "Take slow, soft breaths like you’re a calm, content puppy.",
      },
    ],
    move: [
      {
        title: "🐕 Puppy Bounce",
        description:
          "Hop up and down like an excited puppy greeting its owner.",
      },
      {
        title: "🐾 Kitten Stroll",
        description:
          "Move with light, bouncy steps like a kitten exploring its world.",
      },
    ],
    music: [
      {
        title: "🎤 Kawaii Karaoke",
        description:
          "Sing a cute song in an even cuter voice! Add little ‘nyas’ or ‘boops’ for extra fun.",
      },
      {
        title: "🧸 Snuggle Tunes",
        description:
          "Play a sweet, soft melody that makes you feel cozy, like you're curled up with a soft blanket.",
      },
    ],
    sleep: [
      {
        title: "🛏️ Cuddle Mode",
        description:
          "Wrap yourself up in blankets like a burrito, snuggling in for the coziest sleep.",
      },
      {
        title: "🐶 Dream Puppy",
        description:
          "Picture yourself chasing after a cute puppy in your dream, running through fields of flowers.",
      },
    ],
  },

  motivated: {
    meditate: [
      {
        title: "💪 Power Focus",
        description:
          "Sit up straight, close your eyes, and focus on your strengths. Feel your motivation growing.",
      },
      {
        title: "🏆 Visualize Success",
        description:
          "Visualize yourself achieving your goals. Feel the excitement and energy of that moment.",
      },
    ],
    move: [
      {
        title: "🦸‍♀️ Superhero Pose",
        description:
          "Stand tall, chest out, hands on hips. Feel the power surge and your motivation skyrocket!",
      },
      {
        title: "🎯 Victory March",
        description:
          "Take a few steps with purpose, imagining you’re walking toward your next victory.",
      },
    ],
    music: [
      {
        title: "🎶 Anthem Mode",
        description:
          "Play an empowering song and walk like you’re in a movie montage, ready to take on the world.",
      },
      {
        title: "🌟 Rise & Shine",
        description:
          "Pick a song that energizes you and imagine it’s the soundtrack to your success.",
      },
    ],
    sleep: [
      {
        title: "💡 Goal-Oriented Dream",
        description:
          "Before you sleep, visualize achieving your biggest goal in a dream scenario.",
      },
      {
        title: "⏳ Dream Hustle",
        description:
          "Set your intention before sleep—imagine your dream self working hard and making progress.",
      },
    ],
  },

  joyful: {
    meditate: [
      {
        title: "❤️ Radiant Heart",
        description:
          "Sit quietly, focus on your heart, and imagine it glowing with warmth and happiness.",
      },
      {
        title: "🙏 Gratitude Calm",
        description:
          "Think of three things you’re thankful for, feeling joy with every thought.",
      },
    ],
    move: [
      {
        title: "💃 Jolly Dance",
        description:
          "Put on your favorite happy song and dance like no one’s watching.",
      },
      {
        title: "🎉 Happy Hops",
        description:
          "Jump around with joy, letting the excitement flow through you.",
      },
    ],
    music: [
      {
        title: "🎶 Feel-Good Tunes",
        description:
          "Play upbeat songs that make you smile and sing along, feeling the joy in every note.",
      },
      {
        title: "🥳 Celebration Vibes",
        description:
          "Put on your favorite party track and dance around like it’s a celebration.",
      },
    ],
    sleep: [
      {
        title: "🎊 Dream Party",
        description:
          "Imagine you’re at the happiest party in your dreams, surrounded by laughter and fun.",
      },
      {
        title: "😊 Joyful Drift",
        description:
          "Close your eyes and let the joy from your day flow into your dreams.",
      },
    ],
  },
  // Add more emotions and their quests here
};

// Function to add quests to Firestore
export const addQuestsToFirestore = async () => {
  for (const emotion in questsData) {
    const emotionData = questsData[emotion];

    // Create or overwrite the document for each emotion
    const docRef = doc(db, "quests", emotion);

    // Add or update the data in Firestore
    await setDoc(docRef, emotionData, { merge: true });

    console.log(`Added/Updated quests for emotion: ${emotion}`);
  }
};
