import React from "react";
import { Icon } from "../../../utils/Constants";

const ItemForecastMingguan = ({ forecast }) => {
  return (
    <div className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-xl">
      <p className="text-sm">
        {new Date(forecast.datetime).toLocaleDateString("id-ID", {
          weekday: "long",
        })}
      </p>
      <div className="flex items-center gap-2">
        <Icon icon={forecast.cuaca} className="w-6 h-6 text-[#6C7D41]" />
        <p className="font-medium text-gray-700">{forecast.t}°</p>
      </div>
    </div>
  );
};

export default ItemForecastMingguan;
