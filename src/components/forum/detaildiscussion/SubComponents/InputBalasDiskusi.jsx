import React, { useEffect, useState } from "react";
import { checkWaktu, generateHash } from "../../../../utils/Constants";
import { balasDiskusi } from "../../../../hooks/forum/diskusi/cDiskusi";
import { useNavigate } from "react-router-dom";
import { checkUser } from "../../../../hooks/auth/Authentication";
import Swal from "sweetalert2";

const InputBalasDiskusi = ({
  id_diskusi,
  replyReference,
  setReplyReference,
  newReplyContent,
  setNewReplyContent,
  replies,
  setReplies,
}) => {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      checkUser().then((data) => {
        if (data) {
          setUser(data);
        }
      });
    }
  }, [token]);

  const handleReplySubmit = () => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Anda harus login terlebih dahulu!",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (newReplyContent.trim()) {
      generateHash(new Date().toString() + newReplyContent).then((id) => {
        const newReply = {
          id: id,
          user: user.username,
          time: checkWaktu(new Date()),
          content: newReplyContent,
          parentId: replyReference ? replyReference.id : null,
        };
        setReplies([...replies, newReply]);
        setNewReplyContent("");
        setReplyReference(null);
        balasDiskusi(id_diskusi, replyReference ? replyReference.id : null, id, newReplyContent);
      });
    }
  };
  return (
    <div className="mt-8 bg-white rounded-lg" id="replyInput">
      <h3 className="text-lg font-semibold text-[#6C7D41]">Balas Diskusi</h3>
      {replyReference && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-600">
            <strong>Balasan ke:</strong> {replyReference.user} •{" "}
            {replyReference.time}
          </p>
          <p className="text-gray-700">{replyReference.content}</p>
          <button
            onClick={() => setReplyReference(null)}
            className="text-xs text-[#6C7D41] hover:underline mt-2"
          >
            Batal
          </button>
        </div>
      )}
      <div className="mt-4">
        <textarea
          value={newReplyContent}
          onChange={(e) => setNewReplyContent(e.target.value)}
          placeholder={
            replyReference ? "Balas komentar ini..." : "Tulis balasan..."
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6C7D41]"
          rows={5}
        />
        <button
          onClick={handleReplySubmit}
          className="px-4 py-2 mt-2 text-white bg-[#6C7D41] rounded-lg hover:bg-green-700"
        >
          Kirim Balasan
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 mt-2 text-white bg-red-500 rounded-lg hover:bg-red-700 ml-2 md:hidden"
        >
          Kembali
        </button>
      </div>
    </div>
  );
};

export default InputBalasDiskusi;
