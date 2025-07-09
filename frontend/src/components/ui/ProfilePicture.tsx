import React, { useRef, useState, useEffect } from "react";
import { Camera, User } from "lucide-react";

interface ProfilePictureProps {
  currentImage?: string;
  onImageChange?: (file: File) => void;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  tempImage?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  currentImage,
  onImageChange,
  size = "md",
  editable = false,
  tempImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    tempImage || currentImage
  );

  // Update preview URL when currentImage or tempImage changes
  useEffect(() => {
    setPreviewUrl(tempImage || currentImage);
  }, [currentImage, tempImage]);

  // Cleanup object URLs when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      // Cleanup previous object URL if it exists
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    }
  };

  const handleClick = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-full overflow-hidden ${
        editable ? "group cursor-pointer" : ""
      } bg-gray-100`}
      onClick={handleClick}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="w-1/2 h-1/2 text-gray-400" />
        </div>
      )}
      {editable && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-8 h-8 text-white" />
        </div>
      )}
      {editable && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      )}
    </div>
  );
};

export default ProfilePicture;
