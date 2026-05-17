import React from "react";
import ItemDiskusiDicari from "./SubComponents/ItemDiskusiDicari";

const ListDiskusiDicari = ({ displayedDiscussions }) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      {displayedDiscussions.length > 0 ? (
        displayedDiscussions.map((discussion) => (
          <ItemDiskusiDicari key={discussion.id_diskusi} discussion={discussion} />
        ))
      ) : (
        <div className="p-8">
          <p className="text-gray-500 text-center">
            Tidak ada diskusi yang ditemukan dengan kriteria pencarian ini.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListDiskusiDicari;
