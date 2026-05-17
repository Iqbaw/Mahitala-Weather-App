import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HeadDiskusiDicari = ({ keyword }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex justify-center items-center text-[#6C7D41] text-2xl font-semibold hover:text-[#4A5A2C] transition-colors mb-5"
        >
            <FaChevronLeft className="mr-2" />
            Hasil Pencarian: {keyword}
        </button>
    );
}

export default HeadDiskusiDicari;