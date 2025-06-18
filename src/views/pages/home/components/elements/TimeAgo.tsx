import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const TimeAgo = ({ timestamp }: { timestamp: Date | null }) => {
  const [timeAgo, setTimeAgo] = useState<string>();

  useEffect(() => {
    if (!timestamp) return;
    const updateTime = () => {
      setTimeAgo(dayjs(timestamp).fromNow());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Cập nhật mỗi phút

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span className="text-xs text-gray-500">{timeAgo}</span>;
};

export default TimeAgo;
