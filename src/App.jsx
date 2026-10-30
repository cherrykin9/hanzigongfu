import { useState, useEffect, useRef } from "react";
import { Flame, Zap, Volume2, ArrowRight, ArrowLeft, Check, X, Home as HomeIcon, Swords, Sparkles, Users, Headphones, Timer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const TOKENS = {
  bg: "#FFEFD1",
  card: "#FFFDF7",
  ink: "#241C15",
  inkSoft: "#6B5A47",
  coral: "#E8402F",
  coralDark: "#C42D1E",
  jade: "#159A63",
  jadeLight: "#D8F3E6",
  gold: "#FFB627",
  sky: "#2FA9E0",
  blush: "#FFD9CE",
  spirit: "#8B5CF6",
  spiritLight: "#EDE4FF",
};

const FONT = "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif";

const DOT_BG = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(36,28,21,0.06) 0, rgba(36,28,21,0.06) 1.5px, transparent 1.5px, transparent 26px), repeating-linear-gradient(-45deg, rgba(36,28,21,0.06) 0, rgba(36,28,21,0.06) 1.5px, transparent 1.5px, transparent 26px)",
};
const DOT_BG_DARK = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1.5px, transparent 1.5px, transparent 26px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1.5px, transparent 1.5px, transparent 26px)",
};

const BELTS = [
  { name: "White Belt", color: "#EDE7D9" },
  { name: "Yellow Belt", color: "#FFC93C" },
  { name: "Green Belt", color: "#159A63" },
  { name: "Blue Belt", color: "#2FA9E0" },
  { name: "Red Belt", color: "#E8402F" },
  { name: "Black Belt", color: "#241C15" },
];
function getBelt(masteredCount) {
  const idx = Math.min(Math.floor(masteredCount / 5), BELTS.length - 1);
  return { ...BELTS[idx], idx };
}
function masteredCountOf(progress) {
  return Object.keys(progress.words || {}).filter((id) => progress.words[id].level >= 4).length;
}

const SKIN_TONES = { light: "#F5D0A9", medium: "#E0A972", tan: "#C68642", deep: "#8D5524" };
const HAIR_COLORS = { black: "#241C15", brown: "#6B4226", blue: "#2FA9E0", silver: "#C7C7C7" };
const OUTFIT_COLORS = { red: "#E8402F", blue: "#2FA9E0", green: "#159A63", gold: "#FFB627", black: "#241C15" };
const HEADBAND_COLORS = { red: "#E8402F", white: "#FFFDF7", gold: "#FFB627", purple: "#8B5CF6" };
const CAPE_COLORS = { red: "#E8402F", gold: "#FFB627" };
const WEAPON_ICON = { none: "✋", sword: "🗡️", nunchaku: "🪃", staff: "🦯", fan: "🪭" };

const SHOP = {
  hair: [{ id: "black", cost: 0 }, { id: "brown", cost: 20 }, { id: "blue", cost: 40 }, { id: "silver", cost: 60 }],
  outfit: [{ id: "red", cost: 0 }, { id: "blue", cost: 30 }, { id: "green", cost: 30 }, { id: "gold", cost: 50 }, { id: "black", cost: 80 }],
  headband: [{ id: "red", cost: 0 }, { id: "white", cost: 20 }, { id: "gold", cost: 40 }, { id: "purple", cost: 60 }],
  weapon: [{ id: "none", cost: 0 }, { id: "sword", cost: 40 }, { id: "nunchaku", cost: 60 }, { id: "staff", cost: 60 }, { id: "fan", cost: 50 }],
  cape: [{ id: "none", cost: 0 }, { id: "red", cost: 50 }, { id: "gold", cost: 90 }],
};
const COLOR_MAPS = { hair: HAIR_COLORS, outfit: OUTFIT_COLORS, headband: HEADBAND_COLORS, cape: CAPE_COLORS };

function defaultProgress() {
  return {
    words: {},
    streak: 0,
    lastActiveDate: null,
    totalStars: 0,
    bossHistory: {},
    history: [],
    unlocked: { outfit: ["red"], headband: ["red"], hair: ["black"], weapon: ["none"], cape: ["none"] },
    equipped: { skin: "medium", outfit: "red", headband: "red", hair: "black", weapon: "none", cape: "none" },
    enabledUnits: null, // null = all lessons in play; otherwise an array of enabled unit names
  };
}

const WORDS = [
  // 第一课 Lesson 1
  { id: "w1", unit: "Lesson 1", hanzi: "衣", pinyin: "yī", meaning: "clothes", example: "我穿新衣。", exampleMeaning: "I am wearing new clothes." },
  { id: "w2", unit: "Lesson 1", hanzi: "鱼", pinyin: "yú", meaning: "fish", example: "我喜欢吃鱼。", exampleMeaning: "I like eating fish." },
  { id: "w3", unit: "Lesson 1", hanzi: "雨", pinyin: "yǔ", meaning: "rain", example: "外面在下雨。", exampleMeaning: "It's raining outside." },
  { id: "w4", unit: "Lesson 1", hanzi: "一", pinyin: "yī", meaning: "one", example: "我有一本书。", exampleMeaning: "I have one book." },
  { id: "w5", unit: "Lesson 1", hanzi: "二", pinyin: "èr", meaning: "two", example: "我排第二。", exampleMeaning: "I am second in line." },
  { id: "w6", unit: "Lesson 1", hanzi: "五", pinyin: "wǔ", meaning: "five", example: "我五岁了。", exampleMeaning: "I am five years old." },
  { id: "w7", unit: "Lesson 1", hanzi: "耳", pinyin: "ěr", meaning: "ear", example: "我的耳朵很大。", exampleMeaning: "My ears are big." },
  { id: "w8", unit: "Lesson 1", hanzi: "牙", pinyin: "yá", meaning: "tooth", example: "我要刷牙。", exampleMeaning: "I need to brush my teeth." },
  { id: "w9", unit: "Lesson 1", hanzi: "口", pinyin: "kǒu", meaning: "mouth", example: "张开口。", exampleMeaning: "Open your mouth." },
  { id: "w10", unit: "Lesson 1", hanzi: "人", pinyin: "rén", meaning: "person", example: "他是好人。", exampleMeaning: "He is a good person." },
  // 第二课 Lesson 2
  { id: "w11", unit: "Lesson 2", hanzi: "木", pinyin: "mù", meaning: "wood", example: "这是木头做的。", exampleMeaning: "This is made of wood." },
  { id: "w12", unit: "Lesson 2", hanzi: "土", pinyin: "tǔ", meaning: "soil", example: "花盆里有土。", exampleMeaning: "There's soil in the flowerpot." },
  { id: "w13", unit: "Lesson 2", hanzi: "马", pinyin: "mǎ", meaning: "horse", example: "他骑着马。", exampleMeaning: "He is riding a horse." },
  { id: "w14", unit: "Lesson 2", hanzi: "八", pinyin: "bā", meaning: "eight", example: "我八岁了。", exampleMeaning: "I am eight years old." },
  { id: "w15", unit: "Lesson 2", hanzi: "巴", pinyin: "bā", meaning: "(in 尾巴, tail)", example: "小狗摇尾巴。", exampleMeaning: "The puppy wags its tail." },
  { id: "w16", unit: "Lesson 2", hanzi: "你", pinyin: "nǐ", meaning: "you", example: "你好吗？", exampleMeaning: "How are you?" },
  { id: "w17", unit: "Lesson 2", hanzi: "我", pinyin: "wǒ", meaning: "I / me", example: "我很好。", exampleMeaning: "I am fine." },
  { id: "w18", unit: "Lesson 2", hanzi: "也", pinyin: "yě", meaning: "also", example: "我也要去。", exampleMeaning: "I want to go too." },
  { id: "w19", unit: "Lesson 2", hanzi: "他", pinyin: "tā", meaning: "he / him", example: "他是我哥哥。", exampleMeaning: "He is my older brother." },
  { id: "w20", unit: "Lesson 2", hanzi: "弟", pinyin: "dì", meaning: "younger brother", example: "我有一个弟弟。", exampleMeaning: "I have a younger brother." },
  { id: "w21", unit: "Lesson 2", hanzi: "不", pinyin: "bù", meaning: "not / no", example: "我不要。", exampleMeaning: "I don't want it." },
  { id: "w22", unit: "Lesson 2", hanzi: "爸", pinyin: "bà", meaning: "dad", example: "爸爸在上班。", exampleMeaning: "Dad is at work." },
  { id: "w23", unit: "Lesson 2", hanzi: "她", pinyin: "tā", meaning: "she / her", example: "她是我姐姐。", exampleMeaning: "She is my older sister." },
  { id: "w24", unit: "Lesson 2", hanzi: "妈", pinyin: "mā", meaning: "mum", example: "妈妈在煮饭。", exampleMeaning: "Mum is cooking." },
  { id: "w25", unit: "Lesson 2", hanzi: "的", pinyin: "de", meaning: "(possessive, 's)", example: "这是我的书。", exampleMeaning: "This is my book." },
  { id: "w26", unit: "Lesson 2", hanzi: "父", pinyin: "fù", meaning: "father", example: "我的父亲很高。", exampleMeaning: "My father is tall." },
  { id: "w27", unit: "Lesson 2", hanzi: "母", pinyin: "mǔ", meaning: "mother", example: "母亲节快乐。", exampleMeaning: "Happy Mother's Day." },
  { id: "w28", unit: "Lesson 2", hanzi: "女", pinyin: "nǚ", meaning: "female / girl", example: "她是女生。", exampleMeaning: "She is a girl." },
  { id: "w29", unit: "Lesson 2", hanzi: "儿", pinyin: "ér", meaning: "child / son", example: "这是我的儿子。", exampleMeaning: "This is my son." },
  // 第三课 Lesson 3
  { id: "w30", unit: "Lesson 3", hanzi: "力", pinyin: "lì", meaning: "strength", example: "他很有力气。", exampleMeaning: "He is very strong." },
  { id: "w31", unit: "Lesson 3", hanzi: "河", pinyin: "hé", meaning: "river", example: "河里有鱼。", exampleMeaning: "There are fish in the river." },
  { id: "w32", unit: "Lesson 3", hanzi: "禾", pinyin: "hé", meaning: "grain plant", example: "农夫在种禾苗。", exampleMeaning: "The farmer is planting rice seedlings." },
  { id: "w33", unit: "Lesson 3", hanzi: "立", pinyin: "lì", meaning: "to stand", example: "请立正。", exampleMeaning: "Please stand up straight." },
  { id: "w34", unit: "Lesson 3", hanzi: "米", pinyin: "mǐ", meaning: "rice", example: "我们吃米饭。", exampleMeaning: "We eat rice." },
  { id: "w35", unit: "Lesson 3", hanzi: "合", pinyin: "hé", meaning: "to close / combine", example: "请合上书本。", exampleMeaning: "Please close your book." },
  { id: "w36", unit: "Lesson 3", hanzi: "气", pinyin: "qì", meaning: "air", example: "天气很好。", exampleMeaning: "The weather is nice." },
  { id: "w37", unit: "Lesson 3", hanzi: "和", pinyin: "hé", meaning: "and", example: "我和你。", exampleMeaning: "Me and you." },
  { id: "w38", unit: "Lesson 3", hanzi: "哥", pinyin: "gē", meaning: "older brother", example: "我哥哥很高。", exampleMeaning: "My older brother is tall." },
  { id: "w39", unit: "Lesson 3", hanzi: "几", pinyin: "jǐ", meaning: "how many", example: "你几岁？", exampleMeaning: "How old are you?" },
  { id: "w40", unit: "Lesson 3", hanzi: "七", pinyin: "qī", meaning: "seven", example: "我七岁了。", exampleMeaning: "I am seven years old." },
  { id: "w41", unit: "Lesson 3", hanzi: "了", pinyin: "le", meaning: "(completed action)", example: "我吃饱了。", exampleMeaning: "I am full." },
  { id: "w42", unit: "Lesson 3", hanzi: "个", pinyin: "gè", meaning: "(measure word)", example: "一个苹果。", exampleMeaning: "One apple." },
  { id: "w43", unit: "Lesson 3", hanzi: "句", pinyin: "jù", meaning: "sentence", example: "一句话。", exampleMeaning: "One sentence." },
  { id: "w44", unit: "Lesson 3", hanzi: "可", pinyin: "kě", meaning: "can / may", example: "我可以去吗？", exampleMeaning: "May I go?" },
  { id: "w45", unit: "Lesson 3", hanzi: "以", pinyin: "yǐ", meaning: "(in 可以, may)", example: "可以。", exampleMeaning: "Yes, you may." },
  { id: "w46", unit: "Lesson 3", hanzi: "吗", pinyin: "ma", meaning: "(question word)", example: "你好吗？", exampleMeaning: "How are you?" },
  { id: "w47", unit: "Lesson 3", hanzi: "去", pinyin: "qù", meaning: "to go", example: "我要去学校。", exampleMeaning: "I want to go to school." },
  // 第四课 Lesson 4
  { id: "w48", unit: "Lesson 4", hanzi: "日", pinyin: "rì", meaning: "sun / day", example: "今天是星期日。", exampleMeaning: "Today is Sunday." },
  { id: "w49", unit: "Lesson 4", hanzi: "石", pinyin: "shí", meaning: "stone", example: "这是一块石头。", exampleMeaning: "This is a stone." },
  { id: "w50", unit: "Lesson 4", hanzi: "子", pinyin: "zǐ", meaning: "child / son", example: "这是我的儿子。", exampleMeaning: "This is my son." },
  { id: "w51", unit: "Lesson 4", hanzi: "字", pinyin: "zì", meaning: "character / word", example: "这是一个汉字。", exampleMeaning: "This is a Chinese character." },
  { id: "w52", unit: "Lesson 4", hanzi: "车", pinyin: "chē", meaning: "car / vehicle", example: "爸爸在开车。", exampleMeaning: "Dad is driving." },
  { id: "w53", unit: "Lesson 4", hanzi: "四", pinyin: "sì", meaning: "four", example: "我四岁了。", exampleMeaning: "I am four years old." },
  { id: "w54", unit: "Lesson 4", hanzi: "十", pinyin: "shí", meaning: "ten", example: "我有十个苹果。", exampleMeaning: "I have ten apples." },
  { id: "w55", unit: "Lesson 4", hanzi: "士", pinyin: "shì", meaning: "soldier / scholar", example: "他是一位战士。", exampleMeaning: "He is a soldier." },
  { id: "w56", unit: "Lesson 4", hanzi: "只", pinyin: "zhī", meaning: "(measure word, animals)", example: "一只小狗。", exampleMeaning: "One little dog." },
  { id: "w57", unit: "Lesson 4", hanzi: "把", pinyin: "bǎ", meaning: "(measure word / to hold)", example: "一把伞。", exampleMeaning: "An umbrella." },
  { id: "w58", unit: "Lesson 4", hanzi: "尺", pinyin: "chǐ", meaning: "ruler", example: "用尺子画线。", exampleMeaning: "Use a ruler to draw a line." },
  { id: "w59", unit: "Lesson 4", hanzi: "是", pinyin: "shì", meaning: "to be / is", example: "我是学生。", exampleMeaning: "I am a student." },
  { id: "w60", unit: "Lesson 4", hanzi: "书", pinyin: "shū", meaning: "book", example: "我在看书。", exampleMeaning: "I am reading a book." },
  { id: "w61", unit: "Lesson 4", hanzi: "出", pinyin: "chū", meaning: "to go out", example: "我要出去玩。", exampleMeaning: "I want to go out and play." },
  { id: "w62", unit: "Lesson 4", hanzi: "自", pinyin: "zì", meaning: "self", example: "我自己做。", exampleMeaning: "I do it myself." },
  { id: "w63", unit: "Lesson 4", hanzi: "己", pinyin: "jǐ", meaning: "self", example: "自己的事自己做。", exampleMeaning: "Do your own things yourself." },
  { id: "w64", unit: "Lesson 4", hanzi: "它", pinyin: "tā", meaning: "it", example: "它是一只猫。", exampleMeaning: "It is a cat." },
  { id: "w65", unit: "Lesson 4", hanzi: "吃", pinyin: "chī", meaning: "to eat", example: "我要吃饭。", exampleMeaning: "I want to eat." },
  // 第五课 Lesson 5
  { id: "w66", unit: "Lesson 5", hanzi: "山", pinyin: "shān", meaning: "mountain", example: "我们去爬山。", exampleMeaning: "We are going to climb the mountain." },
  { id: "w67", unit: "Lesson 5", hanzi: "羊", pinyin: "yáng", meaning: "sheep / goat", example: "山上有羊。", exampleMeaning: "There are sheep on the mountain." },
  { id: "w68", unit: "Lesson 5", hanzi: "毛", pinyin: "máo", meaning: "fur / hair", example: "小猫的毛很软。", exampleMeaning: "The kitten's fur is soft." },
  { id: "w69", unit: "Lesson 5", hanzi: "草", pinyin: "cǎo", meaning: "grass", example: "草地很绿。", exampleMeaning: "The grass field is very green." },
  { id: "w70", unit: "Lesson 5", hanzi: "太", pinyin: "tài", meaning: "too / very", example: "今天太热了。", exampleMeaning: "Today is too hot." },
  { id: "w71", unit: "Lesson 5", hanzi: "阳", pinyin: "yáng", meaning: "sun (in 太阳)", example: "太阳很大。", exampleMeaning: "The sun is big." },
  { id: "w72", unit: "Lesson 5", hanzi: "王", pinyin: "wáng", meaning: "king", example: "他是国王。", exampleMeaning: "He is the king." },
  { id: "w73", unit: "Lesson 5", hanzi: "三", pinyin: "sān", meaning: "three", example: "我三岁了。", exampleMeaning: "I am three years old." },
  { id: "w74", unit: "Lesson 5", hanzi: "伞", pinyin: "sǎn", meaning: "umbrella", example: "下雨要带伞。", exampleMeaning: "Bring an umbrella when it rains." },
  { id: "w75", unit: "Lesson 5", hanzi: "包", pinyin: "bāo", meaning: "bag", example: "我的书包很重。", exampleMeaning: "My schoolbag is heavy." },
  { id: "w76", unit: "Lesson 5", hanzi: "老", pinyin: "lǎo", meaning: "old", example: "老师很好。", exampleMeaning: "The teacher is kind." },
  { id: "w77", unit: "Lesson 5", hanzi: "师", pinyin: "shī", meaning: "teacher (in 老师)", example: "他是我的老师。", exampleMeaning: "He is my teacher." },
  { id: "w78", unit: "Lesson 5", hanzi: "早", pinyin: "zǎo", meaning: "early / morning", example: "早上好。", exampleMeaning: "Good morning." },
  { id: "w79", unit: "Lesson 5", hanzi: "安", pinyin: "ān", meaning: "peace / safe", example: "早安。", exampleMeaning: "Good morning." },
  { id: "w80", unit: "Lesson 5", hanzi: "半", pinyin: "bàn", meaning: "half", example: "我要半个苹果。", exampleMeaning: "I want half an apple." },
  { id: "w81", unit: "Lesson 5", hanzi: "午", pinyin: "wǔ", meaning: "noon", example: "中午我们吃饭。", exampleMeaning: "We eat lunch at noon." },
  { id: "w82", unit: "Lesson 5", hanzi: "奶", pinyin: "nǎi", meaning: "milk / grandma", example: "我喝牛奶。", exampleMeaning: "I drink milk." },
  { id: "w83", unit: "Lesson 5", hanzi: "玩", pinyin: "wán", meaning: "to play", example: "我们去玩。", exampleMeaning: "Let's go play." },
  { id: "w84", unit: "Lesson 5", hanzi: "具", pinyin: "jù", meaning: "tool (in 玩具, toy)", example: "这是我的玩具。", exampleMeaning: "This is my toy." },
  // 第六课 Lesson 6
  { id: "w85", unit: "Lesson 6", hanzi: "鸟", pinyin: "niǎo", meaning: "bird", example: "树上有小鸟。", exampleMeaning: "There's a little bird in the tree." },
  { id: "w86", unit: "Lesson 6", hanzi: "竹", pinyin: "zhú", meaning: "bamboo", example: "熊猫吃竹子。", exampleMeaning: "Pandas eat bamboo." },
  { id: "w87", unit: "Lesson 6", hanzi: "田", pinyin: "tián", meaning: "field", example: "农夫在种田。", exampleMeaning: "The farmer is farming the field." },
  { id: "w88", unit: "Lesson 6", hanzi: "苗", pinyin: "miáo", meaning: "seedling", example: "农夫在种禾苗。", exampleMeaning: "The farmer is planting rice seedlings." },
  { id: "w89", unit: "Lesson 6", hanzi: "象", pinyin: "xiàng", meaning: "elephant (in 大象)", example: "大象很大。", exampleMeaning: "The elephant is very big." },
  { id: "w90", unit: "Lesson 6", hanzi: "家", pinyin: "jiā", meaning: "home / family", example: "我爱我的家。", exampleMeaning: "I love my home." },
  { id: "w91", unit: "Lesson 6", hanzi: "刀", pinyin: "dāo", meaning: "knife", example: "小心用刀。", exampleMeaning: "Be careful with the knife." },
  { id: "w92", unit: "Lesson 6", hanzi: "网", pinyin: "wǎng", meaning: "net", example: "蜘蛛结网。", exampleMeaning: "The spider spins a web." },
  { id: "w93", unit: "Lesson 6", hanzi: "在", pinyin: "zài", meaning: "at / in", example: "我在家。", exampleMeaning: "I am at home." },
  { id: "w94", unit: "Lesson 6", hanzi: "里", pinyin: "lǐ", meaning: "inside", example: "书包里有书。", exampleMeaning: "There are books inside the bag." },
  { id: "w95", unit: "Lesson 6", hanzi: "上", pinyin: "shàng", meaning: "up / on", example: "书在桌上。", exampleMeaning: "The book is on the table." },
  { id: "w96", unit: "Lesson 6", hanzi: "下", pinyin: "xià", meaning: "down / under", example: "猫在桌下。", exampleMeaning: "The cat is under the table." },
  { id: "w97", unit: "Lesson 6", hanzi: "大", pinyin: "dà", meaning: "big", example: "大象很大。", exampleMeaning: "The elephant is big." },
  { id: "w98", unit: "Lesson 6", hanzi: "小", pinyin: "xiǎo", meaning: "small", example: "小狗很可爱。", exampleMeaning: "The little dog is cute." },
  { id: "w99", unit: "Lesson 6", hanzi: "来", pinyin: "lái", meaning: "to come", example: "请你过来。", exampleMeaning: "Please come over." },
  { id: "w100", unit: "Lesson 6", hanzi: "哭", pinyin: "kū", meaning: "to cry", example: "小妹妹在哭。", exampleMeaning: "Little sister is crying." },
  { id: "w101", unit: "Lesson 6", hanzi: "笑", pinyin: "xiào", meaning: "to laugh / smile", example: "他在笑。", exampleMeaning: "He is smiling." },
  { id: "w102", unit: "Lesson 6", hanzi: "男", pinyin: "nán", meaning: "male / boy", example: "他是男生。", exampleMeaning: "He is a boy." },
  { id: "w103", unit: "Lesson 6", hanzi: "爷", pinyin: "yé", meaning: "grandpa", example: "爷爷很疼我。", exampleMeaning: "Grandpa loves me dearly." },
  { id: "w104", unit: "Lesson 6", hanzi: "姐", pinyin: "jiě", meaning: "older sister", example: "我姐姐很聪明。", exampleMeaning: "My older sister is smart." },
  // 第七课 Lesson 7
  { id: "w105", unit: "Lesson 7", hanzi: "果", pinyin: "guǒ", meaning: "fruit", example: "我喜欢吃水果。", exampleMeaning: "I like eating fruit." },
  { id: "w106", unit: "Lesson 7", hanzi: "开", pinyin: "kāi", meaning: "to open", example: "请开门。", exampleMeaning: "Please open the door." },
  { id: "w107", unit: "Lesson 7", hanzi: "瓜", pinyin: "guā", meaning: "melon", example: "西瓜很甜。", exampleMeaning: "Watermelon is sweet." },
  { id: "w108", unit: "Lesson 7", hanzi: "火", pinyin: "huǒ", meaning: "fire", example: "小心火。", exampleMeaning: "Be careful of fire." },
  { id: "w109", unit: "Lesson 7", hanzi: "花", pinyin: "huā", meaning: "flower", example: "花园里有花。", exampleMeaning: "There are flowers in the garden." },
  { id: "w110", unit: "Lesson 7", hanzi: "叶", pinyin: "yè", meaning: "leaf", example: "树叶是绿色的。", exampleMeaning: "Leaves are green." },
  { id: "w111", unit: "Lesson 7", hanzi: "面", pinyin: "miàn", meaning: "face / side", example: "请看前面。", exampleMeaning: "Please look ahead." },
  { id: "w112", unit: "Lesson 7", hanzi: "关", pinyin: "guān", meaning: "to close", example: "请关门。", exampleMeaning: "Please close the door." },
  { id: "w113", unit: "Lesson 7", hanzi: "朵", pinyin: "duǒ", meaning: "(measure word, flowers)", example: "一朵花。", exampleMeaning: "One flower." },
  { id: "w114", unit: "Lesson 7", hanzi: "两", pinyin: "liǎng", meaning: "two", example: "我有两只猫。", exampleMeaning: "I have two cats." },
  // 第八课 Lesson 8
  { id: "w115", unit: "Lesson 8", hanzi: "目", pinyin: "mù", meaning: "eye", example: "这是一道题目。", exampleMeaning: "This is a question." },
  { id: "w116", unit: "Lesson 8", hanzi: "舌", pinyin: "shé", meaning: "tongue", example: "伸出舌头。", exampleMeaning: "Stick out your tongue." },
  { id: "w117", unit: "Lesson 8", hanzi: "手", pinyin: "shǒu", meaning: "hand", example: "举起手来。", exampleMeaning: "Raise your hand." },
  { id: "w118", unit: "Lesson 8", hanzi: "足", pinyin: "zú", meaning: "foot (in 足球)", example: "一只足球。", exampleMeaning: "A football." },
  { id: "w119", unit: "Lesson 8", hanzi: "本", pinyin: "běn", meaning: "(measure word, books)", example: "一本书。", exampleMeaning: "One book." },
  { id: "w120", unit: "Lesson 8", hanzi: "工", pinyin: "gōng", meaning: "work", example: "爸爸在工作。", exampleMeaning: "Dad is working." },
  { id: "w121", unit: "Lesson 8", hanzi: "厂", pinyin: "chǎng", meaning: "factory", example: "这是一间工厂。", exampleMeaning: "This is a factory." },
  { id: "w122", unit: "Lesson 8", hanzi: "走", pinyin: "zǒu", meaning: "to walk", example: "我们走路去。", exampleMeaning: "We walk there." },
  { id: "w123", unit: "Lesson 8", hanzi: "跑", pinyin: "pǎo", meaning: "to run", example: "他跑得很快。", exampleMeaning: "He runs very fast." },
  { id: "w124", unit: "Lesson 8", hanzi: "飞", pinyin: "fēi", meaning: "to fly", example: "小鸟在飞。", exampleMeaning: "The bird is flying." },
  { id: "w125", unit: "Lesson 8", hanzi: "妹", pinyin: "mèi", meaning: "younger sister", example: "我有一个妹妹。", exampleMeaning: "I have a younger sister." },
  { id: "w126", unit: "Lesson 8", hanzi: "门", pinyin: "mén", meaning: "door", example: "请开门。", exampleMeaning: "Please open the door." },
  { id: "w127", unit: "Lesson 8", hanzi: "看", pinyin: "kàn", meaning: "to look / watch", example: "我在看书。", exampleMeaning: "I am reading." },
  { id: "w128", unit: "Lesson 8", hanzi: "见", pinyin: "jiàn", meaning: "to see", example: "再见。", exampleMeaning: "Goodbye." },
  { id: "w129", unit: "Lesson 8", hanzi: "问", pinyin: "wèn", meaning: "to ask", example: "我要问老师。", exampleMeaning: "I want to ask the teacher." },
  { id: "w130", unit: "Lesson 8", hanzi: "又", pinyin: "yòu", meaning: "again", example: "他又来了。", exampleMeaning: "He came again." },
  { id: "w131", unit: "Lesson 8", hanzi: "头", pinyin: "tóu", meaning: "head", example: "我的头很痛。", exampleMeaning: "My head hurts." },
  { id: "w132", unit: "Lesson 8", hanzi: "们", pinyin: "men", meaning: "(plural suffix)", example: "我们是朋友。", exampleMeaning: "We are friends." },
  { id: "w133", unit: "Lesson 8", hanzi: "身", pinyin: "shēn", meaning: "body", example: "他的身体很好。", exampleMeaning: "His body is healthy." },
  { id: "w134", unit: "Lesson 8", hanzi: "体", pinyin: "tǐ", meaning: "body (in 身体)", example: "身体健康。", exampleMeaning: "A healthy body." },
  // 第九课 Lesson 9
  { id: "w135", unit: "Lesson 9", hanzi: "牛", pinyin: "niú", meaning: "cow", example: "牛在吃草。", exampleMeaning: "The cow is eating grass." },
  { id: "w136", unit: "Lesson 9", hanzi: "井", pinyin: "jǐng", meaning: "well", example: "这是一口井。", exampleMeaning: "This is a well." },
  { id: "w137", unit: "Lesson 9", hanzi: "虫", pinyin: "chóng", meaning: "insect", example: "树上有虫。", exampleMeaning: "There's an insect on the tree." },
  { id: "w138", unit: "Lesson 9", hanzi: "弓", pinyin: "gōng", meaning: "bow", example: "他拿着弓。", exampleMeaning: "He is holding a bow." },
  { id: "w139", unit: "Lesson 9", hanzi: "贝", pinyin: "bèi", meaning: "shell", example: "海边有贝壳。", exampleMeaning: "There are shells at the beach." },
  { id: "w140", unit: "Lesson 9", hanzi: "心", pinyin: "xīn", meaning: "heart", example: "我很开心。", exampleMeaning: "I am very happy." },
  { id: "w141", unit: "Lesson 9", hanzi: "豆", pinyin: "dòu", meaning: "bean", example: "我喜欢吃豆。", exampleMeaning: "I like eating beans." },
  { id: "w142", unit: "Lesson 9", hanzi: "六", pinyin: "liù", meaning: "six", example: "我六岁了。", exampleMeaning: "I am six years old." },
  { id: "w143", unit: "Lesson 9", hanzi: "支", pinyin: "zhī", meaning: "(measure word)", example: "一支笔。", exampleMeaning: "One pen." },
  { id: "w144", unit: "Lesson 9", hanzi: "条", pinyin: "tiáo", meaning: "(measure word, long things)", example: "一条鱼。", exampleMeaning: "One fish." },
  { id: "w145", unit: "Lesson 9", hanzi: "九", pinyin: "jiǔ", meaning: "nine", example: "我九岁了。", exampleMeaning: "I am nine years old." },
  { id: "w146", unit: "Lesson 9", hanzi: "粒", pinyin: "lì", meaning: "(measure word, small round things)", example: "一粒糖果。", exampleMeaning: "One candy." },
  { id: "w147", unit: "Lesson 9", hanzi: "今", pinyin: "jīn", meaning: "now / present", example: "今天很热。", exampleMeaning: "Today is hot." },
  { id: "w148", unit: "Lesson 9", hanzi: "什", pinyin: "shén", meaning: "(in 什么, what)", example: "这是什么？", exampleMeaning: "What is this?" },
  { id: "w149", unit: "Lesson 9", hanzi: "么", pinyin: "me", meaning: "(in 什么, what)", example: "你要什么？", exampleMeaning: "What do you want?" },
  { id: "w150", unit: "Lesson 9", hanzi: "华", pinyin: "huá", meaning: "Chinese (in 华文)", example: "我在学华文。", exampleMeaning: "I am learning Chinese." },
  { id: "w151", unit: "Lesson 9", hanzi: "文", pinyin: "wén", meaning: "language / writing", example: "华文课很有趣。", exampleMeaning: "Chinese class is fun." },
  { id: "w152", unit: "Lesson 9", hanzi: "点", pinyin: "diǎn", meaning: "o'clock / point", example: "现在几点？", exampleMeaning: "What time is it now?" },
  { id: "w153", unit: "Lesson 9", hanzi: "说", pinyin: "shuō", meaning: "to speak", example: "请说华语。", exampleMeaning: "Please speak Mandarin." },
  { id: "w154", unit: "Lesson 9", hanzi: "语", pinyin: "yǔ", meaning: "language", example: "华语很好听。", exampleMeaning: "Mandarin sounds nice." },
  // 第十课 Lesson 10
  { id: "w155", unit: "Lesson 10", hanzi: "月", pinyin: "yuè", meaning: "moon / month", example: "今晚月亮很圆。", exampleMeaning: "The moon is round tonight." },
  { id: "w156", unit: "Lesson 10", hanzi: "天", pinyin: "tiān", meaning: "sky / day", example: "今天天气很好。", exampleMeaning: "The weather is nice today." },
  { id: "w157", unit: "Lesson 10", hanzi: "地", pinyin: "dì", meaning: "ground / earth", example: "地上有花。", exampleMeaning: "There are flowers on the ground." },
  { id: "w158", unit: "Lesson 10", hanzi: "风", pinyin: "fēng", meaning: "wind", example: "今天风很大。", exampleMeaning: "The wind is strong today." },
  { id: "w159", unit: "Lesson 10", hanzi: "雷", pinyin: "léi", meaning: "thunder", example: "我听到打雷。", exampleMeaning: "I heard thunder." },
  { id: "w160", unit: "Lesson 10", hanzi: "电", pinyin: "diàn", meaning: "electricity", example: "请关灯，节省用电。", exampleMeaning: "Please turn off the light to save electricity." },
  { id: "w161", unit: "Lesson 10", hanzi: "水", pinyin: "shuǐ", meaning: "water", example: "我要喝水。", exampleMeaning: "I want to drink water." },
  { id: "w162", unit: "Lesson 10", hanzi: "寸", pinyin: "cùn", meaning: "inch", example: "一寸长。", exampleMeaning: "One inch long." },
  { id: "w163", unit: "Lesson 10", hanzi: "方", pinyin: "fāng", meaning: "square / direction", example: "这是正方形。", exampleMeaning: "This is a square." },
  { id: "w164", unit: "Lesson 10", hanzi: "正", pinyin: "zhèng", meaning: "straight / correct", example: "请坐正。", exampleMeaning: "Please sit up straight." },
  { id: "w165", unit: "Lesson 10", hanzi: "反", pinyin: "fǎn", meaning: "opposite", example: "这是相反的。", exampleMeaning: "This is the opposite." },
  { id: "w166", unit: "Lesson 10", hanzi: "白", pinyin: "bái", meaning: "white", example: "云朵是白色的。", exampleMeaning: "The clouds are white." },
  { id: "w167", unit: "Lesson 10", hanzi: "好", pinyin: "hǎo", meaning: "good", example: "你好吗？", exampleMeaning: "How are you?" },
  { id: "w168", unit: "Lesson 10", hanzi: "坏", pinyin: "huài", meaning: "bad", example: "这个是坏的。", exampleMeaning: "This one is bad." },
  { id: "w169", unit: "Lesson 10", hanzi: "对", pinyin: "duì", meaning: "correct", example: "你说得对。", exampleMeaning: "You are right." },
  { id: "w170", unit: "Lesson 10", hanzi: "古", pinyin: "gǔ", meaning: "ancient", example: "这是古老的房子。", exampleMeaning: "This is an ancient house." },
  { id: "w171", unit: "Lesson 10", hanzi: "旧", pinyin: "jiù", meaning: "old (used)", example: "这是旧书。", exampleMeaning: "This is an old book." },
  { id: "w172", unit: "Lesson 10", hanzi: "有", pinyin: "yǒu", meaning: "to have", example: "我有一只猫。", exampleMeaning: "I have a cat." },
  { id: "w173", unit: "Lesson 10", hanzi: "没", pinyin: "méi", meaning: "not have", example: "我没有钱。", exampleMeaning: "I don't have money." },
  { id: "w174", unit: "Lesson 10", hanzi: "云", pinyin: "yún", meaning: "cloud", example: "天上有云。", exampleMeaning: "There are clouds in the sky." },
  // 第十一课 Lesson 11
  { id: "w175", unit: "Lesson 11", hanzi: "甲", pinyin: "jiǎ", meaning: "first (in a series)", example: "他排第一，是甲等。", exampleMeaning: "He's ranked first, grade A." },
  { id: "w176", unit: "Lesson 11", hanzi: "丁", pinyin: "dīng", meaning: "(a surname)", example: "他姓丁。", exampleMeaning: "His surname is Ding." },
  { id: "w177", unit: "Lesson 11", hanzi: "前", pinyin: "qián", meaning: "front", example: "请看前面。", exampleMeaning: "Please look ahead." },
  { id: "w178", unit: "Lesson 11", hanzi: "后", pinyin: "hòu", meaning: "back / after", example: "我排在后面。", exampleMeaning: "I'm standing at the back." },
  { id: "w179", unit: "Lesson 11", hanzi: "左", pinyin: "zuǒ", meaning: "left", example: "请转左。", exampleMeaning: "Please turn left." },
  { id: "w180", unit: "Lesson 11", hanzi: "右", pinyin: "yòu", meaning: "right", example: "请转右。", exampleMeaning: "Please turn right." },
  { id: "w181", unit: "Lesson 11", hanzi: "中", pinyin: "zhōng", meaning: "middle", example: "他站在中间。", exampleMeaning: "He's standing in the middle." },
  { id: "w182", unit: "Lesson 11", hanzi: "间", pinyin: "jiān", meaning: "between / room", example: "这是我的房间。", exampleMeaning: "This is my room." },
  { id: "w183", unit: "Lesson 11", hanzi: "边", pinyin: "biān", meaning: "side", example: "请站在旁边。", exampleMeaning: "Please stand at the side." },
  { id: "w184", unit: "Lesson 11", hanzi: "同", pinyin: "tóng", meaning: "same", example: "我们是同学。", exampleMeaning: "We are classmates." },
  { id: "w185", unit: "Lesson 11", hanzi: "学", pinyin: "xué", meaning: "to learn", example: "我在学校学习。", exampleMeaning: "I study at school." },
  { id: "w186", unit: "Lesson 11", hanzi: "朋", pinyin: "péng", meaning: "friend (in 朋友)", example: "他是我的朋友。", exampleMeaning: "He is my friend." },
  { id: "w187", unit: "Lesson 11", hanzi: "友", pinyin: "yǒu", meaning: "friend (in 朋友)", example: "朋友很重要。", exampleMeaning: "Friends are important." },
  { id: "w188", unit: "Lesson 11", hanzi: "坐", pinyin: "zuò", meaning: "to sit", example: "请坐下。", exampleMeaning: "Please sit down." },
  { id: "w189", unit: "Lesson 11", hanzi: "高", pinyin: "gāo", meaning: "tall", example: "他很高。", exampleMeaning: "He is tall." },
  { id: "w190", unit: "Lesson 11", hanzi: "发", pinyin: "fà", meaning: "hair (in 头发)", example: "我的头发很长。", exampleMeaning: "My hair is long." },
  { id: "w191", unit: "Lesson 11", hanzi: "直", pinyin: "zhí", meaning: "straight", example: "这条路很直。", exampleMeaning: "This road is straight." },
  { id: "w192", unit: "Lesson 11", hanzi: "起", pinyin: "qǐ", meaning: "to rise", example: "早上起床。", exampleMeaning: "Get up in the morning." },
  { id: "w193", unit: "Lesson 11", hanzi: "回", pinyin: "huí", meaning: "to return", example: "我要回家了。", exampleMeaning: "I'm going home." },
  { id: "w194", unit: "Lesson 11", hanzi: "周", pinyin: "zhōu", meaning: "week", example: "这一周很忙。", exampleMeaning: "This week is busy." },
  { id: "w195", unit: "Lesson 11", hanzi: "末", pinyin: "mò", meaning: "end (in 周末)", example: "周末快乐！", exampleMeaning: "Happy weekend!" },
  // 第十二课 Lesson 12
  { id: "w196", unit: "Lesson 12", hanzi: "鸡", pinyin: "jī", meaning: "chicken", example: "农场里有鸡。", exampleMeaning: "There are chickens on the farm." },
  { id: "w197", unit: "Lesson 12", hanzi: "饭", pinyin: "fàn", meaning: "rice / meal", example: "我要吃饭了。", exampleMeaning: "I'm going to eat." },
  { id: "w198", unit: "Lesson 12", hanzi: "鸭", pinyin: "yā", meaning: "duck", example: "池塘里有鸭子。", exampleMeaning: "There are ducks in the pond." },
  { id: "w199", unit: "Lesson 12", hanzi: "元", pinyin: "yuán", meaning: "dollar", example: "这个五元。", exampleMeaning: "This costs five dollars." },
  { id: "w200", unit: "Lesson 12", hanzi: "饿", pinyin: "è", meaning: "hungry", example: "我很饿。", exampleMeaning: "I am very hungry." },
  { id: "w201", unit: "Lesson 12", hanzi: "饱", pinyin: "bǎo", meaning: "full (from eating)", example: "我吃饱了。", exampleMeaning: "I am full." },
  { id: "w202", unit: "Lesson 12", hanzi: "饼", pinyin: "bǐng", meaning: "biscuit / cake", example: "我喜欢吃饼干。", exampleMeaning: "I like eating biscuits." },
  { id: "w203", unit: "Lesson 12", hanzi: "干", pinyin: "gān", meaning: "dry (in 饼干)", example: "饼干很脆。", exampleMeaning: "The biscuit is crispy." },
  { id: "w204", unit: "Lesson 12", hanzi: "狗", pinyin: "gǒu", meaning: "dog", example: "我家有一只狗。", exampleMeaning: "My family has a dog." },
  { id: "w205", unit: "Lesson 12", hanzi: "喜", pinyin: "xǐ", meaning: "to like (in 喜欢)", example: "我喜欢你。", exampleMeaning: "I like you." },
  { id: "w206", unit: "Lesson 12", hanzi: "欢", pinyin: "huān", meaning: "happy (in 喜欢)", example: "欢迎你。", exampleMeaning: "Welcome." },
  { id: "w207", unit: "Lesson 12", hanzi: "肉", pinyin: "ròu", meaning: "meat", example: "我喜欢吃肉。", exampleMeaning: "I like eating meat." },
  { id: "w208", unit: "Lesson 12", hanzi: "猫", pinyin: "māo", meaning: "cat", example: "猫在睡觉。", exampleMeaning: "The cat is sleeping." },
  { id: "w209", unit: "Lesson 12", hanzi: "采", pinyin: "cǎi", meaning: "to pick / gather", example: "我们去采花。", exampleMeaning: "We are going to pick flowers." },
  { id: "w210", unit: "Lesson 12", hanzi: "歌", pinyin: "gē", meaning: "song", example: "我喜欢唱歌。", exampleMeaning: "I like singing." },
  { id: "w211", unit: "Lesson 12", hanzi: "唱", pinyin: "chàng", meaning: "to sing", example: "请唱一首歌。", exampleMeaning: "Please sing a song." },
  { id: "w212", unit: "Lesson 12", hanzi: "青", pinyin: "qīng", meaning: "green / blue", example: "天空是青色的。", exampleMeaning: "The sky is blue." },
  { id: "w213", unit: "Lesson 12", hanzi: "菜", pinyin: "cài", meaning: "vegetable", example: "我要吃青菜。", exampleMeaning: "I want to eat vegetables." },
  { id: "w214", unit: "Lesson 12", hanzi: "汤", pinyin: "tāng", meaning: "soup", example: "这碗汤很热。", exampleMeaning: "This bowl of soup is hot." },
  { id: "w215", unit: "Lesson 12", hanzi: "蛋", pinyin: "dàn", meaning: "egg", example: "我喜欢吃鸡蛋。", exampleMeaning: "I like eating eggs." },
  { id: "w216", unit: "Lesson 12", hanzi: "香", pinyin: "xiāng", meaning: "fragrant", example: "花很香。", exampleMeaning: "The flower smells nice." },
  // 第十三课 Lesson 13
  { id: "w217", unit: "Lesson 13", hanzi: "用", pinyin: "yòng", meaning: "to use", example: "请用尺子画线。", exampleMeaning: "Please use a ruler to draw a line." },
  { id: "w218", unit: "Lesson 13", hanzi: "刷", pinyin: "shuā", meaning: "to brush", example: "我要刷牙。", exampleMeaning: "I need to brush my teeth." },
  { id: "w219", unit: "Lesson 13", hanzi: "巾", pinyin: "jīn", meaning: "towel (in 毛巾)", example: "请用毛巾擦手。", exampleMeaning: "Please use a towel to wipe your hands." },
  { id: "w220", unit: "Lesson 13", hanzi: "抹", pinyin: "mǒ", meaning: "to wipe", example: "请抹干净。", exampleMeaning: "Please wipe it clean." },
  { id: "w221", unit: "Lesson 13", hanzi: "洗", pinyin: "xǐ", meaning: "to wash", example: "我要洗手。", exampleMeaning: "I need to wash my hands." },
  { id: "w222", unit: "Lesson 13", hanzi: "要", pinyin: "yào", meaning: "to want", example: "我要喝水。", exampleMeaning: "I want to drink water." },
  { id: "w223", unit: "Lesson 13", hanzi: "脸", pinyin: "liǎn", meaning: "face", example: "请洗脸。", exampleMeaning: "Please wash your face." },
  { id: "w224", unit: "Lesson 13", hanzi: "放", pinyin: "fàng", meaning: "to put / release", example: "请把书放好。", exampleMeaning: "Please put the book away properly." },
  { id: "w225", unit: "Lesson 13", hanzi: "冲", pinyin: "chōng", meaning: "to rinse (in 冲凉)", example: "我要去冲凉。", exampleMeaning: "I'm going to take a shower." },
  { id: "w226", unit: "Lesson 13", hanzi: "凉", pinyin: "liáng", meaning: "cool", example: "今天很凉爽。", exampleMeaning: "It's cool today." },
  { id: "w227", unit: "Lesson 13", hanzi: "东", pinyin: "dōng", meaning: "east", example: "太阳从东边升起。", exampleMeaning: "The sun rises in the east." },
  { id: "w228", unit: "Lesson 13", hanzi: "西", pinyin: "xī", meaning: "west", example: "太阳从西边落下。", exampleMeaning: "The sun sets in the west." },
  { id: "w229", unit: "Lesson 13", hanzi: "到", pinyin: "dào", meaning: "to arrive", example: "我到家了。", exampleMeaning: "I have arrived home." },
  { id: "w230", unit: "Lesson 13", hanzi: "先", pinyin: "xiān", meaning: "first", example: "请先洗手。", exampleMeaning: "Please wash your hands first." },
  { id: "w231", unit: "Lesson 13", hanzi: "请", pinyin: "qǐng", meaning: "please", example: "请坐。", exampleMeaning: "Please sit." },
  { id: "w232", unit: "Lesson 13", hanzi: "很", pinyin: "hěn", meaning: "very", example: "我很开心。", exampleMeaning: "I am very happy." },
  { id: "w233", unit: "Lesson 13", hanzi: "泡", pinyin: "pào", meaning: "to soak", example: "泡一杯茶。", exampleMeaning: "Brew a cup of tea." },
  { id: "w234", unit: "Lesson 13", hanzi: "变", pinyin: "biàn", meaning: "to change", example: "天气变冷了。", exampleMeaning: "The weather has turned cold." },
  { id: "w235", unit: "Lesson 13", hanzi: "谢", pinyin: "xiè", meaning: "thanks", example: "谢谢你。", exampleMeaning: "Thank you." },
  // 第十四课 Lesson 14
  { id: "w236", unit: "Lesson 14", hanzi: "这", pinyin: "zhè", meaning: "this", example: "这是我的书。", exampleMeaning: "This is my book." },
  { id: "w237", unit: "Lesson 14", hanzi: "双", pinyin: "shuāng", meaning: "pair", example: "一双鞋子。", exampleMeaning: "A pair of shoes." },
  { id: "w238", unit: "Lesson 14", hanzi: "袜", pinyin: "wà", meaning: "socks", example: "我穿上袜子。", exampleMeaning: "I put on my socks." },
  { id: "w239", unit: "Lesson 14", hanzi: "那", pinyin: "nà", meaning: "that", example: "那是他的书包。", exampleMeaning: "That is his schoolbag." },
  { id: "w240", unit: "Lesson 14", hanzi: "皮", pinyin: "pí", meaning: "skin / leather", example: "这是皮鞋。", exampleMeaning: "These are leather shoes." },
  { id: "w241", unit: "Lesson 14", hanzi: "鞋", pinyin: "xié", meaning: "shoes", example: "我的鞋子很新。", exampleMeaning: "My shoes are new." },
  { id: "w242", unit: "Lesson 14", hanzi: "件", pinyin: "jiàn", meaning: "(measure word, clothes)", example: "一件衣服。", exampleMeaning: "A piece of clothing." },
  { id: "w243", unit: "Lesson 14", hanzi: "服", pinyin: "fú", meaning: "clothes (in 衣服)", example: "请穿好衣服。", exampleMeaning: "Please put on your clothes." },
  { id: "w244", unit: "Lesson 14", hanzi: "被", pinyin: "bèi", meaning: "blanket / by", example: "盖上被子。", exampleMeaning: "Cover yourself with the blanket." },
  { id: "w245", unit: "Lesson 14", hanzi: "还", pinyin: "hái", meaning: "still / also", example: "我还要一个。", exampleMeaning: "I still want one more." },
  { id: "w246", unit: "Lesson 14", hanzi: "色", pinyin: "sè", meaning: "color", example: "这是什么颜色？", exampleMeaning: "What color is this?" },
  { id: "w247", unit: "Lesson 14", hanzi: "红", pinyin: "hóng", meaning: "red", example: "苹果是红色的。", exampleMeaning: "The apple is red." },
  { id: "w248", unit: "Lesson 14", hanzi: "都", pinyin: "dōu", meaning: "all", example: "大家都很开心。", exampleMeaning: "Everyone is happy." },
  { id: "w249", unit: "Lesson 14", hanzi: "动", pinyin: "dòng", meaning: "to move", example: "请不要动。", exampleMeaning: "Please don't move." },
  { id: "w250", unit: "Lesson 14", hanzi: "作", pinyin: "zuò", meaning: "to do / make", example: "我在做作业。", exampleMeaning: "I am doing homework." },
  { id: "w251", unit: "Lesson 14", hanzi: "快", pinyin: "kuài", meaning: "fast", example: "他跑得很快。", exampleMeaning: "He runs very fast." },
  { id: "w252", unit: "Lesson 14", hanzi: "收", pinyin: "shōu", meaning: "to collect", example: "请收好你的东西。", exampleMeaning: "Please put away your things." },
  { id: "w253", unit: "Lesson 14", hanzi: "拾", pinyin: "shí", meaning: "to pick up", example: "请把它拾起来。", exampleMeaning: "Please pick it up." },
  { id: "w254", unit: "Lesson 14", hanzi: "穿", pinyin: "chuān", meaning: "to wear", example: "我穿新衣服。", exampleMeaning: "I wear new clothes." },
  { id: "w255", unit: "Lesson 14", hanzi: "事", pinyin: "shì", meaning: "matter / thing", example: "这是小事。", exampleMeaning: "This is a small matter." },
  { id: "w256", unit: "Lesson 14", hanzi: "做", pinyin: "zuò", meaning: "to do", example: "我在做功课。", exampleMeaning: "I am doing homework." },
];

const ALL_UNITS = [...new Set(WORDS.map((w) => w.unit))];
function isWordEnabled(word, enabledUnits) {
  return !enabledUnits || enabledUnits.length === 0 || enabledUnits.includes(word.unit);
}

const INTERVALS = [0, 1, 2, 4, 7, 14];

function todayStr() { return new Date().toISOString().slice(0, 10); }
function addDays(dateStr, n) { const d = new Date(dateStr + "T00:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
function isFriday(dateStr) { return new Date(dateStr + "T00:00:00").getDay() === 5; }
function logHistory(existing, date, entry) {
  const history = [...(existing || [])];
  const idx = history.findIndex((h) => h.date === date);
  if (idx >= 0) {
    history[idx] = {
      date,
      reviewed: history[idx].reviewed + (entry.reviewed || 0),
      correct: history[idx].correct + (entry.correct || 0),
      learned: history[idx].learned + (entry.learned || 0),
      chi: history[idx].chi + (entry.chi || 0),
    };
  } else {
    history.push({ date, reviewed: entry.reviewed || 0, correct: entry.correct || 0, learned: entry.learned || 0, chi: entry.chi || 0 });
  }
  while (history.length > 30) history.shift();
  return history;
}
function shuffle(arr) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
let ttsVoices = [];
function refreshVoices() {
  try {
    if (window.speechSynthesis) ttsVoices = window.speechSynthesis.getVoices() || [];
  } catch (e) {}
}
if (typeof window !== "undefined" && window.speechSynthesis) {
  refreshVoices();
  // Voice lists load asynchronously on most browsers (notably iPad Safari) -
  // the first speak() call can arrive before any voices exist yet.
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

function pickChineseVoice() {
  if (!ttsVoices.length) refreshVoices();
  return ttsVoices.find((v) => v.lang === "zh-CN") || ttsVoices.find((v) => v.lang && v.lang.toLowerCase().startsWith("zh")) || null;
}

function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickChineseVoice();
    if (voice) utter.voice = voice;
    utter.lang = voice ? voice.lang : "zh-CN";
    utter.rate = 0.85;
    if (synth.speaking || synth.pending) {
      // Calling speak() immediately after cancel() can silently drop the
      // new utterance on some browsers - give it a beat to actually clear.
      synth.cancel();
      setTimeout(() => synth.speak(utter), 60);
    } else {
      synth.speak(utter);
    }
  } catch (e) {}
}

function primeSpeechEngine() {
  try {
    if (!window.speechSynthesis) return;
    // iPad/iOS Safari commonly drops the very first speak() call on a page
    // unless one has already fired inside a user gesture. This "unlocks" it
    // with a near-silent utterance on the first tap anywhere in the app.
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    u.rate = 10;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

// ─── Storage layer ───────────────────────────────────────────────────────
// Inside the Claude preview, window.storage is available and used directly
// (no setup needed). Once deployed to Vercel, window.storage won't exist,
// so this calls a small serverless function (api/progress.js) backed by
// Vercel Blob for cross-device sync - one click in the Vercel dashboard to
// connect a store, no keys to paste in. Falls back to localStorage if that
// endpoint isn't reachable (e.g. running `vite dev` without `vercel dev`).
const HAS_CLAUDE_STORAGE = typeof window !== "undefined" && !!window.storage && typeof window.storage.get === "function";

async function blobsGet(familyCode) {
  const res = await fetch(`/api/progress?code=${encodeURIComponent(familyCode)}`);
  if (!res.ok) throw new Error("progress read failed: " + res.status);
  const json = await res.json();
  return json.data || null;
}

async function blobsSet(familyCode, data) {
  const res = await fetch(`/api/progress`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code: familyCode, data }),
  });
  if (!res.ok) throw new Error("progress write failed: " + res.status);
}

function localGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function localSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

function BambooMotif({ color = TOKENS.jade, className = "", style = {} }) {
  return (
    <svg viewBox="0 0 100 40" className={className} style={style} fill="none">
      <line x1="30" y1="4" x2="30" y2="36" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="21" y1="14" x2="39" y2="14" stroke={color} strokeWidth="2.5" opacity="0.55" />
      <line x1="21" y1="26" x2="39" y2="26" stroke={color} strokeWidth="2.5" opacity="0.55" />
      <line x1="58" y1="8" x2="58" y2="36" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="49" y1="18" x2="67" y2="18" stroke={color} strokeWidth="2.5" opacity="0.55" />
      <line x1="49" y1="29" x2="67" y2="29" stroke={color} strokeWidth="2.5" opacity="0.55" />
      <path d="M30,10 Q41,1 50,7" stroke={color} strokeWidth="2" opacity="0.7" fill="none" strokeLinecap="round" />
      <path d="M58,11 Q69,1 79,6" stroke={color} strokeWidth="2" opacity="0.7" fill="none" strokeLinecap="round" />
      <path d="M30,10 Q19,1 10,7" stroke={color} strokeWidth="2" opacity="0.7" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function TempleRoofMotif({ color = TOKENS.coral }) {
  return (
    <svg viewBox="0 0 400 30" preserveAspectRatio="none" className="w-full h-5 block" fill="none">
      <path d="M0,26 Q35,4 70,22 Q105,2 140,20 Q175,2 210,20 Q245,2 280,20 Q315,2 350,22 Q385,4 400,26 L400,30 L0,30 Z" fill={color} opacity="0.18" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1 opacity-80">
      <div style={{ backgroundColor: TOKENS.inkSoft }} className="h-px flex-1 opacity-30" />
      <BambooMotif color={TOKENS.jade} className="w-9 h-4" />
      <div style={{ backgroundColor: TOKENS.inkSoft }} className="h-px flex-1 opacity-30" />
    </div>
  );
}

function HeroAvatar({ loadout, beltColor, size = 140 }) {
  const skin = SKIN_TONES[loadout.skin] || SKIN_TONES.medium;
  const hair = HAIR_COLORS[loadout.hair] || HAIR_COLORS.black;
  const outfit = OUTFIT_COLORS[loadout.outfit] || OUTFIT_COLORS.red;
  const headband = HEADBAND_COLORS[loadout.headband] || HEADBAND_COLORS.red;
  const cape = loadout.cape && loadout.cape !== "none" ? CAPE_COLORS[loadout.cape] : null;
  const weapon = loadout.weapon || "none";
  const sash = beltColor || TOKENS.ink;
  const ink = "#2A211F";
  const pants = "#3B2E4A";
  const trim = "#F5C242";
  const cream = "#F6EFE0";

  return (
    <svg viewBox="0 0 400 420" width={size} height={size * (420 / 400)} role="img" aria-label="Kung fu hero">
      {cape && (
        <>
          <polygon points="150,182 66,362 108,362 156,224" fill={cape} opacity="0.9" />
          <polygon points="250,182 334,362 292,362 244,224" fill={cape} opacity="0.9" />
        </>
      )}

      {/* legs - horse stance */}
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M176 262 L138 316 L124 362" stroke={pants} strokeWidth="36" />
        <path d="M224 262 L262 316 L276 362" stroke={pants} strokeWidth="36" />
        <path d="M126 356 L124 364" stroke={cream} strokeWidth="36" strokeLinecap="butt" />
        <path d="M274 356 L276 364" stroke={cream} strokeWidth="36" strokeLinecap="butt" />
      </g>
      <ellipse cx="116" cy="374" rx="32" ry="14" fill={ink} />
      <ellipse cx="284" cy="374" rx="32" ry="14" fill={ink} />

      {/* torso (gi) */}
      <path d="M158 176 L242 176 Q252 176 253 186 L262 272 Q263 282 253 282 L147 282 Q137 282 138 272 L147 186 Q148 176 158 176 Z" fill={outfit} />
      <path d="M200 176 L182 178 L200 214 L218 178 Z" fill={cream} />
      <path d="M164 178 Q200 218 236 178" stroke={trim} strokeWidth="9" fill="none" strokeLinecap="round" />

      {/* belt - shows rank color, tail off to the side */}
      <path d="M138 264 L262 264 L263 282 L137 282 Z" fill={sash} />
      <rect x="216" y="280" width="16" height="32" rx="7" fill={sash} transform="rotate(10 224 296)" />

      {/* arms */}
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M158 196 L118 236 L134 264" stroke={outfit} strokeWidth="28" />
        <path d="M130 256 L134 265" stroke={trim} strokeWidth="28" strokeLinecap="butt" />
        <path d="M240 196 L282 208 L300 178" stroke={outfit} strokeWidth="28" />
        <path d="M296 186 L301 177" stroke={trim} strokeWidth="28" strokeLinecap="butt" />
      </g>
      <circle cx="134" cy="272" r="16" fill={skin} />
      <path d="M124 268 Q134 262 144 268" stroke="#D3906A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g transform="rotate(14 306 156)">
        <rect x="292" y="128" width="28" height="42" rx="13" fill={skin} />
        <circle cx="290" cy="162" r="9" fill={skin} />
        <path d="M301 134 L301 152 M310 136 L310 152" stroke="#D3906A" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* head */}
      <ellipse cx="146" cy="126" rx="9" ry="12" fill={skin} />
      <ellipse cx="254" cy="126" rx="9" ry="12" fill={skin} />
      <ellipse cx="200" cy="120" rx="54" ry="52" fill={skin} />
      <path d="M148 124 C146 70 166 52 200 52 C234 52 254 70 252 124 L252 100 q-13 22 -26 0 q-13 22 -26 0 q-13 22 -26 0 q-13 22 -26 0 Z" fill={hair} />
      <path d="M206 56 C216 30 234 20 248 14 C240 34 236 50 218 62 Z" fill={hair} />
      <ellipse cx="164" cy="146" rx="11" ry="6" fill="#EE8A72" opacity="0.55" />
      <ellipse cx="236" cy="146" rx="11" ry="6" fill="#EE8A72" opacity="0.55" />
      <ellipse cx="182" cy="134" rx="10" ry="12" fill="#FFFFFF" />
      <ellipse cx="218" cy="134" rx="10" ry="12" fill="#FFFFFF" />
      <circle cx="184" cy="136" r="6.5" fill={ink} />
      <circle cx="216" cy="136" r="6.5" fill={ink} />
      <circle cx="186" cy="133" r="2.2" fill="#FFFFFF" />
      <circle cx="218" cy="133" r="2.2" fill="#FFFFFF" />
      <path d="M168 114 L190 122" stroke={hair} strokeWidth="6" strokeLinecap="round" />
      <path d="M232 114 L210 122" stroke={hair} strokeWidth="6" strokeLinecap="round" />
      <path d="M196 150 Q200 154 204 150" stroke="#D3906A" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M190 160 Q200 168 210 160" stroke={ink} strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* headband */}
      <path d="M148 90 L98 74 L106 92 L98 112 Z" fill={headband} />
      <rect x="146" y="82" width="110" height="20" rx="10" fill={headband} />
      <path d="M152 92 L250 92" stroke={trim} strokeWidth="4" strokeLinecap="round" />

      {/* weapons - drawn last so they're never hidden behind the head */}
      {weapon === "sword" && (
        <g transform="translate(134,272) scale(1.35) rotate(-12)">
          <rect x="-6" y="-18" width="12" height="16" rx="3" fill="#6B4226" stroke={ink} strokeWidth="2" />
          <rect x="-14" y="-21" width="28" height="5" rx="2" fill="#D4AF37" stroke={ink} strokeWidth="1.5" />
          <polygon points="-5,-21 -5,-72 0,-84 5,-72 5,-21" fill="#E8ECEE" stroke={ink} strokeWidth="2" />
          <line x1="-1.5" y1="-68" x2="-1.5" y2="-26" stroke="#fff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </g>
      )}
      {weapon === "staff" && (
        <g transform="translate(134,272) scale(1.35) rotate(-12)">
          <rect x="-5" y="-95" width="10" height="92" rx="5" fill="#8B5A2B" stroke={ink} strokeWidth="2" />
          <rect x="-6" y="-84" width="12" height="6" rx="2" fill="#5C3A1A" />
          <rect x="-6" y="-16" width="12" height="6" rx="2" fill="#5C3A1A" />
          <rect x="-7" y="-38" width="14" height="16" rx="4" fill={ink} opacity="0.85" />
          <line x1="-2" y1="-78" x2="-2" y2="-42" stroke="#A9764F" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </g>
      )}
      {weapon === "nunchaku" && (
        <g transform="translate(134,272) scale(1.35) rotate(15)">
          <rect x="0" y="-6" width="26" height="12" rx="6" fill="#5C3A1A" stroke={ink} strokeWidth="2" />
          <line x1="8" y1="-6" x2="8" y2="6" stroke={ink} strokeWidth="1.5" opacity="0.5" />
          <line x1="18" y1="-6" x2="18" y2="6" stroke={ink} strokeWidth="1.5" opacity="0.5" />
          <circle cx="28" cy="0" r="3" fill={ink} />
          <circle cx="35" cy="4" r="3" fill={ink} />
          <g transform="translate(37,7) rotate(28)">
            <rect x="0" y="-6" width="26" height="12" rx="6" fill="#5C3A1A" stroke={ink} strokeWidth="2" />
            <line x1="8" y1="-6" x2="8" y2="6" stroke={ink} strokeWidth="1.5" opacity="0.5" />
            <line x1="18" y1="-6" x2="18" y2="6" stroke={ink} strokeWidth="1.5" opacity="0.5" />
          </g>
        </g>
      )}
      {weapon === "fan" && (
        <g transform="translate(134,272) scale(1.35) rotate(5)">
          <path d="M0,0 L34,-10 A36,36 0 0 1 24,26 Z" fill={TOKENS.gold} stroke={ink} strokeWidth="2" />
          <path d="M0,0 L34,-10 A36,36 0 0 1 29,8 Z" fill={TOKENS.coral} opacity="0.85" />
          <path d="M0,0 L14,20 A36,36 0 0 1 24,26 Z" fill={TOKENS.coral} opacity="0.85" />
          <line x1="0" y1="0" x2="30" y2="-6" stroke={ink} strokeWidth="1.3" opacity="0.5" />
          <line x1="0" y1="0" x2="33" y2="6" stroke={ink} strokeWidth="1.3" opacity="0.5" />
          <line x1="0" y1="0" x2="24" y2="18" stroke={ink} strokeWidth="1.3" opacity="0.5" />
          <circle cx="0" cy="0" r="4" fill="#6B4226" stroke={ink} strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(null);
  const [screen, setScreen] = useState("home");
  const [session, setSession] = useState(null);
  const [step, setStep] = useState("review");
  const [reviewIdx, setReviewIdx] = useState(0);
  const [newIdx, setNewIdx] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [selectedLantern, setSelectedLantern] = useState(null);
  const [bossWords, setBossWords] = useState([]);
  const [familyCode, setFamilyCode] = useState(null);
  const [needsFamilyCode, setNeedsFamilyCode] = useState(false);
  const runRef = useRef({ results: {}, stars: 0 });

  useEffect(() => {
    function onFirstTouch() {
      primeSpeechEngine();
      window.removeEventListener("touchstart", onFirstTouch);
      window.removeEventListener("click", onFirstTouch);
    }
    window.addEventListener("touchstart", onFirstTouch, { once: true });
    window.addEventListener("click", onFirstTouch, { once: true });
    return () => {
      window.removeEventListener("touchstart", onFirstTouch);
      window.removeEventListener("click", onFirstTouch);
    };
  }, []);

  useEffect(() => {
    if (HAS_CLAUDE_STORAGE) {
      loadProgress(null);
    } else {
      const cached = localGet("zi-bao-family-code");
      if (cached) {
        setFamilyCode(cached);
        loadProgress(cached);
      } else {
        setNeedsFamilyCode(true);
        setLoading(false);
      }
    }
  }, []);

  function mergeLoaded(base, loaded) {
    return {
      ...base,
      ...loaded,
      unlocked: { ...base.unlocked, ...(loaded.unlocked || {}) },
      equipped: { ...base.equipped, ...(loaded.equipped || {}) },
      bossHistory: loaded.bossHistory || {},
      history: loaded.history || [],
    };
  }

  async function loadProgress(code) {
    setLoading(true);
    const base = defaultProgress();
    try {
      let loaded = null;
      if (HAS_CLAUDE_STORAGE) {
        const res = await window.storage.get("zi-bao-progress");
        if (res && res.value) loaded = JSON.parse(res.value);
      } else if (code) {
        try {
          loaded = await blobsGet(code);
        } catch (e) {
          // function endpoint unreachable (e.g. local `vite dev` without `vercel dev`) - use local cache
          loaded = localGet("zi-bao-progress-local");
        }
      } else {
        loaded = localGet("zi-bao-progress-local");
      }
      setProgress(loaded ? mergeLoaded(base, loaded) : base);
    } catch (e) {
      const cached = localGet("zi-bao-progress-local");
      setProgress(cached ? mergeLoaded(base, cached) : base);
    }
    setLoading(false);
  }

  async function saveProgress(p) {
    setProgress(p);
    localSet("zi-bao-progress-local", p); // always keep a local cache as a safety net
    try {
      if (HAS_CLAUDE_STORAGE) {
        await window.storage.set("zi-bao-progress", JSON.stringify(p));
      } else if (familyCode) {
        await blobsSet(familyCode, p);
      }
    } catch (e) {
      // network hiccup - local cache above still has it, and it'll sync again on the next save
    }
  }

  function handleFamilyCodeSubmit(code) {
    localSet("zi-bao-family-code", code);
    setFamilyCode(code);
    setNeedsFamilyCode(false);
    loadProgress(code);
  }

  function handleUpdateEnabledUnits(units) {
    saveProgress({ ...progress, enabledUnits: units });
  }

  async function handleReset() {
    try {
      if (HAS_CLAUDE_STORAGE) await window.storage.delete("zi-bao-progress");
      else if (familyCode) await blobsSet(familyCode, defaultProgress());
    } catch (e) {}
    localSet("zi-bao-progress-local", defaultProgress());
    setProgress(defaultProgress());
  }

  function displayStreak() {
    if (!progress) return 0;
    const today = todayStr();
    const yest = addDays(today, -1);
    if (progress.lastActiveDate === today || progress.lastActiveDate === yest) return progress.streak;
    return 0;
  }

  function buildSession() {
    const today = todayStr();
    const words = progress.words || {};
    const pool = WORDS.filter((w) => isWordEnabled(w, progress.enabledUnits));
    const review = pool.filter((w) => words[w.id] && words[w.id].dueDate <= today)
      .sort((a, b) => (words[a.id].dueDate < words[b.id].dueDate ? -1 : 1))
      .slice(0, 8);
    const fresh = pool.filter((w) => !words[w.id]).slice(0, 5);
    const gamePool = shuffle([...review, ...fresh]).slice(0, 6);
    const gameType = shuffle(["match", "listening", "speed"])[0];
    return { review, fresh, gamePool, gameType };
  }

  function startLesson() {
    const s = buildSession();
    runRef.current = { results: {}, stars: 0 };
    setSession(s);
    setReviewIdx(0);
    setNewIdx(0);
    setScreen("lesson");
    if (s.review.length) setStep("review");
    else if (s.fresh.length) setStep("new");
    else if (s.gamePool.length >= 2) setStep("game");
    else completeDay(s);
  }

  function handleReviewAnswer(word, correct) {
    runRef.current.results[word.id] = correct;
    runRef.current.stars += correct ? 10 : 2;
    const next = reviewIdx + 1;
    if (next < session.review.length) setReviewIdx(next);
    else if (session.fresh.length) setStep("new");
    else if (session.gamePool.length >= 2) setStep("game");
    else completeDay(session);
  }

  function handleNewWordDone() {
    runRef.current.stars += 15;
    const next = newIdx + 1;
    if (next < session.fresh.length) setNewIdx(next);
    else if (session.gamePool.length >= 2) setStep("game");
    else completeDay(session);
  }

  function handleGameComplete(bonus) {
    runRef.current.stars += bonus;
    completeDay(session);
  }

  function completeDay(sessionObj) {
    const today = todayStr();
    const words = { ...(progress.words || {}) };
    let correctCount = 0;
    sessionObj.review.forEach((w) => {
      const correct = runRef.current.results[w.id];
      if (correct) correctCount++;
      const cur = words[w.id] || { level: 0 };
      const level = correct ? Math.min(cur.level + 1, INTERVALS.length - 1) : Math.max(cur.level - 1, 0);
      words[w.id] = { level, dueDate: addDays(today, correct ? INTERVALS[level] : 1) };
    });
    sessionObj.fresh.forEach((w) => { words[w.id] = { level: 1, dueDate: addDays(today, INTERVALS[1]) }; });
    const yest = addDays(today, -1);
    let streak = progress.streak || 0;
    let lastActiveDate = progress.lastActiveDate;
    if (lastActiveDate !== today) { streak = lastActiveDate === yest ? streak + 1 : 1; lastActiveDate = today; }
    const totalStars = (progress.totalStars || 0) + runRef.current.stars;

    const history = logHistory(progress.history, today, {
      reviewed: sessionObj.review.length,
      correct: correctCount,
      learned: sessionObj.fresh.length,
      chi: runRef.current.stars,
    });

    saveProgress({ ...progress, words, streak, lastActiveDate, totalStars, history });
    setStarsEarned(runRef.current.stars);
    setScreen("lesson");
    setStep("summary");
  }

  function startBoss() {
    const learned = WORDS.filter((w) => progress.words[w.id]);
    const weakestFirst = [...learned].sort((a, b) => progress.words[a.id].level - progress.words[b.id].level);
    const picked = shuffle(weakestFirst.slice(0, Math.min(12, weakestFirst.length)));
    setBossWords(picked);
    setScreen("boss");
  }

  function handleBossComplete(chi) {
    const today = todayStr();
    const bossHistory = { ...(progress.bossHistory || {}), [today]: true }; // keyed by the Friday's date
    const totalStars = (progress.totalStars || 0) + chi;
    const history = logHistory(progress.history, today, { chi });
    saveProgress({ ...progress, bossHistory, totalStars, history });
    setScreen("home");
  }

  function saveLoadout(draftEquipped) {
    let unlocked = { ...progress.unlocked };
    let totalStars = progress.totalStars || 0;
    Object.keys(draftEquipped).forEach((cat) => {
      if (cat === "skin") return;
      const itemId = draftEquipped[cat];
      const owned = (unlocked[cat] || []).includes(itemId);
      if (!owned) {
        const item = (SHOP[cat] || []).find((o) => o.id === itemId);
        const cost = item ? item.cost : 0;
        totalStars -= cost;
        unlocked = { ...unlocked, [cat]: [...(unlocked[cat] || []), itemId] };
      }
    });
    saveProgress({ ...progress, unlocked, equipped: draftEquipped, totalStars: Math.max(totalStars, 0) });
  }

  function backToHome() { setScreen("home"); setSession(null); }

  if (needsFamilyCode) return <FamilyCodeScreen onSubmit={handleFamilyCodeSubmit} />;

  if (loading || !progress) return <LoadingScreen />;

  const belt = getBelt(masteredCountOf(progress));

  if (screen === "home") {
    return (
      <HomeScreen
        progress={progress}
        streak={displayStreak()}
        onStart={startLesson}
        onStartBoss={startBoss}
        onCustomize={() => setScreen("customize")}
        onParent={() => setScreen("parentGate")}
        selectedLantern={selectedLantern}
        setSelectedLantern={setSelectedLantern}
      />
    );
  }

  if (screen === "customize") {
    return <CustomizeScreen progress={progress} belt={belt} onBack={() => setScreen("home")} onSave={saveLoadout} />;
  }

  if (screen === "parentGate") {
    return <ParentGate onBack={() => setScreen("home")} onSuccess={() => setScreen("parent")} />;
  }

  if (screen === "parent") {
    return (
      <ParentView
        progress={progress}
        familyCode={familyCode}
        onBack={() => setScreen("home")}
        onChangeFamilyCode={handleFamilyCodeSubmit}
        onUpdateEnabledUnits={handleUpdateEnabledUnits}
        onReset={handleReset}
      />
    );
  }

  if (screen === "boss") {
    return (
      <div style={{ background: TOKENS.ink, ...DOT_BG_DARK, minHeight: "100vh" }} className="p-4 md:p-10 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <BossBattle words={bossWords} equipped={progress.equipped} beltColor={belt.color} onComplete={handleBossComplete} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: TOKENS.bg, ...DOT_BG, minHeight: "100vh" }} className="p-4 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {step === "review" && session.review[reviewIdx] && (
          <ReviewCard word={session.review[reviewIdx]} total={session.review.length} index={reviewIdx} onAnswer={handleReviewAnswer} />
        )}
        {step === "new" && session.fresh[newIdx] && (
          <NewWordCard word={session.fresh[newIdx]} total={session.fresh.length} index={newIdx} onDone={handleNewWordDone} />
        )}
        {step === "game" && session.gameType === "listening" && <ListeningDash words={session.gamePool} onComplete={handleGameComplete} />}
        {step === "game" && session.gameType === "speed" && <SpeedRound words={session.gamePool} onComplete={handleGameComplete} />}
        {step === "game" && (!session.gameType || session.gameType === "match") && <MatchGame words={session.gamePool} onComplete={handleGameComplete} />}
        {step === "summary" && (
          <SummaryScreen stars={starsEarned} streak={progress.streak || 0} wordsLearned={session.fresh.length} wordsReviewed={session.review.length} onHome={backToHome} />
        )}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ background: TOKENS.bg, minHeight: "100vh" }} className="flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-3">🥋</div>
        <p style={{ color: TOKENS.inkSoft }}>Loading the dojo...</p>
      </div>
    </div>
  );
}

function FamilyCodeScreen({ onSubmit }) {
  const [mode, setMode] = useState("choose"); // choose | enter | created
  const [input, setInput] = useState("");
  const [generated, setGenerated] = useState("");

  function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars like 0/O, 1/I
    let c = "";
    for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
    setGenerated(c);
    setMode("created");
  }

  function submitExisting() {
    const code = input.trim().toUpperCase();
    if (code.length >= 4) onSubmit(code);
  }

  return (
    <div style={{ background: TOKENS.bg, ...DOT_BG, minHeight: "100vh" }} className="flex items-center justify-center p-4">
      <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-8 max-w-sm w-full shadow-xl text-center">
        <div className="text-5xl mb-3">🥋</div>
        <h1 style={{ color: TOKENS.ink, fontFamily: FONT }} className="text-2xl font-extrabold mb-1">
          汉字功夫
        </h1>

        {mode === "choose" && (
          <>
            <p style={{ color: TOKENS.inkSoft }} className="text-sm mb-6">
              This device syncs with a Family Code, so progress shows up on any device it's entered on.
            </p>
            <button onClick={generateCode} style={{ backgroundColor: TOKENS.coral }} className="w-full text-white font-extrabold rounded-2xl py-3 mb-3">
              Create a New Code
            </button>
            <button onClick={() => setMode("enter")} style={{ backgroundColor: TOKENS.spiritLight, color: TOKENS.spirit }} className="w-full font-bold rounded-2xl py-3">
              I Already Have a Code
            </button>
          </>
        )}

        {mode === "enter" && (
          <>
            <p style={{ color: TOKENS.inkSoft }} className="text-sm mb-4">
              Enter the Family Code shown on his tablet.
            </p>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              maxLength={8}
              placeholder="e.g. K7P2XQ"
              className="w-full text-center text-2xl font-bold tracking-widest border-2 rounded-2xl py-3 mb-4 outline-none"
              style={{ borderColor: "#E8DDCB" }}
            />
            <button onClick={submitExisting} style={{ backgroundColor: TOKENS.coral }} className="w-full text-white font-extrabold rounded-2xl py-3 mb-2">
              Continue
            </button>
            <button onClick={() => setMode("choose")} style={{ color: TOKENS.inkSoft }} className="text-sm underline">
              Back
            </button>
          </>
        )}

        {mode === "created" && (
          <>
            <p style={{ color: TOKENS.inkSoft }} className="text-sm mb-4">
              Write this down — enter it on your phone later to see his progress there too.
            </p>
            <div style={{ backgroundColor: TOKENS.blush }} className="rounded-2xl py-4 mb-4">
              <span style={{ color: TOKENS.coral }} className="text-3xl font-extrabold tracking-widest">
                {generated}
              </span>
            </div>
            <button onClick={() => onSubmit(generated)} style={{ backgroundColor: TOKENS.coral }} className="w-full text-white font-extrabold rounded-2xl py-3">
              Start Training
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HomeScreen({ progress, streak, onStart, onStartBoss, onCustomize, onParent, selectedLantern, setSelectedLantern }) {
  const learnedIds = Object.keys(progress.words || {});
  const masteredCount = learnedIds.filter((id) => progress.words[id].level >= 4).length;
  const belt = getBelt(masteredCount);
  const today = todayStr();
  const friday = isFriday(today);
  const bossDoneToday = !!(progress.bossHistory && progress.bossHistory[today]);
  const canBoss = learnedIds.length >= 3 && friday && !bossDoneToday;
  const bossWinsCount = Object.keys(progress.bossHistory || {}).length;
  const greetings = ["妖怪来了，准备战斗！", "今天也要加油修炼！", "小侠，欢迎回来！"];
  const greeting = greetings[new Date().getDate() % greetings.length];

  return (
    <div style={{ background: TOKENS.bg, ...DOT_BG, minHeight: "100vh" }} className="p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <TempleRoofMotif color={TOKENS.coral} />
        <header className="flex items-center justify-between mb-4 pt-3 pb-2">
          <div>
            <h1 style={{ color: TOKENS.ink, fontFamily: FONT }} className="text-3xl md:text-4xl font-extrabold">汉字功夫</h1>
            <p style={{ color: TOKENS.inkSoft }} className="text-sm md:text-base mt-1">Han Zi Gong Fu · defeat spirits, master characters</p>
          </div>
          <div style={{ backgroundColor: streak > 0 ? TOKENS.coral : "#E8DDCB", color: streak > 0 ? "#fff" : TOKENS.inkSoft }} className="flex items-center gap-2 rounded-full px-4 py-2 font-bold text-lg shadow-sm">
            <Flame size={22} fill={streak > 0 ? "#fff" : "none"} />
            {streak}
          </div>
        </header>
        <Divider />

        <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-6 md:p-8 shadow-md my-6 flex items-center gap-5">
          <div style={{ backgroundColor: TOKENS.blush }} className="rounded-3xl p-2 flex-shrink-0">
            <HeroAvatar loadout={progress.equipped} beltColor={belt.color} size={108} />
          </div>
          <div className="flex-1">
            <p style={{ color: TOKENS.ink }} className="text-lg md:text-xl font-bold mb-1">{greeting}</p>
            <p style={{ color: TOKENS.inkSoft }} className="text-sm md:text-base mb-2">Your kung fu hero is ready to fight evil spirits with you.</p>
            <div className="flex flex-wrap items-center gap-2">
              <span style={{ backgroundColor: belt.color, color: belt.idx >= 4 ? "#fff" : TOKENS.ink }} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full">🥋 {belt.name}</span>
              <button onClick={onCustomize} style={{ backgroundColor: TOKENS.spiritLight, color: TOKENS.spirit }} className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles size={12} /> Customize
              </button>
            </div>
          </div>
        </div>

        <button onClick={onStart} style={{ backgroundColor: TOKENS.coral }} className="w-full text-white text-xl md:text-2xl font-extrabold rounded-3xl py-5 md:py-6 shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-transform mb-4">
          Start Today's Battle
          <Swords size={26} />
        </button>

        <div style={{ backgroundColor: TOKENS.spirit }} className="rounded-3xl p-6 shadow-md mb-6 flex items-center gap-4">
          <span className="text-5xl flex-shrink-0">🐉</span>
          <div className="flex-1">
            <p style={{ color: "#fff" }} className="text-lg font-extrabold mb-1">Boss Battle</p>
            <p style={{ color: TOKENS.spiritLight }} className="text-sm">
              {friday ? (bossDoneToday ? "Boss defeated today! 🎉" : "The boss awakens today!") : "The boss awakens every Friday"}
            </p>
          </div>
          <button onClick={onStartBoss} disabled={!canBoss} style={{ backgroundColor: canBoss ? "#fff" : "rgba(255,255,255,0.3)", color: canBoss ? TOKENS.spirit : "#fff" }} className="rounded-full px-5 py-3 font-bold text-sm shadow-sm flex-shrink-0">
            {canBoss ? "Challenge" : "Locked"}
          </button>
        </div>

        <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ color: TOKENS.ink }} className="text-lg md:text-xl font-bold">Spirit Scroll</h2>
            <span style={{ color: TOKENS.inkSoft }} className="text-sm">{learnedIds.length} sealed · {masteredCount} mastered</span>
          </div>
          {learnedIds.length === 0 ? (
            <p style={{ color: TOKENS.inkSoft }} className="text-sm py-6 text-center">Your scroll is empty — win today's battle to seal your first spirit!</p>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {learnedIds.map((id) => {
                const w = WORDS.find((x) => x.id === id);
                if (!w) return null;
                const mastered = progress.words[id].level >= 4;
                return (
                  <button key={id} onClick={() => setSelectedLantern(w)} style={{ backgroundColor: mastered ? TOKENS.jadeLight : TOKENS.blush, borderTop: `3px solid ${mastered ? TOKENS.jade : TOKENS.coral}` }} className="rounded-xl aspect-square flex items-center justify-center text-xl md:text-2xl font-bold shadow-sm active:scale-95 transition-transform">
                    <span style={{ color: mastered ? TOKENS.jade : TOKENS.coral }}>{w.hanzi[0]}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <Divider />

        <div className="grid grid-cols-3 gap-3">
          <div style={{ backgroundColor: TOKENS.card }} className="rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <Zap style={{ color: TOKENS.gold }} fill={TOKENS.gold} size={26} />
            <p style={{ color: TOKENS.ink }} className="text-lg font-extrabold">{progress.totalStars || 0}</p>
            <p style={{ color: TOKENS.inkSoft }} className="text-xs">Chi</p>
          </div>
          <div style={{ backgroundColor: TOKENS.card }} className="rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <span className="text-2xl">🥋</span>
            <p style={{ color: TOKENS.ink }} className="text-lg font-extrabold">{masteredCount}</p>
            <p style={{ color: TOKENS.inkSoft }} className="text-xs">Mastered</p>
          </div>
          <div style={{ backgroundColor: TOKENS.card }} className="rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <span className="text-2xl">🏆</span>
            <p style={{ color: TOKENS.ink }} className="text-lg font-extrabold">{bossWinsCount}</p>
            <p style={{ color: TOKENS.inkSoft }} className="text-xs">Boss medals</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button onClick={onParent} style={{ color: TOKENS.inkSoft }} className="text-xs underline inline-flex items-center gap-1">
            <Users size={12} /> For Parents
          </button>
        </div>
      </div>

      {selectedLantern && <LanternModal word={selectedLantern} onClose={() => setSelectedLantern(null)} />}
    </div>
  );
}

function SwatchButton({ swatchColor, icon, unlocked, selected, cost, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: swatchColor || "#F3EFE1", border: selected ? `3px solid ${TOKENS.ink}` : "3px solid transparent" }}
      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative flex-shrink-0"
    >
      {icon && <span className="text-2xl">{icon}</span>}
      {selected && (
        <span style={{ backgroundColor: "#fff" }} className="absolute -top-1.5 -right-1.5 rounded-full p-0.5 shadow">
          <Check size={14} color={TOKENS.jade} />
        </span>
      )}
      {!unlocked && (
        <span style={{ backgroundColor: TOKENS.ink, color: "#fff" }} className="absolute -bottom-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{cost}</span>
      )}
    </button>
  );
}

function CustomizeScreen({ progress, belt, onBack, onSave }) {
  const [draft, setDraft] = useState(progress.equipped);
  const chi = progress.totalStars || 0;

  const categories = [
    { key: "skin", label: "Skin Tone", options: Object.keys(SKIN_TONES).map((id) => ({ id, cost: 0 })) },
    { key: "hair", label: "Hair Color", options: SHOP.hair },
    { key: "outfit", label: "Outfit", options: SHOP.outfit },
    { key: "headband", label: "Headband", options: SHOP.headband },
    { key: "weapon", label: "Weapon", options: SHOP.weapon },
    { key: "cape", label: "Cape", options: SHOP.cape },
  ];

  let pendingCost = 0;
  Object.keys(draft).forEach((cat) => {
    if (cat === "skin") return;
    const owned = (progress.unlocked[cat] || []).includes(draft[cat]);
    if (!owned) {
      const item = (SHOP[cat] || []).find((o) => o.id === draft[cat]);
      pendingCost += item ? item.cost : 0;
    }
  });
  const canSave = chi >= pendingCost;

  function pick(category, itemId) {
    setDraft((d) => ({ ...d, [category]: itemId }));
  }

  function handleSave() {
    if (!canSave) return;
    onSave(draft);
    onBack();
  }

  return (
    <div style={{ background: TOKENS.bg, ...DOT_BG, minHeight: "100vh" }} className="p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <TempleRoofMotif color={TOKENS.spirit} />
        <div className="flex items-center justify-between mb-4 pt-3">
          <button onClick={onBack} style={{ color: TOKENS.inkSoft }} className="flex items-center gap-1 font-semibold">
            <ArrowLeft size={20} /> Back
          </button>
          <div style={{ backgroundColor: TOKENS.card }} className="flex items-center gap-2 rounded-full px-4 py-2 font-bold shadow-sm">
            <Zap style={{ color: TOKENS.gold }} fill={TOKENS.gold} size={18} />
            <span style={{ color: TOKENS.ink }}>{chi} Chi</span>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <div style={{ backgroundColor: TOKENS.card }} className="rounded-full p-4 shadow-lg">
            <HeroAvatar loadout={draft} beltColor={belt.color} size={170} />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{ backgroundColor: canSave ? TOKENS.jade : "#D8CFBA" }}
          className="w-full text-white text-lg font-extrabold rounded-2xl py-4 mb-1 shadow-md active:scale-[0.98] transition-transform"
        >
          {pendingCost > 0 ? `💾 Save Look — ${pendingCost} Chi` : "💾 Save Look — Free"}
        </button>
        {!canSave && <p style={{ color: TOKENS.coral }} className="text-center text-xs font-semibold mb-3">Need {pendingCost - chi} more Chi — try swapping something out</p>}
        <Divider />

        {categories.map((cat) => (
          <div key={cat.key} style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-5 shadow-md mb-4">
            <h3 style={{ color: TOKENS.ink }} className="font-bold mb-3">{cat.label}</h3>
            <div className="flex gap-3 flex-wrap">
              {cat.options.map((opt) => {
                const unlocked = cat.key === "skin" || (progress.unlocked[cat.key] || []).includes(opt.id);
                const isSelected = draft[cat.key] === opt.id;
                const swatchColor = cat.key === "skin" ? SKIN_TONES[opt.id] : cat.key === "weapon" ? null : COLOR_MAPS[cat.key][opt.id];
                const icon = cat.key === "weapon" ? WEAPON_ICON[opt.id] : null;
                return (
                  <SwatchButton key={opt.id} swatchColor={swatchColor} icon={icon} unlocked={unlocked} selected={isSelected} cost={opt.cost || 0} onClick={() => pick(cat.key, opt.id)} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParentGate({ onBack, onSuccess }) {
  const [a] = useState(() => Math.floor(Math.random() * 8) + 3);
  const [b] = useState(() => Math.floor(Math.random() * 8) + 3);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  function check() {
    if (parseInt(input, 10) === a * b) {
      onSuccess();
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  }

  return (
    <div style={{ background: TOKENS.ink, minHeight: "100vh" }} className="flex items-center justify-center p-4">
      <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <Users size={32} style={{ color: TOKENS.inkSoft }} className="mx-auto mb-3" />
        <h2 style={{ color: TOKENS.ink }} className="text-xl font-extrabold mb-1">Parents Only</h2>
        <p style={{ color: TOKENS.inkSoft }} className="text-sm mb-5">
          Quick check — what's {a} × {b}?
        </p>
        <input
          type="number"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ borderColor: error ? TOKENS.coral : "#E8DDCB" }}
          className="w-full text-center text-2xl font-bold border-2 rounded-2xl py-3 mb-4 outline-none"
          placeholder="?"
        />
        {error && (
          <p style={{ color: TOKENS.coral }} className="text-xs font-semibold mb-3">
            Not quite — try again
          </p>
        )}
        <button onClick={check} style={{ backgroundColor: TOKENS.coral }} className="w-full text-white font-extrabold rounded-2xl py-3 mb-2">
          Enter
        </button>
        <button onClick={onBack} style={{ color: TOKENS.inkSoft }} className="text-sm underline">
          Back to app
        </button>
      </div>
    </div>
  );
}

function ParentView({ progress, familyCode, onBack, onChangeFamilyCode, onUpdateEnabledUnits, onReset }) {
  const masteredCount = masteredCountOf(progress);
  const learnedCount = Object.keys(progress.words || {}).length;
  const history = progress.history || [];
  const last14 = history.slice(-14);
  const chartData = last14.map((h) => ({ day: h.date.slice(5), Reviewed: h.reviewed, Chi: h.chi }));
  const totalReviewed = history.reduce((s, h) => s + h.reviewed, 0);
  const totalCorrect = history.reduce((s, h) => s + h.correct, 0);
  const accuracy = totalReviewed > 0 ? Math.round((totalCorrect / totalReviewed) * 100) : null;
  const bossWinsCount = Object.keys(progress.bossHistory || {}).length;
  const [editingCode, setEditingCode] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const effectiveEnabled = progress.enabledUnits && progress.enabledUnits.length > 0 ? progress.enabledUnits : ALL_UNITS;

  function toggleUnit(unit) {
    const isOn = effectiveEnabled.includes(unit);
    let next;
    if (isOn) {
      next = effectiveEnabled.filter((u) => u !== unit);
      if (next.length === 0) return; // always keep at least one chapter active
    } else {
      next = [...effectiveEnabled, unit];
    }
    onUpdateEnabledUnits(next.length === ALL_UNITS.length ? null : next);
  }

  function saveCode() {
    const code = codeInput.trim();
    if (code.length >= 4) {
      onChangeFamilyCode(code);
      setEditingCode(false);
    }
  }

  return (
    <div style={{ background: TOKENS.bg, ...DOT_BG, minHeight: "100vh" }} className="p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} style={{ color: TOKENS.inkSoft }} className="flex items-center gap-1 font-semibold">
            <ArrowLeft size={20} /> Back
          </button>
          <span style={{ color: TOKENS.ink, fontFamily: FONT }} className="text-xl font-extrabold flex items-center gap-2">
            <Users size={20} /> Parent Dashboard
          </span>
        </div>

        {familyCode && (
          <div style={{ backgroundColor: TOKENS.spirit }} className="rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ color: TOKENS.spiritLight }} className="text-xs font-semibold">
                  Family Code — enter this on your phone to sync
                </p>
                <p style={{ color: "#fff" }} className="text-2xl font-extrabold tracking-widest">
                  {familyCode}
                </p>
              </div>
              {editingCode ? (
                <Users size={28} color="#fff" />
              ) : (
                <button
                  onClick={() => { setCodeInput(""); setEditingCode(true); }}
                  style={{ color: "#fff" }}
                  className="text-xs font-semibold underline underline-offset-2 opacity-90"
                >
                  Change
                </button>
              )}
            </div>
            {editingCode && (
              <>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    maxLength={8}
                    placeholder="e.g. K7P2XQ"
                    style={{ color: TOKENS.ink }}
                    className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold bg-white outline-none"
                  />
                  <button onClick={saveCode} style={{ backgroundColor: TOKENS.gold, color: TOKENS.ink }} className="rounded-xl px-4 py-2 text-sm font-bold">
                    Save
                  </button>
                  <button onClick={() => setEditingCode(false)} style={{ color: TOKENS.spiritLight }} className="text-sm font-semibold">
                    Cancel
                  </button>
                </div>
                <p style={{ color: TOKENS.spiritLight }} className="text-xs mt-2 opacity-90">
                  Switches this device to a different code — an existing code syncs with it, a new one starts fresh.
                </p>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div style={{ backgroundColor: TOKENS.card }} className="rounded-2xl p-4 text-center shadow-sm">
            <Flame style={{ color: TOKENS.coral }} className="mx-auto mb-1" size={22} />
            <p style={{ color: TOKENS.ink }} className="text-xl font-extrabold">{progress.streak || 0}</p>
            <p style={{ color: TOKENS.inkSoft }} className="text-xs">Day streak</p>
          </div>
          <div style={{ backgroundColor: TOKENS.card }} className="rounded-2xl p-4 text-center shadow-sm">
            <span className="text-xl">🥋</span>
            <p style={{ color: TOKENS.ink }} className="text-xl font-extrabold">
              {masteredCount}/{learnedCount}
            </p>
            <p style={{ color: TOKENS.inkSoft }} className="text-xs">Mastered</p>
          </div>
          <div style={{ backgroundColor: TOKENS.card }} className="rounded-2xl p-4 text-center shadow-sm">
            <span className="text-xl">🎯</span>
            <p style={{ color: TOKENS.ink }} className="text-xl font-extrabold">{accuracy !== null ? `${accuracy}%` : "—"}</p>
            <p style={{ color: TOKENS.inkSoft }} className="text-xs">Accuracy</p>
          </div>
          <div style={{ backgroundColor: TOKENS.card }} className="rounded-2xl p-4 text-center shadow-sm">
            <span className="text-xl">🏆</span>
            <p style={{ color: TOKENS.ink }} className="text-xl font-extrabold">{bossWinsCount}</p>
            <p style={{ color: TOKENS.inkSoft }} className="text-xs">Boss medals</p>
          </div>
        </div>

        <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-5 shadow-md mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: TOKENS.ink }} className="font-bold">Practice chapters</h3>
            {progress.enabledUnits && (
              <button onClick={() => onUpdateEnabledUnits(null)} style={{ color: TOKENS.spirit }} className="text-xs font-semibold underline underline-offset-2">
                Select all
              </button>
            )}
          </div>
          <p style={{ color: TOKENS.inkSoft }} className="text-xs mb-3">
            Choose which lessons new words and reviews are drawn from — handy for focusing on chapters before a school test.
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_UNITS.map((unit) => {
              const active = effectiveEnabled.includes(unit);
              return (
                <button
                  key={unit}
                  onClick={() => toggleUnit(unit)}
                  style={{ backgroundColor: active ? TOKENS.jade : TOKENS.bg, color: active ? "#fff" : TOKENS.inkSoft }}
                  className="rounded-full px-3 py-1.5 text-xs font-bold"
                >
                  {unit.replace("Lesson ", "L")}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-5 shadow-md mb-6">
          <h3 style={{ color: TOKENS.ink }} className="font-bold mb-4">
            Practice history {last14.length ? `(last ${last14.length} active day${last14.length === 1 ? "" : "s"})` : ""}
          </h3>
          {chartData.length === 0 ? (
            <p style={{ color: TOKENS.inkSoft }} className="text-sm text-center py-8">
              No sessions completed yet — this fills in once he starts practicing.
            </p>
          ) : (
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D2" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: TOKENS.inkSoft }} />
                  <YAxis tick={{ fontSize: 11, fill: TOKENS.inkSoft }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", fontSize: 12 }} />
                  <Bar dataKey="Reviewed" fill={TOKENS.jade} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Chi" fill={TOKENS.gold} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-5 shadow-md mb-6">
          <h3 style={{ color: TOKENS.ink }} className="font-bold mb-3">About this data</h3>
          <p style={{ color: TOKENS.inkSoft }} className="text-sm leading-relaxed">
            "Reviewed" counts characters answered per day; "Chi" is points earned. Progress is saved on this device only — a skipped day just won't show a bar. Words are currently drawn from Lessons 1–14 of the official MOE Primary 1 character list ({WORDS.length} words so far).
          </p>
        </div>

        <div style={{ backgroundColor: TOKENS.card, border: `2px solid ${TOKENS.coral}` }} className="rounded-3xl p-5 shadow-md">
          <h3 style={{ color: TOKENS.coralDark }} className="font-bold mb-2">Danger zone</h3>
          <p style={{ color: TOKENS.inkSoft }} className="text-sm leading-relaxed mb-4">
            Permanently erase all progress for this Family Code — every mastered character, streak, Chi, and boss medal. This cannot be undone.
          </p>
          <button onClick={() => setShowResetConfirm(true)} style={{ backgroundColor: TOKENS.blush, color: TOKENS.coralDark }} className="font-bold rounded-2xl px-5 py-2.5 text-sm">
            Reset all progress
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36,28,21,0.6)" }} onClick={() => setShowResetConfirm(false)}>
          <div style={{ backgroundColor: TOKENS.card, borderTop: `6px solid ${TOKENS.coral}` }} className="rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl mb-3">⚠️</p>
            <h3 style={{ color: TOKENS.ink }} className="text-xl font-extrabold mb-2">Reset everything?</h3>
            <p style={{ color: TOKENS.inkSoft }} className="text-sm leading-relaxed mb-6">
              This permanently erases all progress for this Family Code — mastered characters, streak, Chi, and boss medals. There is no undo.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowResetConfirm(false)} style={{ backgroundColor: "#F3EFE1", color: TOKENS.ink }} className="flex-1 font-bold rounded-2xl py-3">
                Cancel
              </button>
              <button
                onClick={() => { onReset(); setShowResetConfirm(false); }}
                style={{ backgroundColor: TOKENS.coral }}
                className="flex-1 text-white font-bold rounded-2xl py-3"
              >
                Yes, reset everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LanternModal({ word, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(36,28,21,0.6)" }} onClick={onClose}>
      <div style={{ backgroundColor: TOKENS.card, borderTop: `6px solid ${TOKENS.coral}` }} className="rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-2xl mb-1">👹</p>
        <p style={{ color: TOKENS.ink }} className="text-6xl font-bold mb-3">{word.hanzi}</p>
        <p style={{ color: TOKENS.coral }} className="text-xl font-semibold mb-1">{word.pinyin}</p>
        <p style={{ color: TOKENS.inkSoft }} className="text-lg mb-4">{word.meaning}</p>
        <button onClick={() => speak(word.hanzi)} style={{ backgroundColor: TOKENS.jadeLight, color: TOKENS.jade }} className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-semibold mb-4">
          <Volume2 size={18} /> Listen
        </button>
        <p style={{ color: TOKENS.inkSoft }} className="text-sm italic">{word.example}</p>
        <button onClick={onClose} style={{ backgroundColor: TOKENS.coral }} className="mt-5 text-white font-bold rounded-full px-6 py-2">Close</button>
      </div>
    </div>
  );
}

function ProgressBar({ label, index, total, color }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span style={{ color: TOKENS.inkSoft }} className="text-sm font-semibold">{label}</span>
        <span style={{ color: TOKENS.inkSoft }} className="text-sm">{index + 1} / {total}</span>
      </div>
      <div style={{ backgroundColor: "#F0E6D2" }} className="h-2 rounded-full overflow-hidden">
        <div style={{ backgroundColor: color, width: `${((index + 1) / total) * 100}%` }} className="h-full rounded-full transition-all" />
      </div>
    </div>
  );
}

function ReviewCard({ word, total, index, onAnswer }) {
  const [mode, setMode] = useState("meaning");
  const [choices, setChoices] = useState([]);
  const [picked, setPicked] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const useMode = Math.random() < 0.5 ? "meaning" : "pinyin";
    setMode(useMode);
    const target = useMode === "meaning" ? word.meaning : word.pinyin;
    const distractors = shuffle(WORDS.filter((w) => w.id !== word.id)).slice(0, 2).map((w) => (useMode === "meaning" ? w.meaning : w.pinyin));
    setChoices(shuffle([target, ...distractors]));
    setPicked(null);
    setShowResult(false);
  }, [word]);

  const target = mode === "meaning" ? word.meaning : word.pinyin;

  function choose(opt) {
    if (showResult) return;
    setPicked(opt);
    setShowResult(true);
    setTimeout(() => onAnswer(word, opt === target), 900);
  }

  return (
    <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-6 md:p-10 shadow-lg">
      <ProgressBar label="Battle" index={index} total={total} color={TOKENS.jade} />
      <div className="text-center my-8">
        <div className="text-4xl mb-2">👹</div>
        <button onClick={() => speak(word.hanzi)} className="inline-flex flex-col items-center gap-2">
          <span style={{ color: TOKENS.ink }} className="text-7xl md:text-8xl font-bold">{word.hanzi}</span>
          <span style={{ color: TOKENS.inkSoft }} className="text-lg flex items-center gap-1">
            <Volume2 size={16} />
            {mode === "meaning" && word.pinyin}
          </span>
        </button>
      </div>
      <p style={{ color: TOKENS.inkSoft }} className="text-center mb-4 font-semibold">
        {mode === "meaning" ? "A spirit blocks your path! What does it mean?" : "A spirit blocks your path! Which pinyin matches?"}
      </p>
      <div className="grid gap-3">
        {choices.map((opt) => {
          let bg = "#F3EFE1", color = TOKENS.ink;
          if (showResult && opt === target) { bg = TOKENS.jadeLight; color = TOKENS.jade; }
          else if (showResult && opt === picked) { bg = "#FBE3DF"; color = TOKENS.coralDark; }
          return (
            <button key={opt} onClick={() => choose(opt)} style={{ backgroundColor: bg, color }} className="rounded-2xl py-4 text-lg md:text-xl font-bold shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
              {opt}
              {showResult && opt === target && <Check size={20} />}
              {showResult && opt === picked && opt !== target && <X size={20} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NewWordCard({ word, total, index, onDone }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setRevealed(false); }, [word]);

  return (
    <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-6 md:p-10 shadow-lg">
      <ProgressBar label="New Spirit" index={index} total={total} color={TOKENS.coral} />
      <div style={{ backgroundColor: TOKENS.blush }} className="rounded-3xl p-8 text-center my-6">
        <div className="text-3xl mb-2">😈</div>
        <p style={{ color: TOKENS.ink }} className="text-7xl md:text-8xl font-bold mb-2">{word.hanzi}</p>
        <p style={{ color: TOKENS.coral }} className="text-xl font-bold mb-1">{word.pinyin}</p>
        <p style={{ color: TOKENS.ink }} className="text-lg mb-4">{word.meaning}</p>
        <button onClick={() => speak(word.hanzi)} style={{ backgroundColor: "#fff", color: TOKENS.coral }} className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-semibold shadow-sm">
          <Volume2 size={18} /> Listen
        </button>
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)} style={{ backgroundColor: TOKENS.sky }} className="w-full text-white text-lg font-bold rounded-2xl py-4">See it in action</button>
      ) : (
        <div style={{ backgroundColor: TOKENS.jadeLight }} className="rounded-2xl p-5 mb-2">
          <p style={{ color: TOKENS.ink }} className="text-lg font-semibold mb-1">{word.example}</p>
          <p style={{ color: TOKENS.inkSoft }} className="text-sm">{word.exampleMeaning}</p>
        </div>
      )}
      <button onClick={onDone} style={{ backgroundColor: TOKENS.coral }} className="w-full text-white text-lg md:text-xl font-extrabold rounded-2xl py-4 mt-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        Seal it! <ArrowRight size={20} />
      </button>
    </div>
  );
}

function ListeningDash({ words, onComplete }) {
  const pool = words.slice(0, Math.min(6, words.length));
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [picked, setPicked] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const correctRef = useRef(0);
  const word = pool[idx];

  useEffect(() => {
    if (!word) return;
    const distractors = shuffle(WORDS.filter((w) => w.id !== word.id)).slice(0, 2);
    setChoices(shuffle([word, ...distractors]));
    setPicked(null);
    setShowResult(false);
    const t = setTimeout(() => speak(word.hanzi), 400);
    return () => clearTimeout(t);
  }, [idx]);

  if (!word) return null;

  function choose(opt) {
    if (showResult) return;
    setPicked(opt.id);
    setShowResult(true);
    if (opt.id === word.id) correctRef.current += 1;
    setTimeout(() => {
      const next = idx + 1;
      if (next < pool.length) setIdx(next);
      else onComplete(correctRef.current * 15);
    }, 900);
  }

  return (
    <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-6 md:p-10 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <span style={{ color: TOKENS.inkSoft }} className="text-sm font-semibold flex items-center gap-1">
          <Headphones size={14} /> Listening Dash
        </span>
        <span style={{ color: TOKENS.inkSoft }} className="text-sm">
          {idx + 1} / {pool.length}
        </span>
      </div>
      <div className="text-center my-8">
        <button
          onClick={() => speak(word.hanzi)}
          style={{ backgroundColor: TOKENS.sky }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-md active:scale-95 transition-transform"
        >
          <Volume2 size={40} color="#fff" />
        </button>
        <p style={{ color: TOKENS.inkSoft }} className="mt-3 text-sm font-semibold">
          Tap to hear it again
        </p>
      </div>
      <p style={{ color: TOKENS.inkSoft }} className="text-center mb-4 font-semibold">
        Which spirit did you hear?
      </p>
      <div className="grid grid-cols-3 gap-3">
        {choices.map((opt) => {
          let bg = "#F3EFE1",
            color = TOKENS.ink;
          if (showResult && opt.id === word.id) {
            bg = TOKENS.jadeLight;
            color = TOKENS.jade;
          } else if (showResult && opt.id === picked) {
            bg = "#FBE3DF";
            color = TOKENS.coralDark;
          }
          return (
            <button key={opt.id} onClick={() => choose(opt)} style={{ backgroundColor: bg, color }} className="rounded-2xl py-5 text-3xl font-bold shadow-sm active:scale-[0.98] transition-transform">
              {opt.hanzi}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SpeedRound({ words, onComplete }) {
  const pool = words.slice(0, Math.min(6, words.length));
  const DURATION = 6000;
  const [idx, setIdx] = useState(0);
  const [choices, setChoices] = useState([]);
  const [picked, setPicked] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const chiRef = useRef(0);
  const startRef = useRef(Date.now());
  const rafRef = useRef(null);
  const word = pool[idx];

  useEffect(() => {
    if (!word) return;
    const distractors = shuffle(WORDS.filter((w) => w.id !== word.id)).slice(0, 2).map((w) => w.meaning);
    setChoices(shuffle([word.meaning, ...distractors]));
    setPicked(null);
    setShowResult(false);
    startRef.current = Date.now();
    setTimeLeft(DURATION);
    function tick() {
      const elapsed = Date.now() - startRef.current;
      const remaining = Math.max(DURATION - elapsed, 0);
      setTimeLeft(remaining);
      if (remaining <= 0) handleTimeout();
      else rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [idx]);

  if (!word) return null;

  function advance() {
    cancelAnimationFrame(rafRef.current);
    const next = idx + 1;
    if (next < pool.length) setIdx(next);
    else onComplete(chiRef.current);
  }

  function handleTimeout() {
    setShowResult((sr) => {
      if (!sr) setTimeout(advance, 700);
      return true;
    });
  }

  function choose(opt) {
    if (showResult) return;
    cancelAnimationFrame(rafRef.current);
    setPicked(opt);
    setShowResult(true);
    if (opt === word.meaning) {
      const speedBonus = Math.round((timeLeft / DURATION) * 15);
      chiRef.current += 10 + speedBonus;
    }
    setTimeout(advance, 700);
  }

  const pct = (timeLeft / DURATION) * 100;

  return (
    <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-6 md:p-10 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <span style={{ color: TOKENS.inkSoft }} className="text-sm font-semibold flex items-center gap-1">
          <Timer size={14} /> Lightning Round
        </span>
        <span style={{ color: TOKENS.inkSoft }} className="text-sm">
          {idx + 1} / {pool.length}
        </span>
      </div>
      <div style={{ backgroundColor: "#F0E6D2" }} className="h-2 rounded-full overflow-hidden mb-6">
        <div style={{ backgroundColor: pct < 30 ? TOKENS.coral : TOKENS.gold, width: `${pct}%`, transition: "width 0.05s linear" }} className="h-full rounded-full" />
      </div>
      <div className="text-center mb-6">
        <button onClick={() => speak(word.hanzi)} className="inline-flex flex-col items-center gap-1">
          <span style={{ color: TOKENS.ink }} className="text-7xl font-bold">
            {word.hanzi}
          </span>
          <span style={{ color: TOKENS.inkSoft }} className="text-base flex items-center gap-1">
            <Volume2 size={14} />
            {word.pinyin}
          </span>
        </button>
      </div>
      <div className="grid gap-3">
        {choices.map((opt) => {
          let bg = "#F3EFE1",
            color = TOKENS.ink;
          if (showResult && opt === word.meaning) {
            bg = TOKENS.jadeLight;
            color = TOKENS.jade;
          } else if (showResult && opt === picked) {
            bg = "#FBE3DF";
            color = TOKENS.coralDark;
          }
          return (
            <button key={opt} onClick={() => choose(opt)} style={{ backgroundColor: bg, color }} className="rounded-2xl py-4 text-lg font-bold shadow-sm active:scale-[0.98] transition-transform">
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MatchGame({ words, onComplete }) {
  const pairs = words.slice(0, Math.min(6, words.length));
  const [matchMode] = useState(() => (Math.random() < 0.5 ? "meaning" : "pinyin"));
  const [hanziDeck] = useState(() => shuffle(pairs.map((w) => ({ key: w.id + "-h", id: w.id, label: w.hanzi }))));
  const [meaningDeck] = useState(() => shuffle(pairs.map((w) => ({ key: w.id + "-m", id: w.id, label: matchMode === "meaning" ? w.meaning : w.pinyin }))));
  const [selectedHanzi, setSelectedHanzi] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrongFlash, setWrongFlash] = useState(null);

  function pickHanzi(item) { if (matched.includes(item.id)) return; setSelectedHanzi(item); }
  function pickMeaning(item) {
    if (!selectedHanzi || matched.includes(item.id)) return;
    if (item.id === selectedHanzi.id) {
      const newMatched = [...matched, item.id];
      setMatched(newMatched);
      setSelectedHanzi(null);
      if (newMatched.length === pairs.length) setTimeout(() => onComplete(25), 500);
    } else {
      setWrongFlash(item.id);
      setTimeout(() => setWrongFlash(null), 400);
      setSelectedHanzi(null);
    }
  }

  return (
    <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-6 md:p-10 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <span style={{ color: TOKENS.inkSoft }} className="text-sm font-semibold">⚡ Final Strike Combo</span>
        <span style={{ color: TOKENS.inkSoft }} className="text-sm">{matched.length} / {pairs.length}</span>
      </div>
      <p style={{ color: TOKENS.inkSoft }} className="text-center mb-5 font-semibold">Tap a spirit, then its {matchMode === "meaning" ? "meaning" : "pinyin"} to strike!</p>
      <div className="grid grid-cols-2 gap-6">
        <div className="grid gap-3">
          {hanziDeck.map((item) => (
            <button key={item.key} disabled={matched.includes(item.id)} onClick={() => pickHanzi(item)}
              style={{
                backgroundColor: matched.includes(item.id) ? TOKENS.jadeLight : selectedHanzi?.id === item.id ? TOKENS.coral : TOKENS.blush,
                color: matched.includes(item.id) ? TOKENS.jade : selectedHanzi?.id === item.id ? "#fff" : TOKENS.ink,
                opacity: matched.includes(item.id) ? 0.5 : 1,
              }}
              className="rounded-2xl py-4 text-2xl font-bold shadow-sm transition-transform active:scale-95">
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3">
          {meaningDeck.map((item) => (
            <button key={item.key} disabled={matched.includes(item.id)} onClick={() => pickMeaning(item)}
              style={{
                backgroundColor: matched.includes(item.id) ? TOKENS.jadeLight : wrongFlash === item.id ? "#FBE3DF" : "#F3EFE1",
                color: matched.includes(item.id) ? TOKENS.jade : TOKENS.ink,
                opacity: matched.includes(item.id) ? 0.5 : 1,
              }}
              className="rounded-2xl py-4 text-base md:text-lg font-bold shadow-sm transition-transform active:scale-95">
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryScreen({ stars, streak, wordsLearned, wordsReviewed, onHome }) {
  return (
    <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-8 md:p-12 shadow-lg text-center">
      <div className="text-7xl mb-4">🥋⚔️</div>
      <h2 style={{ color: TOKENS.ink }} className="text-2xl md:text-3xl font-extrabold mb-2">Victory!</h2>
      <p style={{ color: TOKENS.inkSoft }} className="mb-6">The spirits have been sealed for today.</p>
      <div className="flex justify-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <Zap style={{ color: TOKENS.gold }} fill={TOKENS.gold} size={26} />
          <span style={{ color: TOKENS.ink }} className="text-xl font-extrabold">+{stars} Chi</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame style={{ color: TOKENS.coral }} fill={TOKENS.coral} size={26} />
          <span style={{ color: TOKENS.ink }} className="text-xl font-extrabold">{streak} day{streak === 1 ? "" : "s"}</span>
        </div>
      </div>
      <p style={{ color: TOKENS.inkSoft }} className="text-sm mb-8">{wordsLearned} new spirit{wordsLearned === 1 ? "" : "s"} sealed · {wordsReviewed} reviewed</p>
      <button onClick={onHome} style={{ backgroundColor: TOKENS.coral }} className="text-white text-lg font-extrabold rounded-2xl px-8 py-4 inline-flex items-center gap-2">
        <HomeIcon size={20} /> Return to Village
      </button>
    </div>
  );
}

function BossBattle({ words, equipped, beltColor, onComplete }) {
  const battleWords = words;
  const [idx, setIdx] = useState(0);
  const [bossHP, setBossHP] = useState(battleWords.length);
  const [heroHP, setHeroHP] = useState(3);
  const [mode, setMode] = useState("meaning");
  const [choices, setChoices] = useState([]);
  const [picked, setPicked] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [phase, setPhase] = useState(battleWords.length ? "battle" : "victory");
  const [chi, setChi] = useState(0);

  useEffect(() => {
    if (idx >= battleWords.length) return;
    const word = battleWords[idx];
    const useMode = Math.random() < 0.5 ? "meaning" : "pinyin";
    setMode(useMode);
    const target = useMode === "meaning" ? word.meaning : word.pinyin;
    const distractors = shuffle(WORDS.filter((w) => w.id !== word.id)).slice(0, 2).map((w) => (useMode === "meaning" ? w.meaning : w.pinyin));
    setChoices(shuffle([target, ...distractors]));
    setPicked(null);
    setShowResult(false);
  }, [idx]);

  if (phase === "victory") return <BossVictory chi={chi} onDone={() => onComplete(chi)} />;

  const word = battleWords[idx];
  const target = mode === "meaning" ? word.meaning : word.pinyin;
  const hpPct = (bossHP / battleWords.length) * 100;

  function choose(opt) {
    if (showResult) return;
    setPicked(opt);
    setShowResult(true);
    const correct = opt === target;
    setTimeout(() => {
      if (correct) { setBossHP((hp) => Math.max(hp - 1, 0)); setChi((c) => c + 20); }
      else setHeroHP((hp) => Math.max(hp - 1, 1));
      const nextIdx = idx + 1;
      if (nextIdx >= battleWords.length) setPhase("victory");
      else setIdx(nextIdx);
    }, 900);
  }

  return (
    <div style={{ backgroundColor: TOKENS.ink }} className="rounded-3xl p-6 md:p-10 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <HeroAvatar loadout={equipped} beltColor={beltColor} size={50} />
          <div className="flex gap-1">
            {[1, 2, 3].map((n) => (<span key={n} className="text-lg">{n <= heroHP ? "❤️" : "🖤"}</span>))}
          </div>
        </div>
        <span style={{ color: "#fff" }} className="text-sm font-bold">Round {Math.min(idx + 1, battleWords.length)} / {battleWords.length}</span>
        <span className="text-3xl">🐉</span>
      </div>
      <div className="mb-6">
        <div style={{ backgroundColor: "rgba(255,255,255,0.15)" }} className="h-4 rounded-full overflow-hidden">
          <div style={{ backgroundColor: TOKENS.spirit, width: `${hpPct}%` }} className="h-full rounded-full transition-all duration-500" />
        </div>
        <p style={{ color: "#fff" }} className="text-xs mt-1 text-center opacity-70">Boss HP</p>
      </div>
      <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-6 md:p-8">
        <div className="text-center mb-4">
          <button onClick={() => speak(word.hanzi)} className="inline-flex flex-col items-center gap-2">
            <span style={{ color: TOKENS.ink }} className="text-6xl md:text-7xl font-bold">{word.hanzi}</span>
            <span style={{ color: TOKENS.inkSoft }} className="text-base flex items-center gap-1">
              <Volume2 size={14} />
              {mode === "meaning" && word.pinyin}
            </span>
          </button>
        </div>
        <p style={{ color: TOKENS.inkSoft }} className="text-center mb-3 text-sm font-semibold">{mode === "meaning" ? "What does it mean?" : "Which pinyin matches?"}</p>
        <div className="grid gap-3">
          {choices.map((opt) => {
            let bg = "#F3EFE1", color = TOKENS.ink;
            if (showResult && opt === target) { bg = TOKENS.jadeLight; color = TOKENS.jade; }
            else if (showResult && opt === picked) { bg = "#FBE3DF"; color = TOKENS.coralDark; }
            return (
              <button key={opt} onClick={() => choose(opt)} style={{ backgroundColor: bg, color }} className="rounded-2xl py-4 text-lg font-bold shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                {opt}
                {showResult && opt === target && <Check size={18} />}
                {showResult && opt === picked && opt !== target && <X size={18} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BossVictory({ chi, onDone }) {
  return (
    <div style={{ backgroundColor: TOKENS.card }} className="rounded-3xl p-8 md:p-12 shadow-lg text-center">
      <div className="text-7xl mb-4">🏆</div>
      <h2 style={{ color: TOKENS.ink }} className="text-2xl md:text-3xl font-extrabold mb-2">Boss Defeated!</h2>
      <p style={{ color: TOKENS.inkSoft }} className="mb-6">You've earned a new medal, little warrior.</p>
      <div className="flex items-center justify-center gap-2 mb-8">
        <Zap style={{ color: TOKENS.gold }} fill={TOKENS.gold} size={26} />
        <span style={{ color: TOKENS.ink }} className="text-xl font-extrabold">+{chi} Chi</span>
      </div>
      <button onClick={onDone} style={{ backgroundColor: TOKENS.spirit }} className="text-white text-lg font-extrabold rounded-2xl px-8 py-4 inline-flex items-center gap-2">
        <HomeIcon size={20} /> Return to Village
      </button>
    </div>
  );
}
