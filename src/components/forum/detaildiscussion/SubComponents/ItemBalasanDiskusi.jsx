import React, { useEffect, useState } from "react";
import { checkUser } from "../../../../hooks/auth/Authentication";

const ItemBalasanDiskusi = ({ reply, replies, setReplyReference, handleDeleteMainReply, handleDeleteSubReply }) => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      checkUser().then((data) => {
        if (data) {
          setUser(data);
        }
      });
    }
  }, [token]);

  const renderReplies = (parentId) => {
    return replies
      .filter((reply) => reply.parentId === parentId)
      .map((reply) => (
        <div
          key={reply.id}
          className="p-4 bg-gray-50 rounded-md ml-8 border-l-2 border-gray-200 mt-4"
        >
          <p className="text-gray-600 font-semibold">
            {reply.user} • {reply.time}
          </p>
          <p className="text-gray-700">{reply.content}</p>
          {parentId === null && (
            <div className="mt-2">
              <button
                onClick={() => {
                  setReplyReference(reply);
                  document.getElementById("replyInput").scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                className="text-xs text-[#6C7D41] hover:underline mr-2"
              >
                Balas
              </button>
            </div>
          )}
          {user && user.username === reply.user && (
            <button
              onClick={() => handleDeleteSubReply(reply.id)}
              className="text-xs text-red-500 hover:underline"
            >
              Hapus
            </button>
          )}
        </div>
      ));
  };
  return (
    <div key={reply.id} className="p-4 bg-gray-50 rounded-md shadow-sm">
      <p className="text-gray-600 font-semibold">
        {reply.user} • {reply.time}
      </p>
      <p className="text-gray-700">{reply.content}</p>
      <div className="mt-2">
        <button
          onClick={() => {
            setReplyReference(reply)
            document.getElementById("replyInput").scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
          className="text-xs text-[#6C7D41] hover:underline"
        >
          Balas
        </button>
        { user && user.username === reply.user && (
          <button
            onClick={() => handleDeleteMainReply(reply.id)}
            className="text-xs text-red-500 hover:underline ml-2"
          >
            Hapus
          </button>
        )}
      </div>
      {renderReplies(reply.id)}
    </div>
  );
};

export default ItemBalasanDiskusi;
