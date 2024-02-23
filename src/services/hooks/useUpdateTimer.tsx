import { useState } from "react";

function useUpdateTimer() {
  const initialTimerValue = parseInt(process.env.updateTimer);
  const [updateTimer, setUpdateTimer] = useState<number>(initialTimerValue);

  setTimeout(() => {
    setUpdateTimer(updateTimer < 0 ? initialTimerValue : updateTimer - 1);
  }, 1000);
  return [updateTimer];
}
export default useUpdateTimer;
