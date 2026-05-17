import React from "react";
import ItemDiskusiTerbaru from "./SubComponents/ItemDiskusiTerbaru";

const ListDiskusiTerbaru = ({ displayedDiscussions }) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      {displayedDiscussions.length > 0 ? (
        displayedDiscussions.map((discussion) => (
          <ItemDiskusiTerbaru key={discussion.id_diskusi} discussion={discussion} />
        ))
      ) : (
        <div className="p-8">
          <p className="text-gray-500 text-center">
            Tidak ada diskusi yang ditemukan dalam periode ini.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListDiskusiTerbaru;
