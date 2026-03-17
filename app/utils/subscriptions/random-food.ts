export interface FoodOption {
  label: string;
  unit: string;
  price: number;
  imageSrc: string;
}

export interface FoodResult extends FoodOption {
  count: number;
}

export const FOOD_OPTIONS: FoodOption[] = [
  {
    label: "스타벅스 커피",
    unit: "잔",
    price: 4500,
    imageSrc: "/images/emoji/main-coffee.png",
  },
  {
    label: "버블티",
    unit: "잔",
    price: 5500,
    imageSrc: "/images/emoji/main-bubbletea.png",
  },
  {
    label: "햄버거",
    unit: "개",
    price: 6900,
    imageSrc: "/images/emoji/main-burger.png",
  },
  {
    label: "치킨",
    unit: "마리",
    price: 23000,
    imageSrc: "/images/emoji/main-chicken.png",
  },
  {
    label: "피자",
    unit: "판",
    price: 28000,
    imageSrc: "/images/emoji/main-pizza.png",
  },
];

export const MIN_FOOD_PRICE = Math.min(
  ...FOOD_OPTIONS.map((food) => food.price)
);

export function getFoodCount(totalPrice: number, foodPrice: number) {
  if (
    !Number.isFinite(totalPrice) ||
    !Number.isFinite(foodPrice) ||
    totalPrice <= 0 ||
    foodPrice <= 0
  ) {
    return 0;
  }

  return Math.floor(totalPrice / foodPrice);
}

export function makeFoodResult(
  food: FoodOption,
  totalPrice: number
): FoodResult {
  return {
    ...food,
    count: getFoodCount(totalPrice, food.price),
  };
}

export function getAvailableFoods(totalPrice: number) {
  return FOOD_OPTIONS.filter(
    (food) => getFoodCount(totalPrice, food.price) > 0
  );
}

export function getDefaultFood(totalPrice: number) {
  const availableFoods = getAvailableFoods(totalPrice);
  const defaultFood = availableFoods[0] ?? FOOD_OPTIONS[0];

  return makeFoodResult(defaultFood, totalPrice);
}

export function getRandomFood(totalPrice: number) {
  const availableFoods = getAvailableFoods(totalPrice);
  const randomFoods = availableFoods.length > 0 ? availableFoods : FOOD_OPTIONS;
  const randomIndex = Math.floor(Math.random() * randomFoods.length);

  return makeFoodResult(randomFoods[randomIndex], totalPrice);
}
