import { useState } from "react";
import Loading from "../component/loading/loading";
import { NewAxios } from "../api/CreateAxios";

export default function Logout() {
  const [loading, setloading] = useState(false);
  async function HandleLogOut() {
    setloading(true);
    try {
      const res = await NewAxios.get(`/logout`);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div>
        <button onClick={HandleLogOut}>Logout</button>
      </div>
    </>
  );
}
