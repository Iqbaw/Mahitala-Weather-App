/**
 * Fetch weather data from BMKG public API
 * Works for all of Indonesia
 */
const BMKG_API = "https://cuaca.bmkg.go.id/api/df/v1/forecast/coord";

export const getDataForecast = async ({ location }) => {
  const { latitude, longitude } = location;

  try {
    const res = await fetch(
      `${BMKG_API}?lon=${longitude}&lat=${latitude}`
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil data prakiraan cuaca");
    }

    const rawData = await res.json();

    // Transform BMKG data to match expected format
    // rawData.data[0].cuaca is array of arrays (each sub-array = 1 day of hourly forecasts)
    if (
      !rawData.data ||
      !rawData.data[0] ||
      !rawData.data[0].cuaca ||
      rawData.data[0].cuaca.length === 0
    ) {
      throw new Error("Data cuaca kosong");
    }

    // Get today's hourly forecasts (first array in cuaca)
    const todayForecasts = rawData.data[0].cuaca[0] || [];

    // Map to expected format: { datetime, t, hu, ws, tp, weather_desc, local_datetime }
    const weatherData = todayForecasts.map((f) => ({
      datetime: f.local_datetime || f.datetime,
      local_datetime: f.local_datetime || f.datetime,
      t: f.t,
      hu: f.hu,
      ws: f.ws,
      tp: f.tp || 0,
      wd: f.wd,
      weather: f.weather,
      weather_desc: f.weather_desc || f.weather_desc_en || "Tidak diketahui",
      tcc: f.tcc || 0,
    }));

    return {
      weatherData: [weatherData],
      lokasi: rawData.lokasi,
      raw: rawData,
    };
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

export const getNowForecast = async ({ location }) => {
  const { latitude, longitude } = location;

  try {
    const res = await fetch(
      `${BMKG_API}?lon=${longitude}&lat=${latitude}`
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil data cuaca sekarang");
    }

    const rawData = await res.json();

    if (
      !rawData.data ||
      !rawData.data[0] ||
      !rawData.data[0].cuaca ||
      rawData.data[0].cuaca.length === 0
    ) {
      throw new Error("Data cuaca kosong");
    }

    const todayForecasts = rawData.data[0].cuaca[0] || [];

    // Find nearest forecast to current time
    const now = new Date();
    let nearest = todayForecasts[0];
    let closestDiff = Infinity;

    todayForecasts.forEach((f) => {
      const forecastTime = new Date(f.local_datetime || f.datetime);
      const diff = Math.abs(forecastTime - now);
      if (diff < closestDiff) {
        closestDiff = diff;
        nearest = f;
      }
    });

    return {
      dataCuaca: {
        weatherData: {
          t: nearest.t,
          hu: nearest.hu,
          ws: nearest.ws,
          tp: nearest.tp || 0,
          wd: nearest.wd,
          weather: nearest.weather,
          weather_desc: nearest.weather_desc || nearest.weather_desc_en || "Tidak diketahui",
          tcc: nearest.tcc || 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching now forecast:", error);
    throw error;
  }
};
