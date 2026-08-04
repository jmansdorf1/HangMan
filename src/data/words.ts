import { WordEntry } from '../types';

// ---------------------------------------------------------------------------
// Word library — nested by category, then by difficulty.
// This structure is the source of truth and is designed for easy expansion:
// add a category by adding a key, add words by extending an array.
// The flat `fallbackWords` export (consumed by the game hook) is derived below.
// ---------------------------------------------------------------------------

export const CATEGORIES = ['Animals', 'Food', 'Holidays', 'Spring', 'Dessert', 'Movies'] as const;
export type Category = typeof CATEGORIES[number];

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

type WordLibrary = Record<Category, Record<Difficulty, string[]>>;

const wordLibrary: WordLibrary = {
  Animals: {
    // Easy (3-5 letters)
    easy: [
      'BEAR', 'BIRD', 'CAT', 'DOG', 'DUCK', 'FISH', 'FROG', 'GOAT', 'GOOSE',
      'HORSE', 'LION', 'MOOSE', 'MOUSE', 'PANDA', 'PIG', 'SHEEP', 'SNAKE',
      'TIGER', 'WHALE', 'WOLF', 'ZEBRA', 'DEER', 'SEAL', 'CRAB', 'SWAN',
    ],
    // Medium (6-8 letters)
    medium: [
      'BADGER', 'BEAVER', 'BUFFALO', 'CAMEL', 'COYOTE', 'DOLPHIN', 'DONKEY',
      'FLAMINGO', 'GERBIL', 'GIRAFFE', 'GORILLA', 'HAMSTER', 'JAGUAR',
      'LEMUR', 'LEOPARD', 'MONKEY', 'OCELOT', 'OPOSSUM', 'OSTRICH', 'OTTER',
      'PENGUIN', 'PORCUPINE', 'RABBIT', 'RACCOON', 'RHINO', 'SALMON',
      'SQUIRREL', 'TORTOISE', 'WALRUS', 'WEASEL', 'CHEETAH', 'PARROT',
      'TURKEY', 'TURTLE', 'COBRA',
    ],
    // Hard (9+ letters)
    hard: [
      'ALLIGATOR', 'ANTELOPE', 'BUTTERFLY', 'CROCODILE', 'DRAGONFLY',
      'ELEPHANT', 'GRASSHOPPER', 'HIPPOPOTAMUS', 'HUMMINGBIRD', 'KANGAROO',
      'LADYBUG', 'OCTOPUS', 'PLATYPUS', 'RHINOCEROS', 'SCORPION',
      'SEAHORSE', 'STINGRAY', 'TARANTULA', 'WOODPECKER', 'CATERPILLAR',
    ],
  },

  Food: {
    easy: [
      'BACON', 'BREAD', 'CORN', 'DOUGH', 'FRUIT', 'GRAPE', 'GUAVA', 'LEMON',
      'MANGO', 'MELON', 'NACHO', 'NOODLE', 'OLIVE', 'ONION', 'PASTA',
      'PEACH', 'PEAR', 'PIZZA', 'PLUM', 'RADISH', 'RICE', 'SALAD', 'SALSA',
      'SOUP', 'STEAK', 'TOAST',
    ],
    medium: [
      'APRICOT', 'ASPARAGUS', 'AVOCADO', 'BROCCOLI', 'BURRITO', 'CABBAGE',
      'CARROT', 'CASHEW', 'CELERY', 'CEREAL', 'CHERRY', 'COCONUT',
      'CRACKER', 'CURRY', 'DUMPLING', 'FALAFEL', 'FETTUCCINE', 'GINGER',
      'HAMBURGER', 'LASAGNA', 'LETTUCE', 'MUSHROOM', 'OMELETTE', 'PARSLEY',
      'POPCORN', 'POTATO', 'PUMPKIN', 'RAVIOLI', 'SAUSAGE', 'SPINACH',
      'SQUASH', 'TORTILLA', 'WASABI',
    ],
    hard: [
      'BLUEBERRY', 'CAULIFLOWER', 'CLEMENTINE', 'EGGPLANT', 'GRAPEFRUIT',
      'GUACAMOLE', 'HONEYDEW', 'PINEAPPLE', 'RASPBERRY', 'SANDWICH',
      'WATERMELON', 'TANGERINE', 'STRAWBERRY',
    ],
  },

  Holidays: {
    easy: [
      'CAROL', 'CARDS', 'FEAST', 'GIFT', 'GLOVES', 'GREET', 'HOLLY', 'JOLLY',
      'PARTY', 'PIE', 'TREE', 'WISH', 'CHEER', 'CLOVE', 'CANDY', 'LIGHT',
      'SONG', 'WRAP', 'SMILE', 'SHARE',
    ],
    medium: [
      'ADVENT', 'BELLS', 'CANDY CANE', 'CHIMNEY', 'COCOA', 'COOKIES',
      'CRACKER', 'DREIDEL', 'ELF', 'FROSTY', 'GINGER', 'GRINCH', 'KWANZAA',
      'LAMPS', 'MENORAH', 'MISTLETOE', 'NATIVITY', 'ORIGINS', 'ORNAMENT',
      'PARADE', 'RIBBON', 'RUDOLPH', 'SANTA', 'SCROOGE', 'SNOWMAN',
      'STOCKING', 'TINSEL', 'TRADITION', 'WREATH', 'YULETIDE', 'REINDEER',
      'PRESENT',
    ],
    hard: [
      'CELEBRATION', 'CHRISTMAS', 'DECORATION', 'FESTIVITIES',
      'GINGERBREAD', 'HANUKKAH', 'HOLIDAYS', 'NORTH POLE', 'NUTCRACKER',
      'SLEIGH', 'SNOWFLAKE', 'THANKSGIVING', 'VALENTINE', 'NEW YEARS',
      'FIREWORKS', 'PUMPKIN PIE',
    ],
  },

  Spring: {
    easy: [
      'BIRD', 'BLOOM', 'BUD', 'BEE', 'CALF', 'DAISY', 'DRIZZLE', 'FERN',
      'FLOWER', 'FOAL', 'FROG', 'GRASS', 'HATCH', 'IRIS', 'LAMB', 'LILAC',
      'MEADOW', 'MELT', 'NEST', 'PETAL', 'POND', 'RAIN', 'ROBIN', 'ROSE',
      'SEED', 'SPROUT', 'STEM', 'SUN', 'THAW', 'TULIP', 'VINE', 'WARM',
    ],
    medium: [
      'ANIMAL', 'BLOSSOM', 'BREEZE', 'BUTTERFLY', 'CHICK', 'CROCUS',
      'DAFFODIL', 'GARDEN', 'GROWTH', 'HIBERNATE', 'HYACINTH', 'LADYBUG',
      'LAVENDER', 'MIGRATE', 'ORCHID', 'PICNIC', 'POLLEN', 'PUDDLE',
      'RAINDROP', 'RENEWAL', 'SHOWER', 'SUNSHINE', 'SWALLOW', 'UMBRELLA',
      'VERNAL',
    ],
    hard: [
      'BLUEBONNET', 'CATTAIL', 'CHERRY BLOSSOM', 'COLUMBINE', 'CORNFLOWER',
      'EQUINOX', 'HONEYBEE', 'HUMMINGBIRD', 'MARIGOLD', 'MOTHERS DAY',
      'NASTURTIUM', 'PERENNIAL', 'PANSY', 'RHODODENDRON', 'SUNFLOWER',
      'WILDFLOWER', 'WISTERIA', 'WOODPECKER',
    ],
  },

  Dessert: {
    easy: [
      'CAKE', 'TART', 'PIE', 'CONE', 'CANDY', 'CREAM', 'JELLY', 'FUDGE',
      'SWEET', 'BROWNIE', 'COOKIE', 'DONUT', 'SCOOP', 'FROST', 'TRUFFLE',
      'PUDDING', 'FROZEN', 'SWEET', 'SUGAR', 'GLAZE', 'LAYER', 'BERRY',
    ],
    medium: [
      'CUPCAKE', 'PANCAKE', 'SORBET', 'CHEESECAKE', 'TOFFEE', 'CARAMEL',
      'COCOA', 'BUTTERSCOTCH', 'GELATO', 'MOUSSE', 'STRAWBERRY', 'WAFFLE',
      'MERINGUE', 'MACARON', 'SPRINKLES', 'VANILLA', 'CHOCOLATE',
      'SHORTCAKE', 'TIRAMISU', 'PARFAIT', 'ECLAIR', 'CREPE', 'BISCOTTI',
    ],
    hard: [
      'ICE CREAM', 'MARSHMALLOW', 'BLUEBERRY', 'PINEAPPLE', 'RASPBERRY',
      'CINNAMON', 'NUTELLA', 'POMEGRANATE', 'TANGERINE', 'CROISSANT',
      'APFELSTRUDEL', 'BLACK FOREST', 'RED VELVET', 'GINGERBREAD',
      'BANANA SPLIT', 'PEANUT BUTTER', 'PEPPERMINT', 'STRUDEL',
      'CHANDELIER', 'AMBROSIA',
    ],
  },

  Movies: {
    easy: [
      'ACT', 'CLAP', 'DRAMA', 'FILM', 'HERO', 'MOVIE', 'POP', 'PREVIEW',
      'SCENE', 'SEAT', 'SHOW', 'SONG', 'STAR', 'TITLE', 'TRAILER',
      'ACTOR', 'PLOT', 'CAST', 'REEL', 'DRAMA',
    ],
    medium: [
      'ACTION', 'ANIMATION', 'AWARD', 'CAMERA', 'CAPTION', 'CARTOON',
      'CINEMA', 'CLASSIC', 'COMEDY', 'CREDITS', 'DIRECTOR', 'FANTASY',
      'HORROR', 'MUSICAL', 'MYSTERY', 'NETWORK', 'OSCAR', 'PREMIERE',
      'REVIEW', 'ROMANCE', 'SCREEN', 'SCRIPT', 'SEQUEL', 'SILENT',
      'SOUNDTRACK', 'SUSPENSE', 'THRILLER', 'TICKETS', 'WESTERN',
      'FEATURE',
    ],
    hard: [
      'ADVENTURE', 'BLOCKBUSTER', 'BROADCAST', 'BOX OFFICE', 'CAMEO',
      'DOCUMENTARY', 'EDITOR', 'FICTION', 'GREENSCREEN', 'LIGHTING',
      'MONOLOGUE', 'MOTION', 'PANORAMIC', 'PARAMOUNT', 'PICTURES',
      'PLAYBILL', 'PRODUCER', 'SCIENCE FICTION', 'SHOWTIME',
      'SPECIAL FX', 'SPOTLIGHT', 'STUNTMAN', 'SUPERHERO', 'TELEVISION',
      'WIDESCREEN',
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
