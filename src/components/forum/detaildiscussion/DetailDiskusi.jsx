import React, { useEffect, useState } from "react";
import ItemBalasanDiskusi from "./SubComponents/ItemBalasanDiskusi";
import InputBalasDiskusi from "./SubComponents/InputBalasDiskusi";
import ItemDiskusiPopuler from "./SubComponents/ItemDiskusiPopuler";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailDiskusi, deleteMainReply, deleteSubReply } from "../../../hooks/forum/diskusi/cDiskusi";
import { getForumTeratas } from "../../../hooks/forum/getForum";
import { checkWaktu } from "../../../utils/Constants";
import Swal from 'sweetalert2';

const DetailDiskusi = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState({});
  const [popularDiscussion, setPopularDiscussion] = useState([]);
  const [replies, setReplies] = useState([]);
  const [newReplyContent, setNewReplyContent] = useState("");
  const [replyReference, setReplyReference] = useState();

  useEffect(() => {
    getDetailDiskusi(id).then((data) => {
      setDiscussion(data);
      const mainReplies = data.main_replies.map((reply) => ({
        id: reply.id_interact,
        user: reply.username,
        time: checkWaktu(reply.tanggal),
        content: reply.isi,
        parentId: null,
      }));
      const subReplies = data.main_replies.map((reply) =>
        reply.sub_replies.map((subReply) => ({
          id: subReply.id_reply,
          user: subReply.username,
          time: checkWaktu(subReply.tanggal), 
          content: subReply.isi,
          parentId: reply.id_interact
        }))
      );
      setReplies([...mainReplies, ...subReplies.flat()]);
    });
  }, [id]);

  useEffect(() => {
    getForumTeratas().then((data) => setPopularDiscussion(data));
  }, []);

  const handleDeleteMainReply = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Balasan utama akan dihapus, dan tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#6C7D41',
      cancelButtonColor: '#C53030',
    }).then((result) => {
      if (result.isConfirmed) {
        const subReplies = replies.filter((reply) => reply.parentId === id);
        if (subReplies.length > 0) {
          const updatedReplies = replies.map((reply) => {
            if (reply.id === id) {
              reply.content = '[deleted]';
            }
            return reply;
          });
          setReplies(updatedReplies);
        } else {
          const updatedReplies = replies.filter((reply) => reply.id !== id);
          setReplies(updatedReplies);
        }
        deleteMainReply(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Balasan telah dihapus.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  
  const handleDeleteSubReply = (id) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Balasan akan dihapus, dan tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#6C7D41',
      cancelButtonColor: '#C53030',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedReplies = replies.filter((reply) => reply.id !== id);
        setReplies(updatedReplies);
        deleteSubReply(id);
        Swal.fire({
          title: 'Berhasil!',
          text: 'Balasan telah dihapus.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return discussion && Object.keys(discussion).length === 0 ? null : (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 p-6 bg-white rounded-lg">
        <button
          onClick={() => {
            navigate(-1);
          }
          }
          className="flex justify-center text-start items-center text-[#6C7D41] text-2xl font-semibold hover:text-[#4A5A2C] transition-colors mb-5"
        >
          <FaChevronLeft className="hidden md:flex mr-2" />
          {discussion.judul}
        </button>
        <p className="text-gray-500 mb-4">
          Oleh {discussion.username} • {checkWaktu(discussion.tgl_dibuat)}
        </p>
        {discussion.gambar && (
          <img src={discussion.gambar} alt="gambar diskusi" className="w-full md:w-80 rounded-lg mb-6" />
        )}
        <p className="text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: discussion.isi }}></p>
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-[#6C7D41]">Balasan</h3>
          <div className="space-y-6 mt-4">
            {replies.length === 0 && (
              <div className="text-gray-500 text-center bg-gray-100 p-4 rounded-lg">Belum ada balasan</div>
            )}
            {replies
              .filter((reply) => reply.parentId === null)
              .map((reply) => (
                <ItemBalasanDiskusi
                  key={reply.id}
                  reply={reply}
                  replies={replies}
                  setReplyReference={setReplyReference}
                  handleDeleteMainReply={handleDeleteMainReply}
                  handleDeleteSubReply={handleDeleteSubReply}
                />
              ))}
          </div>
        </div>
        <InputBalasDiskusi
          id_diskusi={discussion.id_diskusi}
          newReplyContent={newReplyContent}
          setNewReplyContent={setNewReplyContent}
          replyReference={replyReference}
          setReplyReference={setReplyReference}
          replies={replies}
          setReplies={setReplies}
        />
      </div>
      <div className="p-4 bg-white rounded-lg">
        <h3 className="text-lg font-semibold text-[#6C7D41] mb-4">
          Diskusi Populer
        </h3>
        <ul className="space-y-3">
          {popularDiscussion.length === 0 && (
            <div className="text-gray-500 text-center bg-gray-100 p-4 rounded-lg">
              Tidak ada diskusi populer
            </div>
          )}
          {popularDiscussion.map((discussion, index) => (
            index <= 2 ? <ItemDiskusiPopuler key={index} discussion={discussion} /> : null
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DetailDiskusi;
