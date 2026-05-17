import React from "react";
import { Link } from "react-router-dom";
import { checkWaktu, truncateText } from "../../../utils/Constants";

const ItemDiskusiTerakhir = ({ discussion }) => {
  return (
    <Link to={`/forum/diskusi/${discussion.id_diskusi}`}>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors mb-5">
        <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[#6C7D41]">
          {discussion.judul}
        </h3>
        </div>
        <p className="text-sm text-gray-600">
          {checkWaktu(discussion.tgl_dibuat)}
        </p>
        <p className="text-gray-700 mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: truncateText(discussion.isi, 150) }}></p>
        <div className="flex justify-between items-center mt-3 text-gray-600 text-sm">
          <div className="flex space-x-4">
            <span>👀 {discussion.jumlah_pembaca} Pembaca</span>
            <span>💬 {discussion.jumlah_replies} Balasan</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemDiskusiTerakhir;
