/**
 * MLBB Items Database — Offline JSON Cache & Data Grounding
 * Contains 45 core equipment items categorized by Attack, Magic, Defense, Movement, Roaming.
 */

export const ITEMS_DATA = [
  // ATTACK
  {
    id: 101,
    name: "Blade of Despair",
    category: "Attack",
    cost: 3010,
    stats: "+160 Physical Attack, +5% Movement Speed",
    passive: "Despair: Attacking enemy units that have HP below 50% increases Physical Attack by 25% for 2s.",
    counterTag: "Burst",
    bestFor: ["Fanny", "Hayabusa", "Beatrix", "Lesley", "Chou"],
    arabicName: "نصل اليأس",
    arabicDesc: "+160 هجوم جسدي. يزيد الهجوم بنسبة 25% عند ضرب أعداء قدرتهم الصحية أقل من 50%."
  },
  {
    id: 102,
    name: "Demon Hunter Sword",
    category: "Attack",
    cost: 2180,
    stats: "+35 Physical Attack, +25% Attack Speed",
    passive: "Devour: Basic Attacks deal 8% of target's current HP as extra physical damage. Gain Lifesteal on hit.",
    counterTag: "Anti-Tank",
    bestFor: ["Claude", "Karrie", "Wanwan", "Sun", "Badang"],
    arabicName: "سيف صياد الشياطين",
    arabicDesc: "مضاد التانك الرئيسي. تلحق الضربات العادية ضرراً إضافياً بنسبة 8% من صحة الهدف الحالية."
  },
  {
    id: 103,
    name: "Malefic Roar",
    category: "Attack",
    cost: 2060,
    stats: "+60 Physical Attack, +20% Physical Penetration",
    passive: "Armor Buster: Gain up to 20% extra Physical Penetration based on target's Physical Defense.",
    counterTag: "Anti-Armor",
    bestFor: ["Beatrix", "Brody", "Clint", "Nolan", "Hayabusa"],
    arabicName: "زئير مؤذي",
    arabicDesc: "اختراق الدرع الجسدي. يمنح اختراقاً إضافياً يتناسب مع قوة درع العدو الجسدي."
  },
  {
    id: 104,
    name: "Corrosion Scythe",
    category: "Attack",
    cost: 2050,
    stats: "+30 Physical Attack, +5% Movement Speed, +35% Attack Speed",
    passive: "Corrosion & Impulse: Basic attacks slow target by 8% and grant 6% attack speed per stack.",
    counterTag: "Slow / Speed",
    bestFor: ["Wanwan", "Claude", "Karrie", "Irithel"],
    arabicName: "منجل التآكل",
    arabicDesc: "يبطئ حركة العدو مع كل ضربة ويزيد من سرعة هجومك المتتالية."
  },
  {
    id: 105,
    name: "War Axe",
    category: "Attack",
    cost: 1980,
    stats: "+35 Physical Attack, +400 HP, +10% Cooldown Reduction, +12% Spell Vamp",
    passive: "Fighting Spirit: Dealing damage grants physical attack and penetration stacks up to 8.",
    counterTag: "Sustain Fighter",
    bestFor: ["Alpha", "Terizla", "Balmond", "Thamuz", "Martis"],
    arabicName: "فأس الحرب",
    arabicDesc: "فأس المقاتلين. يمنح اختراقاً جسدياً وسرعة وقوة هجوم تتزايد أثناء القتال."
  },

  // MAGIC
  {
    id: 201,
    name: "Holy Crystal",
    category: "Magic",
    cost: 2180,
    stats: "+100 Magic Power",
    passive: "Mystery: Increases Magic Power by 21% - 35% (scaling with hero level).",
    counterTag: "Magic Power Scaler",
    bestFor: ["Eudora", "Aurora", "Gusion", "Vexana", "Kadita"],
    arabicName: "البلورة المقدسة",
    arabicDesc: "+100 قوة سحرية. تزيد القوة السحرية الكلية بنسبة تصل إلى 35% حسب المستوى."
  },
  {
    id: 202,
    name: "Divine Glaive",
    category: "Magic",
    cost: 1970,
    stats: "+65 Magic Power, +40% Magic Penetration",
    passive: "Spellbreaker: Gain extra Magic Penetration for each point of enemy's Magic Defense.",
    counterTag: "Anti-Magic Tank",
    bestFor: ["Lunox", "Gusion", "Zhuxin", "Pharsa", "Xavier"],
    arabicName: "الحربة الإلهية",
    arabicDesc: "+40% اختراق سحري. تخترق دفاعات السحر الصلبة لدروع التانك."
  },
  {
    id: 203,
    name: "Genius Wand",
    category: "Magic",
    cost: 2000,
    stats: "+75 Magic Power, +5% Movement Speed, +10 Magic Penetration",
    passive: "Magic Justice: Dealing damage reduces target's Magic Defense by 3-7 for 2s (stacks 3 times).",
    counterTag: "Flat Penetration",
    bestFor: ["Gusion", "Harley", "Eudora", "Vexana", "Chang'e"],
    arabicName: "عصا العبقري",
    arabicDesc: "تقلل درع العدو السحري مع كل ضربة سحرية متتالية."
  },
  {
    id: 204,
    name: "Lightning Truncheon",
    category: "Magic",
    cost: 2250,
    stats: "+75 Magic Power, +400 Mana, +10% Cooldown Reduction",
    passive: "Resonate: Every 6s, next spell bounces to up to 3 enemies dealing magic damage scaling with Max Mana.",
    counterTag: "AOE Burst",
    bestFor: ["Vexana", "Zhuxin", "Odette", "Pharsa", "Cecilion"],
    arabicName: "عصا الصاعقة",
    arabicDesc: "تطلق صاعقة ترتد بين 3 أعداء وتحدث ضرراً سحرياً يتناسب مع حد المانا الأقصى."
  },
  {
    id: 205,
    name: "Wishing Lantern",
    category: "Magic",
    cost: 2160,
    stats: "+70 Magic Power, +10% Cooldown Reduction",
    passive: "Butterfly Goddess: For every 800 magic damage dealt, launches a butterfly dealing 8% target Max HP magic damage.",
    counterTag: "Anti-Tank Magic",
    bestFor: ["Zhuxin", "Chang'e", "Valir", "Yve", "Gord"],
    arabicName: "فانوس الأمنيّات",
    arabicDesc: "فانوس مضاد للتانك السحري. يطلق فراشة إضافية تسبب 8% من صحة العدو القصوى."
  },

  // DEFENSE
  {
    id: 301,
    name: "Dominance Ice",
    category: "Defense",
    cost: 2010,
    stats: "+500 Mana, +70 Physical Defense, +5% Movement Speed",
    passive: "Arctic Cold: Reduces Attack Speed of nearby enemy heroes to 70% and reduces healing/shields by 50%.",
    counterTag: "Anti-Heal / Anti-AttackSpeed",
    bestFor: ["Tigreal", "Khufra", "Terizla", "Gatotkaca", "Minotaur", "All Roamers"],
    arabicName: "هيمنة الجليد",
    arabicDesc: "مضاد العلاج والسرعة الإجباري! يقلل سرعة هجوم الأعداء القريبين ويدمر تجديد صحة العدو بنسبة 50%."
  },
  {
    id: 302,
    name: "Athena's Shield",
    category: "Defense",
    cost: 2150,
    stats: "+900 HP, +62 Magic Defense, +2 HP Regen",
    passive: "Shield: Triggered upon taking Magic Damage. Reduces Magic Damage taken by 25% for 3s.",
    counterTag: "Anti-Burst Magic",
    bestFor: ["Tanks", "Fighters", "Marksmen vs Eudora/Kadita/Gusion"],
    arabicName: "درع أثينا",
    arabicDesc: "الحماية القصوى من الضرر السحري الخاطف. يقلل الضرر السحري المتلقى بنسبة 25% لمدة 3 ثوان."
  },
  {
    id: 303,
    name: "Radiant Armor",
    category: "Defense",
    cost: 1980,
    stats: "+950 HP, +52 Magic Defense, +12 HP Regen",
    passive: "Holy Blessing: Taking Magic Damage increases Magic Defense by 5-8 for 3s (up to 6 stacks).",
    counterTag: "Anti-Continuous Magic",
    bestFor: ["Tanks", "Fighters vs Chang'e/Valir/Yve/Zhuxin"],
    arabicName: "الدرع المشع",
    arabicDesc: "مضاد الضرر السحري المستمر (مثل شنجي وفالير). يزيد الدفاع السحري مع كل ضربة متتالية."
  },
  {
    id: 304,
    name: "Antique Cuirass",
    category: "Defense",
    cost: 2170,
    stats: "+920 HP, +54 Physical Defense, +4 HP Regen",
    passive: "Deter: Being hit by enemy skill reduces their Physical Damage by 6% for 2s (up to 3 stacks).",
    counterTag: "Anti-Physical Skill Burst",
    bestFor: ["Tanks", "EXP Laners vs Terizla/Paquito/Alpha/Fanny"],
    arabicName: "الدرع القديم",
    arabicDesc: "يقلل الضرر الجسدي الناتج عن المهارات للأعداء عند تلقي الضربات."
  },
  {
    id: 305,
    name: "Immortality",
    category: "Defense",
    cost: 2120,
    stats: "+800 HP, +20 Physical Defense",
    passive: "Immortal: Resurrect 2.5s after dying with 16% HP and a 220-1200 shield (210s cooldown).",
    counterTag: "Revive",
    bestFor: ["All Heroes in late game"],
    arabicName: "الخلود",
    arabicDesc: "يعيد إحياء البطل بعد الموت بنسبة صحة ودرع واقٍ في المعارك المتأخرة."
  }
];
