import { BedDouble, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

interface Room {
  id: string;
  room_type: string;
  price: number;
  bed_count: number;
  max_adults: number;
  description?: string;
}

interface RoomWidgetProps {
  rooms: Room[];
  hotelId: string;
}

const RoomWidget = ({ rooms, hotelId }: RoomWidgetProps) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <p className="text-gray-500 text-center">No rooms available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Select a Room</h3>
      <div className="space-y-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
          >
            <h4 className="font-medium text-gray-900 capitalize mb-2">
              {room.room_type.replace(/_/g, " ")}
            </h4>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <BedDouble className="w-4 h-4 mr-1" />
                <span>{room.bed_count} Bed(s)</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{room.max_adults} Guests</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span className="text-xl font-bold text-gray-900">
                  {room.price}
                </span>
                <span className="text-gray-600 text-sm ml-1">/night</span>
              </div>
              <Link
                to={`/hotel/${hotelId}/room/${room.id}/book`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomWidget;
