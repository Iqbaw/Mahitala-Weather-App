/**
 * Fetch weekly forecast from BMKG public API
 * Groups daily forecasts and calculates daily averages
 */
const BMKG_API = "https://cuaca.bmkg.go.id/api/df/v1/forecast/coord";

export const getForecastMingguan = async ({ location }) => {
  const { latitude, longitude } = location;

  try {
    const res = await fetch(
      `${BMKG_API}?lon=${longitude}&lat=${latitude}`
    );

    if (!res.ok) {
      throw new Error("Gagal mengambil data prakiraan mingguan");
    }

    const rawData = await res.json();

    if (
      !rawData.data ||
      !rawData.data[0] ||
      !rawData.data[0].cuaca ||
      rawData.data[0].cuaca.length === 0
    ) {
      return [];
    }

    const cuacaDays = rawData.data[0].cuaca;

    // Each element in cuacaDays is an array of hourly forecasts for one day
    const weeklyData = cuacaDays.map((dayForecasts) => {
      if (!dayForecasts || dayForecasts.length === 0) return null;

      // Calculate daily averages
      let totalT = 0;
      let totalHu = 0;
      let count = 0;
      const weatherCodes = {};

      dayForecasts.forEach((f) => {
        totalT += f.t;
        totalHu += f.hu;
        count++;

        const desc = f.weather_desc || "Cerah";
        weatherCodes[desc] = (weatherCodes[desc] || 0) + 1;
      });

      // Most common weather description
      let mostCommonWeather = "Cerah";
      let maxCount = 0;
      Object.entries(weatherCodes).forEach(([desc, c]) => {
        if (c > maxCount) {
          maxCount = c;
          mostCommonWeather = desc;
        }
      });

      return {
        datetime: dayForecasts[0].local_datetime || dayForecasts[0].datetime,
        t: Math.round(totalT / count),
        hu: Math.round(totalHu / count),
        cuaca: mostCommonWeather,
        weather_desc: mostCommonWeather,
      };
    }).filter(Boolean);

    return weeklyData;
  } catch (error) {
    console.error("Error fetching weekly forecast:", error);
    return [];
  }
};
