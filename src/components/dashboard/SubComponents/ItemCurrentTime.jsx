import React from "react";
import { Wind, Droplets, CloudFog } from "lucide-react";

const ItemCurrentTime = ({ timestamp, location, nowData }) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-medium">
            {location.road != "Jalan tidak ditemukan" && `${location.road}, `}{location.city}, {location.province}
          </h2>
          <p className="text-sm text-gray-600">
            {timestamp.day}, {timestamp.date} {timestamp.month} {timestamp.year}{" "}
            <span className="text-gray-600 inline-flex md:hidden">
              | {timestamp.time} WIB{" "}
            </span>
          </p>
        </div>
        <p className="hidden md:inline-block text-sm text-gray-600">
          {timestamp.time} WIB
        </p>
      </div>
      <div className="flex flex-col  items-center gap-12">
        <div className="text-center">
          <h1 className="text-8xl font-light text-[#6C7D41]">
            {nowData.t}°
          </h1>
          <p className="mt-2 text-gray-600">{nowData.weather_desc}</p>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex items-center gap-2" title="Tutupan Awan">
            <CloudFog className="w-6 h-6 text-[#6C7D41]" />
            <span className="text-sm text-gray-600">{nowData.tcc}%</span>
          </div>
          <div className="flex items-center gap-2" title="Kelembaban">
            <Droplets className="w-6 h-6 text-[#6C7D41]" />
            <span className="text-sm text-gray-600">{nowData.hu}%</span>
          </div>
          <div className="flex items-center gap-2" title="Kecepatan Angin">
            <Wind className="w-6 h-6 text-[#6C7D41]" />
            <span className="text-sm text-gray-600">{nowData.ws}km/j</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemCurrentTime;
