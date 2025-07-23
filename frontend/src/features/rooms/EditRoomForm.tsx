import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../config/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { roomTypes } from "../../config/roomTypes";
import { Room } from "../../types/api";
import { Trash } from "lucide-react";

interface EditRoomFormProps {
  room: Room;
  onSuccess: () => void;
}

interface FormValues {
  price: string;
  description: string | null;
  bed_count: number;
  max_adults: number;
  room_type: string;
  images?: FileList;
}

const useUpdateRoom = (roomId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updatedRoom: FormData) =>
      api
        .patch(`/hotels/rooms/${roomId}/`, updatedRoom, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: { data: any }) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

const useDeleteRoomImage = (roomId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) =>
      api.delete(`/hotels/rooms/${roomId}/images/${imageId}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

const EditRoomForm: React.FC<EditRoomFormProps> = ({ room, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      price: room.price,
      description: room.description,
      bed_count: room.bed_count,
      max_adults: room.max_adults,
      room_type: room.room_type,
    },
  });
  const updateRoomMutation = useUpdateRoom(room.id.toString());
  const deleteImageMutation = useDeleteRoomImage(room.id.toString());

  useEffect(() => {
    reset({
      price: room.price,
      description: room.description,
      bed_count: room.bed_count,
      max_adults: room.max_adults,
      room_type: room.room_type,
    });
  }, [room, reset]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("bed_count", data.bed_count);
    formData.append("max_adults", data.max_adults);
    formData.append("room_type", data.room_type);
    if (data.images) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    try {
      await updateRoomMutation.mutateAsync(formData);
      onSuccess();
    } catch (error) {
      console.error("Failed to update room:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          {...register("price", { required: "Price is required" })}
          error={errors.price?.message as string}
        />
        <Input
          label="Bed Count"
          type="number"
          {...register("bed_count", { required: "Bed count is required" })}
          error={errors.bed_count?.message as string}
        />
        <Input
          label="Max Adults"
          type="number"
          {...register("max_adults", { required: "Max adults is required" })}
          error={errors.max_adults?.message as string}
        />
        <Select
          label="Room Type"
          options={roomTypes}
          {...register("room_type", { required: "Room type is required" })}
          error={errors.room_type?.message as string}
        />
      </div>
      <Input
        label="Description"
        {...register("description")}
        error={errors.description?.message as string}
      />
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Manage Room Images
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {room.images.map((image) => (
            <div key={image.id} className="relative group">
              <img
                src={image.image}
                alt={`Room ${room.id}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => deleteImageMutation.mutate(image.id.toString())}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Add New Images
        </label>
        <input
          type="file"
          multiple
          {...register("images")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload one or more new images to add to this room
        </p>
      </div>
      <Button type="submit" loading={updateRoomMutation.isPending}>
        Save Changes
      </Button>
    </form>
  );
};

export default EditRoomForm;
