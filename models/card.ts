export interface CardItem {
  id: number;
  description: string;
  fuel: string;
  mileage: string;
  transmission: string;
  sale_price: string;
  formattedPrice: string;
  thumbnail: string;
  brand: string;
  model: string;
  year: number;
  carData: {
    [key: string]: any;
  };
  mainData: {
    [key: string]: any;
  };
  [key: string]: any;
}
