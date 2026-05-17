import React from "react";
import { Link } from "react-router-dom";
import { truncateText } from "../../../../utils/Constants";

const ItemDiskusiPopuler = ({ discussion }) => {
  return (
    <li
      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
    >
      <div className="flex-shrink-0 bg-[#6C7D41] text-white w-10 h-10 flex items-center justify-center rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M8.5 2a5.5 5.5 0 00-5.5 5.5V9a5.5 5.5 0 005.5 5.5H9v3l4.5-3h.5A5.5 5.5 0 0019 9V7.5A5.5 5.5 0 0013.5 2h-5z" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <Link
          to={`/forum/diskusi/${discussion.id_diskusi}`}
          className="text-md font-semibold text-gray-800 hover:underline cursor-pointer"
        >
          {truncateText(discussion.judul, 50)}
        </Link>
        <p className="text-xs text-gray-500">
          {discussion.jumlah_pembaca} pembaca • {discussion.jumlah_replies} balasan
        </p>
      </div>
    </li>
  );
};

export default ItemDiskusiPopuler;
