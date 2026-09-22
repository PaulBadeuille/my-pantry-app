export interface OpenFoodFactsResponse {
  status: number;
  product?: OpenFoodFactsProduct;
}

export interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  image_front_url?: string;
  code?: string;
  categories?: string;
  nutriscore_grade: 'a' | 'b' | 'c' | 'd' | 'e';
}

export interface MyPantryProduct {
  product: OpenFoodFactsProduct;
  quantity: number;
  unit: 'piece' | 'kg' | 'g' | 'l' | 'cl';
  expirationDate: Date;
  minThreshold: number;
  storagePlace: 'closet' | 'fridge' | 'freezer';
}
