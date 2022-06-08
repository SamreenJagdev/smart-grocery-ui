const itemOptions = [
  {
    category: 'Fruits',
    items: ['Apples', 'Bananas', 'Grapes', 'Oranges', 'Strawberries', 'Avocados', 'Peaches']
  },
  {
    category: 'Vegetables',
    items: ['Potatoes', 'Onions', 'Carrots', 'Salad Greens', 'Broccoli', 'Beppers', 'Tomatoes', 'Cucumbers']
  },
  {
    category: 'Canned Goods',
    items: ['Soup', 'Tuna', 'Fruit', 'Beans', 'Vegetables', 'Pasta Sauce']
  },
  {
    category: 'Dairy',
    items: ['Butter', 'Cheese', 'Eggs', 'Milk', 'Yogurt']
  },
  {
    category: 'Meat',
    items: ['Chicken', 'Beef', 'Pork', 'Sausage', 'Bacon']
  },
  {
    category: 'Fish & Seafood',
    items: ['Shrimp', 'Crab', 'Cod', 'Tuna', 'Salmon']
  },
  {
    category: 'Deli',
    items: ['Cheese', 'Salami', 'Ham', 'Turkey']
  },
  {
    category: 'Condiments & Spices',
    items: ['Black Pepper', 'Oregano', 'Cinnamon', 'Sugar', 'Olive Oil', 'Ketchup', 'Mayonnaise']
  },
  {
    category: 'Snacks',
    items: ['Chips', 'Pretzels', 'Popcorn', 'Crackers', 'Nuts']
  },
  {
    category: 'Bread & Bakery',
    items: ['Bread', 'Tortillas', 'Pies', 'Muffins', 'Bagels', 'Cookies']
  },
  {
    category: 'Beverages',
    items: ['Coffee', 'Teabags', 'Milk', 'Juice', 'Soda', 'Beer', 'Wine']
  },
  {
    category: 'Pasta, Rice & Cereal',
    items: ['Oats', 'granola', 'brown rice', 'white rice', 'macaroni', 'noodles']
  },
  {
    category: 'Baking',
    items: ['Flour', 'Powdered Sugar', 'Baking Powder', 'Cocoa']
  },
  {
    category: 'Frozen Foods',
    items: ['Pizza', 'Fish', 'Potatoes', 'Ready Meals', 'Ice Cream']
  },
  {
    category: 'Personal Care',
    items: ['Shampoo', 'conditioner', 'deodorant', 'toothpaste', 'dental floss']
  },
  {
    category: 'Health Care',
    items: ['Saline', 'Band-aid', 'Cleaning Alcohol', 'Pain Killers', 'Antacids']
  },
  {
    category: 'Household & Cleaning Supplies',
    items: ['Laundry Detergent', 'Dish Soap', 'Dishwashing Liquid', 'Paper Towels', 'Tissues', 'Trash Bags', 'Aluminum Foil', 'Zip Bags']
  },
  {
    category: 'Baby Items',
    items: ['Baby Food', 'Diapers', 'Wet Wipes', 'Lotion']
  },
  {
    category: 'Pet Care',
    items: ['Pet Food', 'Kitty Litter', 'Chew Toys', 'Pet Treats', 'Pet Shampoo']
  }
]

const getAllOptions = () => {
  return itemOptions
}

const getAllCategories = () => {
  return itemOptions.map((i) => i.category).sort()
}

const getAllSubCategories = () => {
  let allSubCategories = []
  itemOptions.map((i) => allSubCategories.push(...i.items))
  return [...new Set(allSubCategories.sort())]
}

const getSubCategory = (category) => {
  if (category === undefined || category === '') {
    return getAllSubCategories()
  } else {
    const subcategories = itemOptions.find((i) => i.category === category.trim())
    return subcategories && subcategories.items ? subcategories.items.sort() : []
  }
}

const CategoriesService = {
  getAllOptions,
  getAllCategories,
  getAllSubCategories,
  getSubCategory
}

export default CategoriesService
