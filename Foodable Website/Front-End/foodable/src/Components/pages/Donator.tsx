import React, { useState, FormEvent, ChangeEvent } from "react";
import "./cssFiles/Donator.css";
import "./cssFiles/CreateDonation.css";
import { SetUserProps } from "../../types";
import UserSidebar from "../shared/UserSidebar";

interface DonationFormData {
  itemName?: string;
  itemQuantity?: number;
  dietaryPreference?: string;
  expiryDate?: string;
  image?: File;
}

export default function DonatorPage(props: SetUserProps): JSX.Element {
  // TODO: Get username from context/props
  const username = "User"; // Replace with actual user data

  return (
    <div className="profilecontainer">
      <UserSidebar username={username} />
      <CreateDonation />
    </div>
  );
}
function CreateDonation(): JSX.Element {
  const [formData, setFormData] = useState<DonationFormData>({});
  const [items, setItems] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Add item to list
    if (formData.itemName) {
      setItems([...items, formData.itemName]);
      setFormData({});
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] : value
    }));
  };

  return (
    <div className="profilecontainer">
      <div className="cdbackground">
        <div className="itemform">
          <h1 className="titleil" id="donation-form-heading">Create Donation</h1>
          <form 
            className="create-form" 
            onSubmit={handleSubmit}
            aria-labelledby="donation-form-heading"
          >
            <h2 className="itemname" id="item-name-label">Item name</h2>
            <input
              type="text"
              name="itemName"
              id="txt"
              className="nameinput"
              value={formData.itemName || ''}
              onChange={handleChange}
              required
              aria-required="true"
              aria-labelledby="item-name-label"
              aria-label="Enter the name of the item you are donating"
            />
            <h2 className="itemquantity" id="item-quantity-label">Item quantity</h2>
            <input
              type="number"
              name="itemQuantity"
              id="number"
              className="itemq"
              value={formData.itemQuantity || ''}
              onChange={handleChange}
              min={1}
              max={100}
              required
              aria-required="true"
              aria-labelledby="item-quantity-label"
              aria-label="Enter quantity between 1 and 100"
            />
            <h2 className="dtitle" id="dietary-preference-legend">Select dietary preference</h2>
            <fieldset aria-labelledby="dietary-preference-legend" role="radiogroup">
            <input
              type="radio"
              name="dietaryPreference"
              id="dietary-halal"
              value="halal"
              checked={formData.dietaryPreference === 'halal'}
              onChange={handleChange}
              required
            />
            <label htmlFor="dietary-halal"> Halal</label>
            <br />
            <input
              type="radio"
              name="dietaryPreference"
              id="dietary-non-halal"
              value="non-halal"
              checked={formData.dietaryPreference === 'non-halal'}
              onChange={handleChange}
            />
            <label htmlFor="dietary-non-halal"> Non-Halal</label>
            <br />
            <input
              type="radio"
              name="dietaryPreference"
              id="dietary-vegan"
              value="vegan"
              checked={formData.dietaryPreference === 'vegan'}
              onChange={handleChange}
            />
            <label htmlFor="dietary-vegan"> Vegan</label>
            <br />
            <input
              type="radio"
              name="dietaryPreference"
              id="dietary-vegetarian"
              value="vegetarian"
              checked={formData.dietaryPreference === 'vegetarian'}
              onChange={handleChange}
            />
            <label htmlFor="dietary-vegetarian"> Vegetarian</label>
            </fieldset>
            <br />
            <h2 className="extitle" id="expiry-date-label">Expiry date</h2>
            <input 
              type="date" 
              name="expiryDate" 
              id="Expiry" 
              value={formData.expiryDate || ''}
              onChange={handleChange}
              required
              aria-required="true"
              aria-labelledby="expiry-date-label"
              aria-label="Select expiry date for the item"
            />
            <h2 className="imagetitle" id="image-upload-label">Upload image</h2>
            <input
              type="file"
              id="FoodImage"
              name="image"
              accept="image/*"
              onChange={handleChange}
              aria-labelledby="image-upload-label"
              aria-label="Upload an image of the food item (optional)"
            />
            <br />
            <button 
              type="submit" 
              className="sub-btn"
              aria-label="Add item to donation package"
            >
              Add item
            </button>
          </form>
          <h2 className="ptitle" id="package-items-heading">Item added to package</h2>
          <div className="itemlist" role="region" aria-labelledby="package-items-heading">
            <ul className="ilist" role="list" aria-label="Items in current package">
              <li>
                <span>x</span>
              </li>
              <li>
                <span>x</span>
              </li>
              <li>
                <span>x</span>
              </li>
            </ul>
            <button 
              type="submit" 
              className="cp-btn"
              aria-label="Create and submit donation package"
            >
              Create package
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
