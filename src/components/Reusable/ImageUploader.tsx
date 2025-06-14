import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Image from "next/image";
type ImageUploaderProps = {
  setImageFile: React.Dispatch<React.SetStateAction<[] | File[]>>;
  setPreviewImage: React.Dispatch<React.SetStateAction<[] | string[]>>;
  previewImage: [] | string[];
};
const ImageUploader = ({
  setImageFile,
  setPreviewImage,
  previewImage,
}: ImageUploaderProps) => {
  const handleImageSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    setImageFile((imageFiles) => [...imageFiles, file]);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };
  const handleRemoveImage = (index: number) => {
    setPreviewImage((prev) => prev.filter((_, idx) => idx !== index));
    setImageFile((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      <Input
        onChange={handleImageSet}
        type="file"
        accept="image/*"
        className="hidden"
        id="image-uploader"
      ></Input>
      <Label
        className="border-2 mt-8 text-black border-dashed border-violet-400 p-6 rounded-2xl flex flex-col items-center justify-center gap-3 bg-violet-50 hover:bg-violet-100 transition-all cursor-pointer text-center"
        htmlFor="image-uploader"
      >
        Upload Image
      </Label>

      <div className="w-80 rounded-4xl mt-8 flex gap-6">
        {previewImage.map((img, idx) => (
          <div key={idx} className="relative inline-block m-2">
            <Image
              src={img}
              alt=""
              width={100}
              height={20}
              className="rounded-md"
            />
            <div
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center cursor-pointer text-xs"
            >
              ×
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
