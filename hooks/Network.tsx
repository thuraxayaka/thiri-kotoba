import React, { useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useNetwork = () => {
  const [status, setStatus] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return { status };
};
