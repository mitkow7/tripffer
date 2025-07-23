import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../config/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { roomTypes } from "../../config/roomTypes";

interface AddRoomFormProps {
  onSuccess: () => void;
}

const useAddRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newRoom: FormData) =>
      api
        .post("/hotels/rooms/", newRoom, {
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

const AddRoomForm: React.FC<AddRoomFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const addRoomMutation = useAddRoom();

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
      await addRoomMutation.mutateAsync(formData);
      onSuccess();
    } catch (error) {
      console.error("Failed to add room:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Price"
        type="number"
        step="0.01"
        {...register("price", { required: "Price is required" })}
        error={errors.price?.message as string}
      />
      <Input
        label="Description"
        {...register("description")}
        error={errors.description?.message as string}
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Images
        </label>
        <input
          type="file"
          multiple
          {...register("images")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload one or more images for your room
        </p>
      </div>
      <Button type="submit" loading={addRoomMutation.isPending}>
        Add Room
      </Button>
    </form>
  );
};

export default AddRoomForm;
