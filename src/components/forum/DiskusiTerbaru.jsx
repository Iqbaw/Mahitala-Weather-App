import React, { useEffect, useState } from "react";
import ItemDiskusiTerbaru from "./SubComponents/ItemDiskusiTerbaru";

import { getForumTerbaru } from "../../hooks/forum/getForum";

const DiskusiTerbaru = () => {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    getForumTerbaru().then((data) => setDiscussions(data));
  }, []);

  return (
    <>
      <h2 className="text-2xl font-semibold text-[#6C7D41] mb-5">Diskusi Terbaru</h2>
      <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-6">
        {discussions.length === 0 && (
          <div className="text-gray-600 text-center p-4 rounded-lg">
            Tidak ada diskusi terbaru
          </div>
        )}
        {discussions.map((discussion, index) => (
          index <= 2 ? <ItemDiskusiTerbaru key={discussion.id_diskusi} discussion={discussion} /> : null
        ))}
        <div className="flex justify-end mt-6">
          <button 
            className="px-4 py-2 text-sm font-semibold text-white bg-[#6C7D41] rounded-lg hover:bg-[#5b6936] transition-all duration-200 transform hover:scale-105"
            onClick={() => window.location.href = '/forum/diskusi-terbaru'}
          >
            Lihat Semua
          </button>
        </div>
      </div>
    </>
  );
};

export default DiskusiTerbaru;
