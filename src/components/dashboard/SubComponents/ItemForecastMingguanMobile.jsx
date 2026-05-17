import React from "react";
import { Icon } from "../../../utils/Constants";

const ItemForecastMingguanMobile = ({ forecast }) => {
  return (
    <div className="text-center">
      <Icon
        icon={forecast.weather_desc}
        className="w-10 h-10 mx-auto my-2 text-[#6C7D41]"
      />
      <p className="text-sm text-gray-700">{forecast.t}°</p>
      <p className="text-xs text-gray-500">
        {new Date(forecast.datetime).toLocaleDateString("id-ID", {
          weekday: "long",
        })}
      </p>
    </div>
  );
};

export default ItemForecastMingguanMobile;
