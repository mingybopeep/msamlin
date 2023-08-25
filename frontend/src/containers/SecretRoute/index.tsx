import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state";
import { axiosInstance } from "../../api";

const SecretRoute: React.FC = () => {
  const { email } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("Shhh...");

  const fetch = async () => {
    try {
      setLoading(true);
      setData((await axiosInstance.get("/secret")).data);
    } catch (e) {
      setData("unauthorized!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetch();
    }
  }, [email]);

  return (
    <div>
      <h2>the secret message is:</h2>

      <div>{loading ? "loading" : data}</div>
    </div>
  );
};

export default SecretRoute;
