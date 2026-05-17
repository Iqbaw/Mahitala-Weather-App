import React from "react";
import ItemKategoriTerkait from "./SubComponents/ItemKategoriTerkait";

const ListKategoriTerkait = ({ displayedDiscussions }) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      {displayedDiscussions.length > 0 ? (
        displayedDiscussions.map((discussion) => (
          <ItemKategoriTerkait key={discussion.id_diskusi} discussion={discussion} />
        ))
      ) : (
        <div className="p-8">
          <p className="text-gray-500 text-center">
            Tidak ada diskusi yang ditemukan untuk kategori ini.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListKategoriTerkait;
