import React from "react";
import { Link } from "react-router-dom";
import { checkWaktu, truncateText } from "../../../utils/Constants";

const ItemDiskusiTeratas = ({ discussion }) => {
  return (
    <Link to={`/forum/diskusi/${discussion.id_diskusi}`}>
      <div className="p-4 bg-white border border-gray-200 rounded-lg mb-5">
        <div className="block md:flex md:items-center md:justify-between text-sm text-gray-600 mb-2">
          <div>
            {discussion.username} • {checkWaktu(discussion.tgl_dibuat)}
          </div>
          <span className="md:hidden block mt-2" />
          <span className="px-2 py-1 border border-gray-200 rounded text-xs">
            {discussion.kategori.nama}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[#6C7D41] mb-2">
          {discussion.judul}
        </h3>
        <p className="text-gray-700 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: truncateText(discussion.isi, 150) }}></p>
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

export default ItemDiskusiTeratas;
