// 퍼플렉시티용 간소화된 캐릭터 메타데이터 타입
export interface PerplexityCharacterVoice {
  name: string
  description: string
  age: string
  gender: string
  usecases: string[]
  styles: string[]
}

// 퍼플렉시티용 간소화된 캐릭터 보이스 메타데이터 DB
export const perplexityCharacterVoiceDB: PerplexityCharacterVoice[] = [
  {
    name: "Yepi",
    description: "",
    age: "child",
    gender: "female",
    usecases: ["meme", "game", "entertainment", "acting", "storytelling"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad", "Sleepy"]
  },
  {
    name: "Kate",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["announcement", "business", "news"],
    styles: ["Happy", "Neutral", "Urgent"]
  },
  {
    name: "Moka",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "acting", "entertainment", "storytelling", "conversational"],
    styles: ["Angry", "Confused", "Curious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Toma",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["advertisement", "acting", "conversational", "storytelling"],
    styles: ["Angry", "Curious", "Happy", "Loving", "Neutral", "Sad"]
  },
  {
    name: "Ken",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["advertisement", "humor", "acting", "short-form", "business"],
    styles: ["Angry", "Evil", "Excited", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Helga",
    description: "Helga is a grumpy witch. She has a thin and sharp voice.",
    age: "elder",
    gender: "female",
    usecases: ["game", "storytelling", "acting", "horror"],
    styles: ["Angry", "Angry +", "Disgusted", "Disgusted +", "Evil", "Evil +", "Happy", "Neutral", "Painful", "Painful +", "Sad", "Sad +"]
  },
  {
    name: "Yoonho",
    description: "Yoonho is a sarcastic and indifferent teenager. He doesn't express his emotions well.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Happy", "Happy +", "Loving", "Loving +", "Neutral", "Neutral +", "Sad", "Sad +", "Suspicious"]
  },
  {
    name: "Bert",
    description: "Bert is a sinister grandfather. He has a dynamic tone.",
    age: "elder",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Angry +", "Happy", "Happy +", "Jealous", "Jealous +", "Neutral", "Neutral +", "Sad", "Sad +"]
  },
  {
    name: "Hyewon",
    description: "Hyewon is a bright and shy but cheerful woman. She has clear emotional changes.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Amused", "Amused +", "Angry", "Angry +", "Happy", "Happy +", "Neutral", "Neutral +", "Sad", "Sad +", "Shy", "Shy +"]
  },
  {
    name: "Shade",
    description: "Shade is a self-absorbed woman in her 30s. She speaks in a condescending tone, often looking down on others.",
    age: "middle-aged",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Shouting", "Suspicious", "Unfriendly"]
  },
  {
    name: "Kiwi",
    description: "",
    age: "child",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "game"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Lang",
    description: "",
    age: "child",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "game"],
    styles: ["Angry", "Embarrassed", "Friendly", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Jun",
    description: "Jun is a young boy. He has a slightly androgynous tone and speaks in a gentle manner.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad", "Shy"]
  },
  {
    name: "Zurk",
    description: "Zurk, the mad scientist, epitomizes chaos and unpredictability with his clownish demeanor and joker-like antics. A gambler at heart, he wields poisoned daggers with cunning precision. Energetic and lunatic, he revels in his madness, driven by his twisted philosophies. In the realm of villains, Zurk is a formidable adversary, orchestrating chaos with gleeful abandon.",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Evil", "Happy", "Neutral", "Sad", "Seductive"]
  },
  {
    name: "Valiant",
    description: "Valiant, a male commander and human templar, is a formidable presence on the battlefield. His commanding voice roars with authority, rallying allies and striking fear into enemies. Valiant's strong, meaty vocalizations carry the weight of his convictions, making him a formidable leader in the fight for light and valor.",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Admiring", "Angry", "Happy", "Neutral", "Sad", "Shouting"]
  },
  {
    name: "Snar",
    description: "Snar is a husky-voiced woman with an aggressive tone.",
    age: "middle-aged",
    gender: "female",
    usecases: ["game", "storytelling", "acting", "horror"],
    styles: ["Angry", "Angry +", "Disgusted", "Disgusted +", "Happy", "Happy +", "Neutral", "Neutral +", "Sad", "Sad +", "Suspicious", "Suspicious +"]
  },
  {
    name: "Zyros",
    description: "Zyros, the male dark elf, exudes an enchanting allure and captivating charm. His sullen demeanor and narcissistic tendencies contribute to an air of mystery and self-absorption. Despite his striking beauty, there's an undeniable allure that draws others to him. Beneath this enigmatic exterior lies a vulnerability, a deep longing for genuine connection and acceptance.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Dominating", "Happy", "Neutral", "Sad", "Suspicious", "Teasing"]
  },
  {
    name: "Andy",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "review"],
    styles: ["Angry", "Friendly", "Happy", "Neutral", "Sad", "Shy"]
  },
  {
    name: "Kai",
    description: "Kai, the paladin leader, exudes charisma and inspires warriors with his passion for justice. In battle, he fights with unwavering determination and leads resolutely, maintaining a tough exterior. Even in adversity, his enthusiasm remains unyielding, fueled by unwavering loyalty to his king and kingdom.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Courageous", "Happy", "Neutral", "Sad", "Unfriendly"]
  },
  {
    name: "Andrew",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "business", "review"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad", "Shy"]
  },
  {
    name: "Eddie",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["announcement", "education", "acting"],
    styles: ["Angry", "Happy", "Kind", "Neutral", "Sad", "Worry"]
  },
  {
    name: "Keld",
    description: "Keld is a man with an indifferent and chic personality. His speech is characterized by a cold and abrupt tone.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Admiring", "Angry", "Happy", "Neutral", "Sad", "Serene", "Unfriendly"]
  },
  {
    name: "Alphonse",
    description: "Alphonse is a gentle and affectionate old man. He's familiar and informal.",
    age: "elder",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Admiring", "Admiring +", "Angry", "Angry +", "Anxious", "Anxious +", "Happy", "Happy +", "Neutral", "Sad", "Sad +"]
  },
  {
    name: "Luna",
    description: "Luna is an AI assistant with a female voice. Her tone is consistent and it's hard to perceive emotional changes.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "announcement", "news", "acting"],
    styles: ["Angry", "Anxious", "Anxious +", "Happy", "Happy +", "Neutral", "Neutral +", "Sad", "Sad +", "Shouting", "Shouting +"]
  },
  {
    name: "Sophia",
    description: "Sophia is a teenage girl. She has a submissive personality and speaks in a peaceful and gentle manner.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Admiring", "Angry", "Curious", "Happy", "Neutral", "Sad", "Sleepy"]
  },
  {
    name: "Steelyn",
    description: "Steelyn is a woman with controlled emotions and a firm, low-pitched voice. She's a soldier.",
    age: "middle-aged",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Courageous", "Happy", "Neutral", "Sad", "Suspicious", "Triumphant", "Unfriendly"]
  },
  {
    name: "Krag",
    description: "Krag, the Monster of the Mountains, is an imposing giant with fists like boulders, determined and relentless in his conquests. His overbearing presence and dense form cast a shadow over the landscape, but he lacks emotion, driven solely by a hunger for dominance.",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Disgusted", "Happy", "Neutral", "Painful", "Sad", "Shouting"]
  },
  {
    name: "Viper",
    description: "Viper is a charismatic woman. She's self-centred and composed.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Angry +", "Happy", "Neutral", "Neutral +", "Sad", "Sad +", "Seductive", "Seductive +", "Shouting", "Shouting +", "Suspicious", "Suspicious +"]
  },
  {
    name: "Anna",
    description: "Anna is a kind and gentle. She has a cute and lovely tone with a high voice.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Angry +", "Embarrassed", "Embarrassed +", "Happy", "Happy +", "Neutral", "Neutral +", "Painful", "Painful +", "Sad", "Sad +"]
  },
  {
    name: "Lily",
    description: "Lily, the Fairy Wizard, is a playful chatterbox who wields a magician's wand. Her mood swings from cheerful to moody, reflected in high-tension expressions and fast speech. Energetic and dynamic, she teases with a hint of condescension, embodying the mischievous spirit of the fairy realm.",
    age: "child",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad", "Surprised", "Teasing", "Triumphant"]
  },
  {
    name: "Miya",
    description: "Miya, the teenage librarian, exudes a calm, precocious demeanor beyond her years. Alert and half-eyed, she navigates the library's knowledge with ease. While usually steady, she can be impatient with inefficiency. When nervous, Luna speaks quickly.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Embarrassed", "Happy", "Neutral", "Painful", "Sad"]
  },
  {
    name: "Minwoo",
    description: "This voice is suitable for the speaker of promotional videos.",
    age: "middle-aged",
    gender: "male",
    usecases: ["advertisement", "narration", "documentary", "announcement", "education", "business", "news"],
    styles: ["Neutral"]
  },
  {
    name: "Leo",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "acting"],
    styles: ["Angry", "Command", "Happy", "Kind", "Neutral", "Sad"]
  },
  {
    name: "Molk",
    description: "Molk is the demonic boss of the other world, a transcendent being of immense power and dark charisma. As a master summoner, necromancer, and magician, he commands legions of infernal creatures and wields forbidden magic with hypnotic charm. Molk stands as the ultimate challenge, commanding the forces of darkness and laying waste to all who oppose him in the twisted world.",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "storytelling", "acting", "horror"],
    styles: ["Angry", "Disgusted", "Evil", "Happy", "Neutral", "Sad", "Suspicious"]
  },
  {
    name: "Arin",
    description: "Arin is a girl with a shy demeanor and a deep affinity for magic. She possesses a quiet strength, despite her introverted nature. Arin finds solace in magic and possesses a rich inner world of creativity and curiosity. While trying to be gentle and kind-hearted, she struggles to express herself fully.",
    age: "child",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Shy", "Sleepy", "Suspicious"]
  },
  {
    name: "Stel",
    description: "Stel is a blacksmith and a middle-aged man. He has a cheerful and energetic personality. He speaks very boldly, and his voice is loud.",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Courageous", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Thurn",
    description: "Thurn has a low and ringing voice. He's a sullen and cruel monster.",
    age: "elder",
    gender: "male",
    usecases: ["game", "storytelling", "acting", "horror"],
    styles: ["Angry", "Dominating", "Happy", "Neutral", "Sad", "Suspicious"]
  },
  {
    name: "Thin",
    description: "Thin has a young and neutral voice. He has a quirky but cheerful and friendly personality, and his vocal delivery sounds a bit hoarse.",
    age: "child",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Surprised"]
  },
  {
    name: "Blitz",
    description: "Blitz is a curious and lively girl. She has a lively personality and rich emotional expressions.",
    age: "child",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Angry +", "Curious", "Curious +", "Happy", "Happy +", "Jealous", "Jealous +", "Neutral", "Neutral +", "Sad", "Sad +"]
  },
  {
    name: "Misook",
    description: "",
    age: "middle-aged",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "review"],
    styles: ["Angry", "Annoyed", "Happy", "Kind", "Neutral", "Sad"]
  },
  {
    name: "Neo",
    description: "Neo, the female cyborg, is known for her mechanical precision and unwavering determination. Emotionally consistent and cyborg-like, she maintains a constant tone, navigating the complexities of the cybernetic world.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "announcement", "acting"],
    styles: ["Angry", "Blank", "Curious", "Happy", "Neutral", "Sad", "Suspicious"]
  },
  {
    name: "Kaori",
    description: "",
    age: "middle-aged",
    gender: "female",
    usecases: ["advertisement", "acting", "conversational", "storytelling", "entertainment"],
    styles: ["Angry", "Excited", "Happy", "Neutral", "Sad", "Surprised", "Suspicious"]
  },
  {
    name: "Nix",
    description: "Nix is a careless and mischievous man with a bright tone of voice.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Active", "Active +", "Angry", "Embarrassed", "Embarrassed +", "Happy", "Happy +", "Neutral", "Neutral +", "Sad", "Sad +", "Triumphant", "Triumphant +"]
  },
  {
    name: "Cedric",
    description: "Cedric, a venerable elder, epitomizes wisdom with serene neutrality. His classical demeanor and gentle nature make him a beacon for travelers in search of guidance. With decades of experience, his insights penetrate uncertainty, offering clarity and comfort to those in need.",
    age: "elder",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Courageous", "Happy", "Neutral", "Sad", "Serene"]
  },
  {
    name: "Pherena",
    description: "Pherena is an arrogant and enchanting woman. She has a subtly coercive tone.",
    age: "middle-aged",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Dominating", "Dominating +", "Happy", "Happy +", "Jealous", "Jealous +", "Neutral", "Neutral +", "Sad", "Sad +", "Teasing", "Teasing +"]
  },
  {
    name: "Pierce",
    description: "Pierce is a young man who can't stand injustice. He has few emotional fluctuations and has a serious personality.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Angry +", "Confused", "Confused +", "Happy", "Neutral", "Neutral +", "Sad", "Sad +", "Serene", "Shouting", "Shouting +"]
  },
  {
    name: "Taeho",
    description: "This voice is suitable for the voiceover of documentary videos.",
    age: "middle-aged",
    gender: "male",
    usecases: ["documentary", "narration", "education", "audiobook", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Teriel",
    description: "Teriel, the young adult elf healer, radiates kindness, warmth, and boundless compassion. With genuine interest in others, he greets all with a smile and affectionate tones. His presence brings tranquility and hope, embodying the belief in the power of kindness and caring.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Admiring", "Angry", "Happy", "Loving", "Neutral", "Sad", "Shy"]
  },
  {
    name: "Cheeky",
    description: "Cheeky is a young wizard girl who speaks in a whiny, demanding tone.",
    age: "child",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Amused", "Angry", "Evil", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Aiden",
    description: "Aiden, the youngest pilot, embodies a rare blend of prideful innocence and surprisingly mature demeanor. Despite his tender age, he navigates the virtual skies with confidence and clarity, occasionally expressing his emotions through a complaining tone. Riding a small airplane, he adds a dash of adventurous spirit to the captivating journey of travelers.",
    age: "child",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad", "Suspicious", "Triumphant"]
  },
  {
    name: "Se-A",
    description: "Se-a is a lively and cheerful girl with a confident tone. She has a cool and assertive personality.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Curious", "Happy", "Jealous", "Neutral", "Sad"]
  },
  {
    name: "Satyrus",
    description: "Satyrus is a dark and vengeful witch, fueled by years of betrayal and pain. With intense malevolence, she wields her magic to unleash curses upon her enemies, driven by a desire for revenge. Despite her evil nature, there's a seductive allure to her dark charisma, drawing others into her web of deceit and manipulation.",
    age: "middle-aged",
    gender: "female",
    usecases: ["game", "storytelling", "acting", "horror"],
    styles: ["Angry", "Confused", "Happy", "Jealous", "Neutral", "Sad", "Suspicious"]
  },
  {
    name: "Scullet",
    description: "Scullet is an unstable girl with a whimsical tone.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Angry +", "Evil", "Evil +", "Happy", "Happy +", "Neutral", "Neutral +", "Sad", "Sad +", "Shouting"]
  },
  {
    name: "Lina",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "entertainment", "storytelling", "short-form", "review"],
    styles: ["Angry", "Curious", "Happy", "Jealous", "Neutral", "Sad"]
  },
  {
    name: "Coco",
    description: "Coco is a playful and loving fairy girl with a mischievous streak. Possessing the ability to warp people into another world, she guides new travelers with a sprinkle of mischief and a dash of whimsy. She brings joy and wonder to those around her, using her laughter and gentle antics to illuminate the path ahead.",
    age: "child",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Amused", "Angry", "Curious", "Embarrassed", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Lun",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Embarrassed", "Evil", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Daeun",
    description: "Daeun is known for her boundless love and warmth, though she often finds herself in amusing situations due to her frequent mistakes. Despite these blunders, her endearing charm and genuine affection win people over, making her beloved to all who know her. Her loving nature spreads joy and laughter wherever she goes.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Surprised", "Suspicious"]
  },
  {
    name: "Min",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "entertainment"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Marie",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["audiobook", "documentary", "narration"],
    styles: ["Happy", "Neutral", "Serene", "Urgent"]
  },
  {
    name: "Jin",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["narration", "conversational", "review", "education"],
    styles: ["Neutral"]
  },
  {
    name: "Woojin",
    description: "Woojin, a teenage boy, embodies warmth, affection, and caring. He expresses a wide range of emotions with a genuine smile and a warm, soft tone. As a student, his voice reflects curiosity and eagerness to learn, maintaining a clean aesthetic. Despite his youth, Liam radiates trust and stability, providing a steady presence in the lives of those around him.",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad", "Surprised"]
  },
  {
    name: "Desphara",
    description: "Desphara is a dominant and intense ruler, exuding darkness and power. With her commanding presence and mastery of dark magic, she crushes any opposition with ruthless efficiency. Despite her fearsome reputation, her charisma attracts followers eager to bask in her shadow. In her realm, only the strongest survive against her relentless pursuit of control.",
    age: "middle-aged",
    gender: "female",
    usecases: ["game", "storytelling", "acting", "horror"],
    styles: ["Angry", "Disgusted", "Dominating", "Happy", "Neutral", "Sad", "Suspicious"]
  },
  {
    name: "Despior",
    description: "Despior is a rough and domineering demon character who likes to command.",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "storytelling", "acting", "horror"],
    styles: ["Angry", "Angry +", "Disgusted", "Disgusted +", "Evil", "Evil +", "Happy", "Neutral", "Neutral +", "Sad", "Sad +", "Suspicious", "Suspicious +"]
  },
  {
    name: "Serin",
    description: "Serin, a teenage archer, embodies purity, brightness, and confidence. Her eyes, reminiscent of sparkling emeralds, complement her glossy hair, radiating a serene neutrality and grace. Despite her unparalleled skill with the bow, she maintains a gentle compassion that illuminates even the darkest of times.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Shouting", "Suspicious"]
  },
  {
    name: "Santa",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "game", "humor"],
    styles: ["Neutral"]
  },
  {
    name: "Elin",
    description: "Elin is a strong and righteous woman. She has a dignified tone.",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Angry +", "Courageous", "Courageous +", "Disgusted", "Disgusted +", "Happy", "Neutral", "Neutral +", "Sad", "Sad +", "Suspicious", "Suspicious +"]
  },
  {
    name: "Toby",
    description: "Toby, a child goblin from the enchanted realm, exudes purity, boundless cheerfulness, and infectious positivity. His laughter reverberates through the woods, bringing joy to all who hear it. Despite his diminutive size, Toby harbors boundless kindness and a deep concern for all creatures.",
    age: "child",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Embarrassed", "Happy", "Jealous", "Neutral", "Sad", "Sleepy"]
  },
  {
    name: "Dond",
    description: "Dond, the village elder, exudes wisdom and authority with a gentlemanly demeanor. His serious and stern appearance is softened by warmth, especially towards adventurers seeking guidance. With resonant tones, he offers sage advice and practical solutions, embodying the timeless values of honor and community.",
    age: "elder",
    gender: "male",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Admiring", "Angry", "Anxious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Mason",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Surprised"]
  },
  {
    name: "Elsie",
    description: "Elsie is a stubborn grandmother. She's capricious and enjoys confrontation.",
    age: "elder",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Angry +", "Anxious", "Anxious +", "Happy", "Happy +", "Neutral", "Neutral +", "Sad", "Teasing", "Teasing +"]
  },
  {
    name: "Grace",
    description: "Grace is a middle-aged woman and an innkeeper. She is warm-hearted and very kind, and it shows in her voice.",
    age: "middle-aged",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Admiring", "Angry", "Anxious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Esther",
    description: "Esther is a warm and kind grandmother who speaks in a gentle, soothing tone.",
    age: "elder",
    gender: "female",
    usecases: ["game", "storytelling", "acting"],
    styles: ["Angry", "Anxious", "Curious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Ora",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Curious", "Disgusted", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Goro",
    description: "",
    age: "elder",
    gender: "male",
    usecases: ["meme", "game", "narration", "documentary", "audiobook", "acting", "conversational", "storytelling"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Quinn George",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "entertainment", "humor", "short-form"],
    styles: ["Angry", "Flirty", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Berry Annoying",
    description: "",
    age: "middle-aged",
    gender: "female",
    usecases: ["meme", "conversational", "humor"],
    styles: ["Annoyed"]
  },
  {
    name: "Peter",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["announcement", "education", "business"],
    styles: ["Happy", "Kind", "Neutral"]
  },
  {
    name: "Devil",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "game", "storytelling", "horror"],
    styles: ["Evil"]
  },
  {
    name: "GenZZZ",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "short-form", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Rio",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "game"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Selena",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "review", "short-form"],
    styles: ["Angry", "Happy", "Kind", "Lazy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Robert",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Happy", "Loving", "Neutral", "Sad", "Shy", "Unfriendly"]
  },
  {
    name: "Isamu",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "acting", "storytelling"],
    styles: ["Angry", "Courageous", "Happy", "Neutral", "Sad", "Unfriendly"]
  },
  {
    name: "Rikoming",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "game", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Curious", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Suho",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["announcement", "business"],
    styles: ["Kind", "Neutral"]
  },
  {
    name: "Tessa",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Unfriendly"]
  },
  {
    name: "Sam",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["announcement", "news", "business", "education"],
    styles: ["Happy", "Neutral", "Urgent"]
  },
  {
    name: "Siwoo",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Annoyed", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Jen",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["advertisement", "announcement", "business", "acting"],
    styles: ["Angry", "Curious", "Happy", "Loving", "Neutral", "Sad"]
  },
  {
    name: "Thanatos",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "acting", "horror"],
    styles: ["Angry", "Annoyed", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Timmy",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "game", "acting", "storytelling", "humor", "entertainment"],
    styles: ["Angry", "Anxious", "Curious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Tilly",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "review"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Shy"]
  },
  {
    name: "Misa",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "acting", "storytelling", "conversational"],
    styles: ["Angry", "Confused", "Courageous", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Tom",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "entertainment", "acting"],
    styles: ["Angry", "Curious", "Disgusted", "Flirty", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Watson",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["audiobook", "documentary", "narration", "education", "storytelling"],
    styles: ["Friendly", "Kind", "Neutral", "Serene"]
  },
  {
    name: "Woody",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["announcement", "education", "acting"],
    styles: ["Angry", "Happy", "Kind", "Neutral", "Sad", "Worry"]
  },
  {
    name: "Seiji",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "entertainment", "game"],
    styles: ["Angry", "Curious", "Embarrassed", "Happy", "Neutral", "Relieved", "Sad"]
  },
  {
    name: "Travis",
    description: "",
    age: "child",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "short-form", "humor"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Wayne",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "acting"],
    styles: ["Angry", "Annoyed", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Amantha",
    description: "",
    age: "child",
    gender: "female",
    usecases: ["game", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Disgusted", "Happy", "Neutral", "Sad", "Surprised"]
  },
  {
    name: "Angelina",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["audiobook", "documentary", "narration"],
    styles: ["Happy", "Neutral", "Serene"]
  },
  {
    name: "Ariel",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "entertainment", "storytelling", "short-form", "review"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Shy"]
  },
  {
    name: "Audrey",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "business", "review"],
    styles: ["Angry", "Confident", "Happy", "Neutral", "Sad", "Unfriendly"]
  },
  {
    name: "Bella",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "review", "short-form"],
    styles: ["Angry", "Disgusted", "Happy", "Kind", "Neutral", "Sad"]
  },
  {
    name: "Billy",
    description: "",
    age: "child",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "game"],
    styles: ["Angry", "Annoyed", "Happy", "Neutral", "Sad", "Shy"]
  },
  {
    name: "Bryan",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "short-form", "review"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Teasing", "Worry"]
  },
  {
    name: "Brody",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["advertisement", "audiobook", "education", "announcement", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Cindy",
    description: "",
    age: "middle-aged",
    gender: "female",
    usecases: ["narration", "documentary", "audiobook"],
    styles: ["Happy", "Neutral", "Serene"]
  },
  {
    name: "Jihu",
    description: "",
    age: "child",
    gender: "male",
    usecases: ["meme", "game", "conversational", "review", "short-form", "education"],
    styles: ["Neutral"]
  },
  {
    name: "Sota",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "entertainment", "game"],
    styles: ["Angry", "Friendly", "Happy", "Neutral", "Sad", "Shy"]
  },
  {
    name: "Dakota",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Disgusted", "Excited", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Akari",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "acting", "entertainment"],
    styles: ["Neutral"]
  },
  {
    name: "Hara",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "news"],
    styles: ["Neutral"]
  },
  {
    name: "Rudolph",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "review", "advertisement"],
    styles: ["Neutral"]
  },
  {
    name: "Father Jacob",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "storytelling", "narration"],
    styles: ["Neutral"]
  },
  {
    name: "Clown Boopy",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "conversational", "game", "humor", "short-form"],
    styles: ["Excited"]
  },
  {
    name: "Gingerbread",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "entertainment", "humor"],
    styles: ["Neutral"]
  },
  {
    name: "Mok-Sensei",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "documentary", "audiobook", "storytelling", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Anika",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational"],
    styles: ["Neutral"]
  },
  {
    name: "Hoon",
    description: "Meet Hoon, the versatile narrator perfect for audiobooks. With his calm tone, he creates a soothing backdrop for listeners across genres like self-development, education, children's stories, and novels. Hoon's voice guides personal growth, explains complex concepts, captivates young imaginations, and immerses listeners in captivating plots, providing an engaging experience.",
    age: "middle-aged",
    gender: "male",
    usecases: ["audiobook", "announcement", "documentary", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Munsik",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "humor", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Nana",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "game", "entertainment", "acting", "storytelling", "conversational"],
    styles: ["Angry", "Excited", "Happy", "Neutral", "Sad", "Surprised"]
  },
  {
    name: "Jiho",
    description: "Meet Jiho, the perfect voice for YouTube content creators. His warm and inviting tone is friendly and approachable, engaging viewers without sounding stiff. With a conversational style that feels like chatting with a close friend, Jiho fosters a sense of connection and authenticity, keeping viewers coming back for more.",
    age: "young-adult",
    gender: "male",
    usecases: ["advertisement", "education", "announcement", "conversational", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Sion",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Soulless",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Reader",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "audiobook", "documentary", "narration"],
    styles: ["Neutral"]
  },
  {
    name: "TMT",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "short-form", "review", "entertainment", "humor"],
    styles: ["Neutral"]
  },
  {
    name: "Youngja",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "entertainment", "humor", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Agatha",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["narration", "announcement", "education"],
    styles: ["Happy", "Neutral", "Serene"]
  },
  {
    name: "Yumi",
    description: "Meet Yumi, the calm announcer voice ideal for workplace and food safety content. With her soothing tone, Sarah delivers clear information, promoting safety and compliance. Her calm demeanor instills confidence and ensures effective communication of safety messages.",
    age: "middle-aged",
    gender: "female",
    usecases: ["education", "announcement", "narration", "news"],
    styles: ["Neutral"]
  },
  {
    name: "Chunsik",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "humor", "short-form", "review", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Allen",
    description: "",
    age: "elder",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Annoyed", "Happy", "Kind", "Neutral", "Sad"]
  },
  {
    name: "Hanbi",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Teasing"]
  },
  {
    name: "Mika",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["narration", "education", "news", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Aiko",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "game", "entertainment", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Nao",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["advertisement", "audiobook", "documentary", "education", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Hiro",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["education", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Aya",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["audiobook", "narration", "documentary", "education"],
    styles: ["Neutral"]
  },
  {
    name: "Rei",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "audiobook", "education", "narration", "documentary"],
    styles: ["Neutral"]
  },
  {
    name: "Gloria",
    description: "",
    age: "middle-aged",
    gender: "female",
    usecases: ["game", "acting", "storytelling"],
    styles: ["Angry", "Happy", "Kind", "Neutral", "Sad", "Suspicious"]
  },
  {
    name: "Ren",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["audiobook", "narration", "documentary", "education"],
    styles: ["Neutral"]
  },
  {
    name: "Hercules",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["advertisement", "entertainment", "short-form"],
    styles: ["Excited"]
  },
  {
    name: "Paul",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Annoyed", "Anxious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Sakura",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["education", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Hannah",
    description: "Meet Hannah, the calm and friendly announcer voice. With a soothing tone, she guides passengers through terminals and directs visitors in research facilities. Her voice is also ideal for airports and libraries. Hannah's voice provides clear and reassuring guidance, whether in the bustling atmosphere of airports or the serene ambiance of libraries.",
    age: "young-adult",
    gender: "female",
    usecases: ["announcement", "education", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Ben",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "review", "short-form", "business", "advertisement", "conversational"],
    styles: ["Neutral"]
  },
  {
    name: "Lory",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "review", "business", "advertisement", "conversational"],
    styles: ["Neutral"]
  },
  {
    name: "Lauren",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "business", "review", "short-form", "advertisement"],
    styles: ["Neutral"]
  },
  {
    name: "David",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["audiobook", "documentary", "narration", "conversational"],
    styles: ["Neutral"]
  },
  {
    name: "Adam",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Miranda",
    description: "",
    age: "middle-aged",
    gender: "female",
    usecases: ["meme", "audiobook", "narration", "documentary", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Molly",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["advertisement", "short-form", "review", "entertainment"],
    styles: ["Excited"]
  },
  {
    name: "Olivia",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "review", "short-form", "entertainment"],
    styles: ["Neutral"]
  },
  {
    name: "Stigo",
    description: "",
    age: "child",
    gender: "male",
    usecases: ["game", "conversational", "humor"],
    styles: ["Neutral"]
  },
  {
    name: "NyangNyangi",
    description: "2.1 업로드",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational"],
    styles: ["Neutral"]
  },
  {
    name: "Dorothy",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "game"],
    styles: ["Angry", "Excited", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Freddie",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Embarrassed", "Friendly", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Sora",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["narration", "audiobook", "documentary", "education"],
    styles: ["Angry", "Friendly", "Happy", "Neutral", "Relieved", "Sad"]
  },
  {
    name: "Jamie The Kid",
    description: "",
    age: "child",
    gender: "female",
    usecases: ["meme", "conversational", "storytelling"],
    styles: ["Annoyed"]
  },
  {
    name: "Dr. Donnerberg",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational"],
    styles: ["Neutral"]
  },
  {
    name: "Haru",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["game", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Shy", "Surprised"]
  },
  {
    name: "Holt",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Annoyed", "Curious", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Kuma",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "conversational", "game", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Iris",
    description: "",
    age: "child",
    gender: "female",
    usecases: ["game", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Shy", "Unfriendly"]
  },
  {
    name: "Jack",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "short-form", "review"],
    styles: ["Angry", "Embarrassed", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Tony",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Ratthew",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "conversational", "humor", "entertainment", "game"],
    styles: ["Neutral"]
  },
  {
    name: "Juliet",
    description: "",
    age: "elder",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Annoyed", "Happy", "Kind", "Neutral", "Sad"]
  },
  {
    name: "Kotaro",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "narration", "documentary", "audiobook", "conversational", "acting", "storytelling"],
    styles: ["Angry", "Embarrassed", "Friendly", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Taiki",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "conversational", "acting", "storytelling", "humor"],
    styles: ["Angry", "Excited", "Happy", "Neutral", "Sad", "Surprised"]
  },
  {
    name: "Kazuki",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["narration", "conversational", "business", "storytelling", "acting"],
    styles: ["Angry", "Happy", "Loving", "Neutral", "Relieved", "Sad"]
  },
  {
    name: "Yuka",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "review", "business"],
    styles: ["Angry", "Calm", "Happy", "Jealous", "Neutral", "Sad"]
  },
  {
    name: "Mai",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "acting", "storytelling", "short-form"],
    styles: ["Angry", "Happy", "Neutral", "Sad", "Shy", "Teasing"]
  },
  {
    name: "Wonhwa",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "horror", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Shoto",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "storytelling", "short-form"],
    styles: ["Angry", "Friendly", "Happy", "Neutral", "Sad", "Unfriendly"]
  },
  {
    name: "Diego",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["game", "acting"],
    styles: ["Angry", "Command", "Courageous", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Kenji",
    description: "",
    age: "child",
    gender: "male",
    usecases: ["meme", "conversational", "game"],
    styles: ["Excited"]
  },
  {
    name: "Riko",
    description: "",
    age: "child",
    gender: "female",
    usecases: ["meme", "conversational", "game"],
    styles: ["Annoyed"]
  },
  {
    name: "Shinji",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "advertisement", "short-form", "entertainment", "review"],
    styles: ["Excited"]
  },
  {
    name: "Hinata",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["game", "acting"],
    styles: ["Neutral"]
  },
  {
    name: "Kaito",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["narration", "conversational", "review", "education"],
    styles: ["Neutral"]
  },
  {
    name: "Yukio",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["documentary", "audiobook", "narration", "education", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Harry",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "game", "conversational", "education"],
    styles: ["Neutral"]
  },
  {
    name: "Violet",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Kevin",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["advertisement", "announcement", "business", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Honoka",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["documentary", "audiobook", "narration", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Diana",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["education", "audiobook", "narration", "documentary", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Georgia",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "review", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Tracy",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "entertainment", "game", "storytelling", "short-form", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Vince",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "review", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Garret",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["documentary", "audiobook", "narration", "education", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Nora",
    description: "",
    age: "middle-aged",
    gender: "female",
    usecases: ["announcement", "news"],
    styles: ["Neutral"]
  },
  {
    name: "Danny",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "game", "entertainment", "conversational", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Takumi",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["narration", "education", "news", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Ryota",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["advertisement", "conversational", "short-form", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Ato",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Hanuman",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "game", "storytelling", "acting"],
    styles: ["Neutral"]
  },
  {
    name: "Tara",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "game", "acting", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Bodhi",
    description: "",
    age: "child",
    gender: "male",
    usecases: ["meme", "game", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Gautama",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "documentary", "audiobook", "narration", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Orca Fondo",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "humor", "entertainment", "review", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Basilio Sahur",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "humor", "entertainment", "review", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Pista Brucia",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "humor", "entertainment", "review", "short-form"],
    styles: ["Neutral"]
  },
  {
    name: "Yannom",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "advertisement", "entertainment", "humor", "short-form", "review"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Dustin",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "announcement", "education", "audiobook", "business", "review"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Walt",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "conversational", "entertainment", "humor", "short-form", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Geomec",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "short-form", "review", "documentary"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Yejin",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "review", "short-form", "conversational", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Jiny",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "review", "short-form", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Mira",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "conversational", "advertisement", "entertainment", "humor", "business", "review"],
    styles: ["Neutral"]
  },
  {
    name: "Harrison",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["advertisement", "documentary", "narration", "audiobook", "storytelling", "business"],
    styles: ["Neutral"]
  },
  {
    name: "Rachel",
    description: "",
    age: "middle-aged",
    gender: "female",
    usecases: ["meme", "advertisement", "narration", "storytelling", "business", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Rick",
    description: "",
    age: "middle-aged",
    gender: "male",
    usecases: ["meme", "conversational", "acting", "review", "storytelling"],
    styles: ["Angry", "Embarrassed", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Evan",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "documentary", "audiobook", "storytelling", "narration", "business", "acting"],
    styles: ["Angry", "Happy", "Neutral", "Sad"]
  },
  {
    name: "Kadako",
    description: "",
    age: "young-adult",
    gender: "female",
    usecases: ["meme", "game", "horror", "storytelling"],
    styles: ["Neutral"]
  },
  {
    name: "Saza",
    description: "",
    age: "young-adult",
    gender: "male",
    usecases: ["meme", "game", "horror", "documentary", "audiobook", "storytelling"],
    styles: ["Neutral"]
  }
]
