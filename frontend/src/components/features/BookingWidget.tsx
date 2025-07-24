import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import StarRating from "../ui/StarRating";

interface BookingWidgetProps {
  pricePerNight: string;
  guestScore: number;
  reviewsCount: number;
}

const BookingWidget: React.FC<BookingWidgetProps> = ({
  pricePerNight,
  guestScore,
  reviewsCount,
}) => {
  const [guests, setGuests] = useState(1);

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 border">
      <div className="flex justify-between items-baseline mb-4">
        <div>
          <span className="text-2xl font-bold">
            ${parseFloat(pricePerNight).toFixed(2)}
          </span>
          <span className="text-base font-normal text-gray-600">/ night</span>
        </div>
        <div className="flex items-center text-sm">
          <StarRating
            rating={guestScore}
            starClassName="h-4 w-4"
            containerClassName="mr-1"
          />
          <span className="font-semibold">{guestScore.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">({reviewsCount} reviews)</span>
        </div>
      </div>

      <div className="border rounded-lg mt-4">
        <div className="grid grid-cols-2">
          <div className="p-3 border-r">
            <label
              htmlFor="checkin"
              className="block text-xs font-bold uppercase"
            >
              Check-in
            </label>
            <input
              type="text"
              id="checkin"
              placeholder="Add date"
              className="w-full text-sm border-0 p-0 focus:ring-0"
            />
          </div>
          <div className="p-3">
            <label
              htmlFor="checkout"
              className="block text-xs font-bold uppercase"
            >
              Check-out
            </label>
            <input
              type="text"
              id="checkout"
              placeholder="Add date"
              className="w-full text-sm border-0 p-0 focus:ring-0"
            />
          </div>
        </div>
        <div className="p-3 border-t">
          <label htmlFor="guests" className="block text-xs font-bold uppercase">
            Guests
          </label>
          <div className="flex justify-between items-center">
            <input
              type="text"
              id="guests"
              value={`${guests} guest${guests > 1 ? "s" : ""}`}
              readOnly
              className="w-full text-sm border-0 p-0 focus:ring-0"
            />
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      <button className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
        Reserve
      </button>
      <p className="text-center text-sm text-gray-500 mt-3">
        You won't be charged yet
      </p>
    </div>
  );
};

export default BookingWidget;
