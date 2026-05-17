import { format } from "prettier";
import React from "react";

const ItemStatusForecast = ({ title, description, metric, Icon, format }) => {
  return (
    <div className="border border-gray-200 shadow-sm rounded-xl">
      <div className="p-4 flex gap-8">
        <div className="text-center">
          <Icon className="w-14 h-14 mx-auto mb-2 text-[#6C7D41]" />
          <p className="text-[#6C7D41] font-medium">{metric}{format}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">{title}</h4>
          <p className="text-xs text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemStatusForecast;
