export interface StockFile {
  path: string;
  thumb: string;
  name: string;
  imageLoaded: boolean;
  ratioMatch: boolean;
}
export interface CarDetails {
  id: number;
  description: string;
  formattedPrice: string;
  fuel: string;
  mileage: string;
  utrustningList: string[];
  transmission: string;
  sale_price: string;
  sale_price_num: number;
  thumbnail: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  noOfSeat: string;
  wheelDrive: string;
  noOfDoors: string;
  horsePower: string;
  engineCapacity: string;
  co2Emission: string;
  cnHighway: string;
  cnCity: string;
  cnMixed: string;
  length: string;
  width: string;
  height: string;
  weightWithOutBreak: string;
  weightBreak: string;
  carData: {
    vehicle_type: string;
    [key: string]: any;
  };
  mainData: {
    [key: string]: any;
  };
  attributes: {
    [key: string]: any;
  };
  carPlaningInfo: {
    [key: string]: any;
  };
  sellerInfo: {
    [key: string]: any;
  };
  carExtraInfo: {
    [key: string]: any;
  };
  buyInfo: {
    [key: string]: any;
  };
  sellInfo: {
    [key: string]: any;
  };
  stock_files: StockFile[];
  [key: string]: any;
}
export enum EnquiryType {
  talk = 'talk',
  reserve = 'reserve',
}
