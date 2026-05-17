import React from "react";
import { Link } from "react-router-dom";

const ItemDiskusiTrending = ({ discussion }) => {
  return (
    <Link to={`/forum/diskusi/${discussion.id_diskusi}`}>
      <div className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer mt-2">
        <h4 className="text-[#6C7D41] font-semibold mb-2">
          {discussion.judul}
        </h4>
        <p className="text-gray-500 text-sm mb-2">
          Oleh {discussion.username} • {new Date(discussion.tgl_dibuat).toLocaleDateString(
            "id-ID",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </p>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-600">👀 {discussion.jumlah_pembaca} Pembaca</span>
          <span className="text-gray-600">💬 {discussion.jumlah_replies} Balasan</span>
        </div>
      </div>
    </Link>
  );
};

export default ItemDiskusiTrending;
