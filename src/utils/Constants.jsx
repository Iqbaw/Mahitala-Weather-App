export const API_URL = "https://mahitala-be.sudolabs.cloud";
export const API_URL_CLF = "https://mahitala-clf.sudolabs.cloud";
export const API_STATIC = "https://mahitala-be.sudolabs.cloud/static/";
import { Cloud, CloudRain, Sun, Wind } from "lucide-react";

export const Icon = ({ icon, className }) => {
  let Icon;
  switch (icon) {
    case "Cerah":
    case 0:
    case 100:
      Icon = Sun;
      break;
    case "Cerah Berawan":
    case 1:
    case 101:
    case 2:
    case 102:
      Icon = Cloud;
      break;
    case "Berawan":
    case 3:
    case 103:
      Icon = CloudRain;
      break;
    case "Berawan Tebal":
    case 4:
    case 104:
      Icon = CloudRain;
      break;
    case "Udara Kabur":
    case 5:
      Icon = Wind;
      break;
    case "Asap":
    case 10:
      Icon = Wind;
      break;
    case "Kabut":
    case 45:
      Icon = Wind;
      break;
    case "Hujan Ringan":
    case 60:
      Icon = CloudRain;
      break;
    case "Hujan Sedang":
    case 61:
      Icon = CloudRain;
      break;
    case "Hujan Lebat":
    case 63:
      Icon = CloudRain;
      break;
    case "Hujan Lokal":
    case 80:
      Icon = CloudRain;
      break;
    case "Hujan Petir":
    case 85:
    case 97:
      Icon = CloudRain;
      break;
    default:
      Icon = Sun;
      break;
  }

  return <Icon className={className} />;
};

export const extractHour = (time) => {
  const date = new Date(time);
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${hours}:${minutes}`;
};

export function findNearestTimestamp(data) {
  const currentTime = new Date();

  return data.reduce((nearest, item) => {
    const itemTime = new Date(item.datetime);
    const nearestTime = new Date(nearest.datetime);

    return Math.abs(itemTime - currentTime) <
      Math.abs(nearestTime - currentTime)
      ? item
      : nearest;
  }, data[0]);
}

export const tempRecommendation = (temp) => {
  if (temp < 20) {
    return "Suhu saat ini kurang optimal untuk pertanian. Pertimbangkan perlindungan tanaman atau penanaman di lokasi yang lebih hangat.";
  }
  if (temp >= 20 && temp <= 25) {
    return "Suhu ini sangat ideal untuk sebagian besar tanaman, mendukung pertumbuhan yang baik dan produktivitas optimal.";
  }
  if (temp > 25) {
    return "Suhu terlalu panas untuk sebagian besar tanaman. Pertimbangkan penggunaan irigasi tambahan atau tanaman tahan panas.";
  }
};

export const humidityRecommendation = (humidity) => {
  if (humidity < 60) {
    return "Kelembaban terlalu rendah. Pertimbangkan penggunaan irigasi atau penyiraman untuk menjaga kelembaban tanah.";
  }
  if (humidity >= 60 && humidity <= 80) {
    return "Kelembaban saat ini sangat ideal untuk sebagian besar tanaman, mendukung pertumbuhan optimal.";
  }
  if (humidity > 80) {
    return "Kelembaban terlalu tinggi, berisiko menyebabkan penyakit tanaman. Pantau tanaman dengan cermat dan pastikan sirkulasi udara yang baik.";
  }
};

export const windRecommendation = (wind) => {
  if (wind < 5) {
    return "Kecepatan angin saat ini cukup rendah. Pastikan sirkulasi udara untuk mencegah stagnasi di sekitar tanaman.";
  }
  if (wind >= 5 && wind <= 15) {
    return "Kecepatan angin ideal untuk pertanian, membantu sirkulasi udara yang sehat tanpa merusak tanaman.";
  }
  if (wind > 15) {
    return "Kecepatan angin terlalu tinggi dan dapat merusak tanaman. Pertimbangkan penahan angin atau perlindungan untuk tanaman.";
  }
};

export const rainRecommendation = (rain) => {
  if (rain < 50) {
    return "Kemungkinan hujan rendah. Pastikan irigasi cukup untuk menjaga kelembaban tanah.";
  }
  if (rain >= 50 && rain <= 70) {
    return "Kemungkinan hujan sedang. Ini dapat membantu mengurangi kebutuhan irigasi, tetapi tetap pantau kelembaban tanah.";
  }
  if (rain > 70) {
    return "Kemungkinan hujan tinggi. Pastikan drainase yang baik untuk mencegah genangan air di sekitar tanaman.";
  }
};

export function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export const checkIdeal = (prediction, min, max) => {
  if (prediction >= min && prediction <= max) {
    return "Sangat Ideal";
  } else if (
    (prediction >= min - 5 && prediction < min) ||
    (prediction > max && prediction <= max + 5)
  ) {
    return "Mendekati Ideal";
  } else {
    if (min === 0 && max === 0) {
      return "Tidak Ada Rekomendasi Tanaman";
    }

    return "Tidak Ideal";
  }
};

export const colorRecommendation = (prediction, min, max) => {
  if (prediction >= min && prediction <= max) {
    return "text-[#6C7D41]";
  } else if (
    (prediction >= min - 5 && prediction < min) ||
    (prediction > max && prediction <= max + 5)
  ) {
    return "text-yellow-600";
  } else {
    if (min === 0 && max === 0) {
      return "text-gray-500";
    }
    return "text-red-600";
  }
};

export const rainfallRecommendation = (rain) => {
  if (rain < 50) {
    return "Curah hujan terlalu rendah. Tanaman membutuhkan irigasi tambahan untuk pertumbuhan yang optimal.";
  }
  if (rain >= 50 && rain < 200) {
    return "Curah hujan sedang. Cocok untuk tanaman dengan dukungan drainase yang baik untuk menghindari kekeringan pada fase kritis.";
  }
  if (rain >= 200 && rain <= 300) {
    return "Curah hujan ideal untuk budidaya. Pastikan distribusi air merata agar pertumbuhan optimal.";
  }
  if (rain > 300 && rain <= 500) {
    return "Curah hujan tinggi. Pastikan sistem drainase sawah dapat mengelola kelebihan air untuk mencegah genangan atau banjir.";
  }
  if (rain > 500) {
    return "Curah hujan sangat tinggi. Ada risiko banjir yang dapat merusak tanaman. Pertimbangkan langkah mitigasi seperti peninggian tanggul atau pengalihan air.";
  }
};

export const cropIdealDescription = (kategori, catatan) => {
  const descriptions = {
    "sangat ideal": "Tanaman ini sangat cocok untuk kondisi saat ini. Pertumbuhan dan hasil optimal diharapkan.",
    "mendekati ideal": "Tanaman memiliki potensi yang baik untuk kondisi saat ini, meskipun ada beberapa faktor yang perlu diperhatikan.",
    "cukup ideal": "Tanaman ini cukup cocok untuk kondisi saat ini. Pertumbuhan yang baik mungkin memerlukan perhatian ekstra.",
  };
  const description = descriptions[kategori] || "Tidak ada deskripsi yang tersedia untuk kategori ini.";
  return catatan != undefined ? `${description} ${catatan}` : description;
};

export function capitalizeEachWord(text) {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

export const checkWaktu = (waktu) => {
  const now = new Date();
  const date = new Date(waktu);
  const duration = Math.abs(now - date);
  const durationMinutes = Math.floor(duration / (1000 * 60));
  const durationHours = Math.floor(duration / (1000 * 60 * 60));

  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (durationHours < 24) {
    if (durationHours === 0) {
      if (durationMinutes < 1) {
        return "Kurang dari 1 menit yang lalu";
      } else if (durationMinutes === 1) {
        return "1 menit yang lalu";
      } else {
        return `${durationMinutes} menit yang lalu`;
      }
    } else {
      return `${durationHours} jam yang lalu`;
    }
  } else {
    return `${formattedDate} • ${formattedTime} WIB`;
  }
};

export const generateHash = async (input) => {
  const textAsBuffer = new TextEncoder().encode(input);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
  return hash;
};

export const geodesicArea = (latLngs) => {
  const pointsCount = latLngs.length;
  let area = 0.0;
  const d2r = Math.PI / 180;
  let p1, p2;

  if (pointsCount > 2) {
    for (let i = 0; i < pointsCount; i++) {
      p1 = latLngs[i];
      p2 = latLngs[(i + 1) % pointsCount];
      area +=
        (p2.lng - p1.lng) *
        d2r *
        (2 + Math.sin(p1.lat * d2r) + Math.sin(p2.lat * d2r));
    }
    area = (area * 6378137.0 * 6378137.0) / 2.0;
  }

  return Math.abs(area);
};

export const calculateArea = (latLngs) => {
  if (!latLngs || latLngs.length < 3) return null;

  try {
    const points = latLngs.map((point) =>
      Array.isArray(point) ? { lat: point[0], lng: point[1] } : point
    );

    const area = geodesicArea(points);
    return {
      squareMeters: area,
      hectares: area / 10000,
    };
  } catch (error) {
    console.error("Error calculating area:", error);
    return null;
  }
};

export const calculateCentroid = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    throw new Error("Input harus berupa array koordinat yang tidak kosong");
  }

  let sumLat = 0;
  let sumLng = 0;
  const count = coordinates.length;

  for (const coord of coordinates) {
    if (!Array.isArray(coord) || coord.length !== 2) {
      throw new Error(
        "Setiap koordinat harus berupa pasangan [latitude, longitude]"
      );
    }

    sumLat += coord[0];
    sumLng += coord[1];
  }

  const centroidLat = sumLat / count;
  const centroidLng = sumLng / count;

  return [centroidLat, centroidLng];
};

export const formatCurrency = (value) => {
  const num = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export const formatNumber = (value) => {
  const num = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
  return new Intl.NumberFormat('id-ID').format(num);
};

export const generateSecureToken = (length = 32) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte =>
      ('0' + byte.toString(16)).slice(-2)
    ).join('');
}