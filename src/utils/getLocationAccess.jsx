/**
 * Reverse geocode menggunakan Nominatim OpenStreetMap API (gratis, seluruh dunia)
 */
const getLocation = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    console.error("Koordinat tidak valid:", latitude, longitude);
    throw new Error("Koordinat tidak valid");
  }

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mahitala-Weather-App/1.0",
      },
    });
    const data = await response.json();

    if (data && data.address) {
      const road =
        data.address.road ||
        data.address.path ||
        data.address.pedestrian ||
        "Jalan tidak ditemukan";
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.county ||
        data.address.municipality ||
        "Kota tidak ditemukan";
      const province =
        data.address.state || "Provinsi tidak ditemukan";

      return { road, city, province };
    } else {
      throw new Error("Data lokasi tidak ditemukan");
    }
  } catch (error) {
    throw new Error(`Terjadi kesalahan: ${error.message}`);
  }
};

export default getLocation;