import { useEffect, useState } from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import host from "../urls";
import { useTimer } from "../hooks/useTimer";

const AUTH_PAGE = {
  phone: "phone",
  code: "code",
};

export const Modal = () => {
  const [state, setState] = useState({
    isTokenInStorage: false,
    page: AUTH_PAGE.phone,
    phone: "",
    code: "",
    isError: false,
  });

  const { seconds, startTimer, resetTimer } = useTimer(60);

  useEffect(() => {
    const isTokenInStorage = Boolean(localStorage.getItem("token"));
    setState((prev) => ({ ...prev, isTokenInStorage }));
  }, []);

  const sendCode = (e) => {
    e.preventDefault();
    resetTimer();
    const phone = state.phone.replaceAll(" ", "");

    axios
      .get(`${host}/api/user/code`, {
        params: { phone },
      })
      .then(() => {
        setState((prev) => ({
          ...prev,
          page: AUTH_PAGE.code,
          isError: false,
        }));
      })
      .catch(() => {
        setState((prev) => ({ ...prev, isError: true }));
      })
      .finally(startTimer);
  };

  const login = () => {
    const { phone, code } = state;

    axios
      .get(`${host}/api/user/token`, {
        params: { phone, code },
      })
      .then((res) => {
        const token = res.data;
        localStorage.setItem("token", token);
        setState((prev) => ({
          ...prev,
          isTokenInStorage: true,
          isError: false,
        }));
      })
      .catch(() => {
        setState((prev) => ({ ...prev, isError: true }));
      });
  };

  return (
    !state.isTokenInStorage && (
      <div
        className="modal fade show d-block bg-dark bg-opacity-50"
        role="dialog"
      >
        <div
          className="d-flex modal-dialog modal-sm modal-dialog-centered"
          role="document"
        >
          <div className="modal-content shadow">
            <div className="modal-header">
              <h5 className="modal-title">Yetkilendirme</h5>
            </div>
            {state.page === AUTH_PAGE.phone && (
              <form onSubmit={sendCode}>
                <div className="modal-body d-flex flex-column">
                  <label htmlFor="phone">Telefon numarasini girin </label>
                  <InputMask
                    value={state.phone}
                    mask={"+\\90 999 9999999"}
                    placeholder="+90-500-1234567"
                    className="shadow-2"
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        phone: e.target.value,
                        isError: false,
                      }))
                    }
                  >
                    {(inputProps) => (
                      <input
                        {...inputProps}
                        id="phone"
                        type="tel"
                        name="phone"
                        className={`shadow mt-2 p-1 border border-secondary rounded ${
                          state.isError && "border-danger"
                        }`}
                        required
                      />
                    )}
                  </InputMask>
                  {state.isError && (
                    <div className="text-danger">Alanı doldurun</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Kod gönder
                  </button>
                </div>
              </form>
            )}

            {state.page === AUTH_PAGE.code && (
              <>
                <div className="modal-body d-flex flex-column">
                  <label htmlFor="code">Aldiğiniz kodu girin </label>
                  <input
                    type="number"
                    name="otp-code"
                    auto-complete="one-time-code"
                    id="code"
                    value={state.code}
                    onChange={(e) =>
                      setState((prev) => ({
                        ...prev,
                        code: e.target.value,
                        isError: false,
                      }))
                    }
                    className={`shadow mt-2 p-1 border border-secondary rounded 
                        ${state.isError && "border-danger"}`}
                    required
                  />
                  {state.isError && (
                    <div className="text-danger">Alanı doldurun</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={login}
                  >
                    Yetkilendirme
                  </button>
                  {seconds > 0 && (
                    <span className="text-muted">
                      Аracılığıyla yeni bir kod alın {seconds}
                    </span>
                  )}
                  {seconds === 0 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={sendCode}
                    >
                      Kod al
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
};
