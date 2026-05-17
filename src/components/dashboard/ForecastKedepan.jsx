import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import ItemForecastMingguan from './SubComponents/ItemForecastMingguan';

import { getForecastMingguan } from '../../hooks/forecast/getForecastMingguan';

const ForecastKedepan = ({ location }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        getForecastMingguan({ location }).then((res) => {
            setData(res);
        });
    }, [location]);

    return (
        <div className="hidden md:block rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#6C7D41]" />
                <h3 className="font-medium">Perkiraan Mingguan</h3>
              </div>
              <div className="flex flex-col gap-3">
                { data && data.map((forecast, i) => (
                    <ItemForecastMingguan forecast={forecast} key={i} />
                )) }
              </div>
            </div>
          </div>
        </div>
    );
}

export default ForecastKedepan;