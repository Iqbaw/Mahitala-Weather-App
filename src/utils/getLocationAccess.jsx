import { API_URL } from "./Constants";

const getLocation = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    console.error("Koordinat tidak valid:", latitude, longitude);
  throw new Error("Koordinat tidak valid");
}
    const url = API_URL + `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.address) {
      const road = data.address.road || data.address.path || "Jalan tidak ditemukan";
        const city = data.address.city || data.address.town || data.address.village || "Kota tidak ditemukan";
        const province = data.address.state || "Provinsi tidak ditemukan";
  
        return { road, city, province };
      } else {
        throw new Error('Data lokasi tidak ditemukan');
      }
    } catch (error) {
      throw new Error(`Terjadi kesalahan: ${error.message}`);
    }
  };
  
  export default getLocation;
  