import { WordEntry } from '../types';

// ---------------------------------------------------------------------------
// Word library — nested by category, then by difficulty.
// This structure is the source of truth and is designed for easy expansion:
// add a category by adding a key, add words by extending an array.
// The flat `fallbackWords` export (consumed by the game hook) is derived below.
// ---------------------------------------------------------------------------

export const CATEGORIES = ['Animals', 'Food', 'Holidays', 'Spring', 'Desserts', 'Entertainment'] as const;
export type Category = typeof CATEGORIES[number];

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

type WordLibrary = Record<Category, Record<Difficulty, string[]>>;

const wordLibrary: WordLibrary = {
  Animals: {
    easy: [
      'RABBIT', 'BUNNY', 'BEAR', 'TIGER', 'LION', 'HORSE', 'ZEBRA', 'MONKEY',
      'PANDA', 'OTTER', 'KOALA', 'BEAVER', 'KITTEN', 'PUPPY', 'GOOSE', 'DUCK',
      'CHICKEN', 'ROOSTER', 'DONKEY', 'TURTLE',
    ],
    medium: [
      'FLAMINGO', 'PENGUIN', 'KANGAROO', 'HEDGEHOG', 'BUTTERFLY', 'WOODPECKER',
      'BLUEBIRD', 'SQUIRREL', 'PORCUPINE', 'RACCOON', 'PELICAN', 'PEACOCK',
      'LADYBUG', 'FIREFLY', 'CATERPILLAR', 'OCTOPUS', 'STARFISH', 'JELLYFISH',
      'SEAHORSE', 'DOLPHIN',
    ],
    hard: [
      'CHAMELEON', 'ARMADILLO', 'AXOLOTL', 'ORANGUTAN', 'NARWHAL', 'PLATYPUS',
      'WOLVERINE', 'CROCODILE', 'ALLIGATOR', 'HIPPOPOTAMUS', 'CHIMPANZEE',
      'DRAGONFLY', 'HUMMINGBIRD', 'BARRACUDA', 'CUTTLEFISH', 'KINGFISHER',
      'MANTIS', 'OPOSSUM', 'WARTHOG', 'GAZELLE',
    ],
  },

  Food: {
    easy: [
      'PIZZA', 'BURGER', 'TACO', 'APPLE', 'BANANA', 'CARROT', 'POTATO',
      'ORANGE', 'GRAPES', 'CHEESE', 'BREAD', 'PASTA', 'RICE', 'BACON',
      'CHICKEN', 'STEAK', 'SAUSAGE', 'TOMATO', 'ONION', 'PEPPER',
    ],
    medium: [
      'AVOCADO', 'BROCCOLI', 'PINEAPPLE', 'WATERMELON', 'BLUEBERRY',
      'STRAWBERRY', 'ASPARAGUS', 'CAULIFLOWER', 'ARTICHOKE', 'ZUCCHINI',
      'CUCUMBER', 'SPINACH', 'MUSHROOM', 'PRETZEL', 'POPCORN', 'MEATBALL',
      'LASAGNA', 'BURRITO', 'QUESADILLA', 'SANDWICH',
    ],
    hard: [
      'JALAPENO', 'EGGPLANT', 'BRUSSELS', 'SAUERKRAUT', 'PROSCIUTTO',
      'GNOCCHI', 'FETTUCCINE', 'CIABATTA', 'BAGUETTE', 'GAZPACHO',
      'EDAMAME', 'RATATOUILLE', 'BOUILLABAISSE', 'CAPICOLA', 'KIMCHI',
      'ESCARGOT', 'RISOTTO', 'PIEROGI', 'SHAKSHUKA', 'TABBOULEH',
    ],
  },

  Holidays: {
    easy: [
      'EASTER', 'HALLOWEEN', 'CHRISTMAS', 'HANUKKAH', 'KWANZAA', 'HOLIDAY',
      'PARADE', 'TURKEY', 'FIREWORK', 'COSTUME', 'PUMPKIN', 'EGGNOG',
      'CUPID', 'RABBIT', 'BASKET', 'CANDY', 'SNOWMAN', 'REINDEER',
      'LANTERN', 'PARTY',
    ],
    medium: [
      'VALENTINE', 'THANKSGIVING', 'FIREWORKS', 'SHAMROCK',
      'LEPRECHAUN', 'MENORAH', 'STOCKING', 'WREATH', 'ORNAMENT',
      'JACKOLANTERN', 'CONFETTI', 'COUNTDOWN', 'CELEBRATION',
      'RESOLUTION', 'HEART', 'RIBBON', 'BONFIRE', 'CORNUCOPIA',
      'CRANBERRY', 'GINGERBREAD',
    ],
    hard: [
      'INDEPENDENCE', 'MISTLETOE', 'NUTCRACKER', 'POINSETTIA',
      'CANDELABRA', 'EVERGREEN', 'NOISEMAKER', 'MASQUERADE',
      'GROUNDHOG', 'HANUKKIAH', 'PEPPERMINT', 'CAROLING', 'TRADITION',
      'DECORATION', 'FESTIVAL', 'COMMEMORATION', 'HARVEST',
      'TABLECLOTH', 'CENTERPIECE',
    ],
  },

  Spring: {
    easy: [
      'TULIP', 'ROBIN', 'NEST', 'BLOOM', 'RAIN', 'GRASS', 'BEE', 'BUG',
      'SUN', 'CLOUD', 'PUDDLE', 'LEAF', 'SEED', 'PLANT', 'WIND', 'KITE',
      'DUCKLING', 'CHICK', 'BUNNY', 'GARDEN',
    ],
    medium: [
      'RAINBOW', 'BLOSSOM', 'MEADOW', 'BUTTERFLY', 'BLUEBIRD', 'LADYBUG',
      'DAFFODIL', 'SUNSHINE', 'RAINDROP', 'BIRDHOUSE', 'WILDFLOWER',
      'BUTTERCUP', 'PICNIC', 'HUMMINGBIRD', 'SPROUT', 'CLOVER', 'SONGBIRD',
      'TREEHOUSE', 'WATERING', 'FLOWERPOT',
    ],
    hard: [
      'HYACINTH', 'FORSYTHIA', 'CROCUS', 'BLUEBELL', 'PRIMROSE', 'DOGWOOD',
      'MAGNOLIA', 'LADYBUG', 'DRAGONFLY', 'HONEYSUCKLE', 'CHERRYBLOSSOM',
      'WILDFLOWER', 'HUMMINGBIRD', 'WOODPECKER', 'POLLINATION',
      'PHOTOSYNTHESIS', 'BUMBLEBEE', 'GREENHOUSE', 'BUTTERCUP', 'FIREFLY',
    ],
  },

  Desserts: {
    easy: [
      'COOKIE', 'BROWNIE', 'CUPCAKE', 'DONUT', 'CANDY', 'FUDGE', 'MUFFIN',
      'SUNDAE', 'GELATO', 'SORBET', 'PUDDING', 'PIE', 'TART', 'TRUFFLE',
      'BONBON', 'ECLAIR', 'PARFAIT', 'COBBLER', 'TAFFY', 'WAFFLE',
    ],
    medium: [
      'CHEESECAKE', 'CANNOLI', 'MACARON', 'BISCOTTI', 'BAKLAVA',
      'MERINGUE', 'CREAMPUFF', 'SOUFFLE', 'SHORTBREAD', 'MARSHMALLOW',
      'CROISSANT', 'CHURRO', 'PROFITEROLE', 'GANACHE', 'MADELEINE',
      'CRUMBLE', 'STRUDEL', 'NAPOLEON', 'PAVLOVA', 'TIRAMISU',
    ],
    hard: [
      'SEMIFREDDO', 'CLAFOUTIS', 'FINANCIER', 'CHARLOTTE', 'MILLEFEUILLE',
      'CANNELE', 'FRANGIPANE', 'ZABAGLIONE', 'FLORENTINE', 'PANETTONE',
      'AMARETTI', 'SACHERTORTE', 'KOUIGNAMANN', 'MARZIPAN', 'OPERA',
      'DIPLOMAT', 'DACQUOISE', 'BIENENSTICH', 'PANNACOTTA', 'GALETTE',
    ],
  },

  Entertainment: {
    easy: [
      'MOVIE', 'CINEMA', 'ACTOR', 'ACTRESS', 'COMEDY', 'DRAMA', 'HERO',
      'VILLAIN', 'CARTOON', 'FAMILY', 'MAGIC', 'ROBOT', 'PIRATE',
      'WIZARD', 'CASTLE', 'DRAGON', 'PRINCESS', 'MONSTER', 'DETECTIVE',
      'ADVENTURE',
    ],
    medium: [
      'ANIMATED', 'DIRECTOR', 'SCREENPLAY', 'SUPERHERO', 'TREASURE',
      'SPACESHIP', 'TIMETRAVEL', 'KINGDOM', 'MYSTERY', 'FANTASY',
      'EXPLORER', 'SIDEKICK', 'SOUNDTRACK', 'PREMIERE', 'HOLLYWOOD',
      'TELEVISION', 'CHAMPION', 'CREATURE', 'JOURNEY',
    ],
    hard: [
      'BLOCKBUSTER', 'DOCUMENTARY', 'CINEMATOGRAPHY', 'CHOREOGRAPHY',
      'TRANSFORMATION', 'APOCALYPSE', 'ARCHAEOLOGIST', 'SCREENWRITER',
      'PRODUCTION', 'ILLUSIONIST', 'MULTIVERSE', 'ADVENTURELAND',
      'INTERSTELLAR', 'CONSTELLATION', 'EXPEDITION', 'LABYRINTH',
      'ENCHANTMENT', 'MYTHOLOGY', 'LEGENDARY', 'IMAGINATION',
    ],
  },
};

// ---------------------------------------------------------------------------
// Derived flat list consumed by the game hook.
// The hook filters by category and difficulty, so the shape of this array
// (flat WordEntry[]) is preserved for backwards compatibility.
// ---------------------------------------------------------------------------

let idCounter = 0;
function makeId(category: string, difficulty: string, index: number): string {
  return `${category[0].toLowerCase()}${difficulty[0]}${index}`;
}

export const fallbackWords: WordEntry[] = CATEGORIES.flatMap(category =>
  DIFFICULTIES.flatMap(difficulty =>
    wordLibrary[category][difficulty].map((word) => ({
      id: makeId(category, difficulty, idCounter++),
      word,
      category,
      difficulty,
    }))
  )
);

// Get words filtered by category and weighted by difficulty
export function getWordsForDifficulty(words: WordEntry[], difficulty: Difficulty): WordEntry[] {
  // Weighted selection: mostly target difficulty, some from adjacent
  const targetWords = words.filter(w => w.difficulty === difficulty);
  const adjacentWords = words.filter(w => w.difficulty !== difficulty);

  // Return target words, padded with some adjacent if needed
  if (targetWords.length >= 10) {
    return targetWords;
  }
  return [...targetWords, ...adjacentWords.slice(0, 20 - targetWords.length)];
}
