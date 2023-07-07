import { useState, useEffect } from "react";
import axios from "axios";

import { Pagination } from "../components/Pagination";
import { BookingsCard } from "../components/BookingsCard";
import host from "../urls";

export const Bookings = () => {
  const [state, setState] = useState({
    bookings: [],
    total: 0,
    isFetching: false,
    isError: false,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const skip = urlParams.get("skip");
    setState((prev) => ({ ...prev, isFetching: true }));

    const token = localStorage.getItem("token");

    axios
      .get(`${host}/api/booking/all`, {
        params: { skip, take: 10 },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setState((prev) => ({ ...prev, ...res.data, isFetching: false }));
      })
      .catch((e) => {
        console.log("Fetching error", e);
        setState((prev) => ({ ...prev, isError, isFetching: false }));
      });
  }, []);

  if (state.isError) {
    return <p className="mb-4 mt-3">İndirme sirasinda bir hata oluştu</p>;
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <h1 className="my-4 text-center">Rezervasyonlarin listesi</h1>
        </div>
        <div className="row">
          {state.isFetching && (
            <>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <BookingsCard key={index} isFetching />
                ))}
            </>
          )}
          {state.bookings.map((booking) => (
            <BookingsCard booking={booking} key={booking.id} />
          ))}
        </div>
        <div className="row">
          <Pagination total={state.total} />
        </div>
      </div>
    </>
  );
};
