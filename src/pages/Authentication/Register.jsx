import { useMemo } from "react";
import AuthService from "../../services/AuthService";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Swal from "sweetalert2";
import {IconArrowLeft} from '@tabler/icons-react'

const schema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  phone: z.string().min(1, "Nomor telepon tidak boleh kosong"),
  email: z.string().min(1, "Email tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

function Login() {
  const authService = useMemo(() => AuthService(), []);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await authService.register(data);
      if (response && response.statusCode === 201) {
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Register gagal",
        text: "format input tidak sesuai",
      });
    }
  };

  return (
    <>
      <div className="d-flex">
        <Link
          to="/"
          className="user-select-all p-4 d-flex align-items-center gap-2 text-decoration-none"
        >
          <span>
            <IconArrowLeft />
          </span>
          Kembali ke Dashboard
        </Link>
      </div>
      <div className="container-fluid p-0">
        <div className="row g-0 justify-content-center">
          <div className="col-xxl-3 col-lg-5 col-md-8 shadow-lg rounded-4">
            <div className="d-flex p-4">
              <div className="w-100">
                <div className="d-flex flex-column h-100">
                  <div className="auth-content my-auto">
                    <div className="text-center">
                      <img
                        src="/src/assets/logo.png"
                        alt="logo-ui"
                        width="300px"
                        className="mb-3"
                      />
                      <h3 className="mb-0">Store Product Administration</h3>
                    </div>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="mt-4 pt-2"
                    >
                      <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                          {...register("email")}
                          type="text"
                          name="email"
                          id="email"
                          className={`form-control ${
                            errors.email && "is-invalid"
                          }`}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                          {...register("password")}
                          type="password"
                          name="password"
                          id="password"
                          className={`form-control ${
                            errors.password && "is-invalid"
                          }`}
                        />
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="name">Nama</label>
                        <input
                          {...register("name")}
                          type="text"
                          name="name"
                          id="name"
                          className={`form-control ${
                            errors.name && "is-invalid"
                          }`}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">
                            {errors.name.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone">Nomor Telepon</label>
                        <input
                          {...register("phone")}
                          type="text"
                          name="phone"
                          id="phone"
                          className={`form-control ${
                            errors.phone && "is-invalid"
                          }`}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">
                            {errors.phone.message}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 text-center">
                        <button
                          disabled={!isValid}
                          type="submit"
                          className="btn btn-primary w-100 waves-effect waves-light bg-info"
                        >
                          Register
                        </button>
                      </div>
                      <hr className="mt-4" />
                      <div className="text-center">
                        <div className="text-muted mb-2">
                          ~ Sudah Punya Akun? ~
                        </div>
                        <Link to="/login">
                          <button className="btn btn-outline-primary w-100 waves-effect waves-light mt-2 bg-info text-white">
                            Login
                          </button>
                        </Link>
                      </div>
                    </form>
                  </div>
                  <div className="mt-4 mt-md-5 text-center">
                    <p className="mb-0">© Store 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
