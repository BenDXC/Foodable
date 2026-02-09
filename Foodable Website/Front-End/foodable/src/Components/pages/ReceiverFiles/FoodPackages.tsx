export interface FoodPackage {
  packageID: string;
  packageLocation: string;
  packageType: 'Halal' | 'Vegetarian' | 'Vegan' | 'Non-Halal';
  packageDesc: string;
}

export const foodpackages: FoodPackage[] = [
  {
    packageID: "Package 1",
    packageLocation: "Uxbridge",
    packageType: "Halal",
    packageDesc: "This package contains halal food",
  },
  {
    packageID: "Package 2",
    packageLocation: "Hillingdon",
    packageType: "Vegetarian",
    packageDesc: "This package contains vegetarian food",
  },
  {
    packageID: "Package 3",
    packageLocation: "Harewood",
    packageType: "Vegan",
    packageDesc: "This package contains vegan food",
  },
  {
    packageID: "Package 4",
    packageLocation: "Uxbridge",
    packageType: "Halal",
    packageDesc: "This package contains halal food",
  },
];
