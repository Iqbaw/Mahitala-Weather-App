import React, { useEffect, useState } from "react";
import ItemDiskusiTerakhir from "./SubComponents/ItemDiskusiTerakhir";
import { Link } from "react-router-dom";
import { getForumTerakhir } from "../../hooks/forum/getForum";
import { useUser } from "../../utils/userContext";

const DiskusiTerakhir = () => {
  const { isAuthenticated } = useUser();
  const [discussions, setDiscussions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getForumTerakhir().then((data) => {
        if (data === "401" || data === "404") {
          setError(data);
        } else {
          setDiscussions(data);
        }
      });
    } else {
      setDiscussions([]); 
      setError(null); 
    }
  }, [isAuthenticated]);

  return (
    <>
      <h2 className="text-2xl font-semibold text-[#6C7D41] mt-5 mb-4">
        Diskusi Terakhir
      </h2>
      <div className="p-6 bg-white border border-gray-200 rounded-lg space-y-6">
        <div className="space-y-4">
          {isAuthenticated ? (
            discussions && discussions !== null && discussions.length > 0 ? (
              discussions.map((discussion) => (
                <ItemDiskusiTerakhir
                  key={discussion.id_diskusi}
                  discussion={discussion}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center">
                {error === "401"
                  ? "Anda tidak memiliki akses untuk melihat diskusi terakhir, silahkan login terlebih dahulu"
                  : error === "404"
                    ? "Tidak ada diskusi terakhir"
                    : "Tidak ada diskusi terakhir"}
              </p>
            )
          ) : (
            <p className="text-gray-600 text-center">
              Anda tidak memiliki akses untuk melihat diskusi terakhir, silahkan login terlebih dahulu
            </p>
          )}
        </div>
        <div className="flex justify-end mt-6">
          {discussions && discussions !== null && discussions.length > 0 && (
            <Link
              to="/forum/diskusi-terakhir"
              className="px-4 py-2 text-sm font-semibold text-white bg-[#6C7D41] rounded-lg hover:bg-[#5b6936] transition-all duration-200 transform hover:scale-105"
            >
              Lihat Semua
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default DiskusiTerakhir;
