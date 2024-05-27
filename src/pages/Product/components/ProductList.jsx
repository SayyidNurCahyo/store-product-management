import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import ProductService from "../../../services/ProductService";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import Loading from "../../../shared/Loading";
import React from "react";
import { useEffect } from "react";
import AuthService from "../../../services/AuthService";

function ProductList() {
  const [isLogin, setIsLogin] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();
  const productService = useMemo(() => ProductService(), []);
  const { handleSubmit, register } = useForm();

  const navigate = useNavigate();

  const search = searchParam.get("name") || "";
  const direction = searchParam.get("direction") || "asc";
  const sortBy = searchParam.get("sortBy") || "name";
  const page = searchParam.get("page") || "1";
  const size = searchParam.get("size") || "10";

  const [paging, setPaging] = useState({
    page: page,
    size: size,
    totalElement: 0,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false,
  });

  const onSubmitSearch = ({ search }) => {
    setSearchParam({
      name: search || "",
      direction: direction,
      page: "1",
      size: size,
      sortBy: sortBy,
    });
  };

  const handleNextPage = () => {
    if (page >= paging.totalPages) return;
    setSearchParam({
      name: "",
      page: +page + 1,
      size: size,
      direction: direction,
      sortBy: sortBy,
    });
  };

  const handlePreviousPage = () => {
    if (page <= 1) return;
    setSearchParam({
      name: "",
      page: +page - 1,
      size: size,
      direction: direction,
      sortBy: sortBy,
    });
  };

  const navigatePage = (page) => {
    if (!page) return;
    setSearchParam({
      name: "",
      page: page,
      size: size,
      direction: direction,
      sortBy: sortBy,
    });
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", search, page, size, sortBy, direction],
    queryFn: async () => {
      return await productService.getAll({
        name: search,
        page: page,
        size: size,
        direction: direction,
        sortBy: sortBy,
      });
    },
    onSuccess: (data) => {
      setPaging(data.paging);
    },
  });

  const separateThousands = (number) => {
    return number.toLocaleString();
  };

  const handleDelete = async (id) => {
    if (!isLogin) return;
    if (!confirm("apakah yakin ingin menghapus data ini?")) return;
    try {
      const response = await productService.deleteById(id);
      if (response.statusCode === 200) {
        const data = await productService.getAll();
        setPaging(data.paging);
        await refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const authService = useMemo(() => AuthService(), []);
  useEffect(() => {
    const checkToken = async () => {
      if (
        !localStorage.getItem("user") ||
        !(await authService.validateToken())
      ) {
        setIsLogin(false);
      } else {
        setIsLogin(true);
      }
    };
    checkToken();
  }, [authService, localStorage.getItem("user")]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="d-flex justify-content-between justify-content-center mb-3">
        <form
          className="flex-fill"
          onSubmit={handleSubmit(onSubmitSearch)}
          autoComplete="off"
        >
          <div className="input-group w-auto">
            <input
              {...register("search")}
              type="search"
              name="search"
              id="search"
              className="form-control w-25"
              placeholder="Search by name"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />

            <select
              value={direction}
              className="form-select w-25"
              id="inputGroupSelect01"
              onChange={(e) => {
                setSearchParam({
                  name: search,
                  page,
                  size,
                  sortBy,
                  direction: e.target.value,
                });
              }}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>

            <select
              value={size}
              className="form-select w-25"
              id="inputGroupSelect02"
              onChange={(e) => {
                setSearchParam({
                  name: search,
                  page,
                  direction,
                  sortBy,
                  size: e.target.value,
                });
              }}
            >
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <button
              className="btn btn-outline-secondary w-25"
              type="submit"
              id="button-addon2"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {isLogin && (
        <Link className="btn btn-primary text-white" to="/new">
        <i className="me-2">
          <IconPlus />
        </i>
        Tambah Produk
      </Link>
      )}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Product</th>
              <th scope="col">SKU Code</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
              {isLogin && <th scope="col">Action</th>}
            </tr>
          </thead>

          {data &&
            data.data.map((product, index) => (
              <React.Fragment key={product.id}>
                <tbody>
                  <tr>
                    <th scope="col">{++index}</th>
                    <td scope="col">
                      <div style={{ width: 72, height: 72 }}>
                        <img
                          src={product.image.url}
                          style={{ objectFit: "cover" }}
                          className="img-thumbnail img-fluid w-100 h-100"
                        />
                      </div>
                    </td>
                    <td scope="col">
                      <div className="fw-bold">{product.name}</div>
                    </td>
                    <td scope="col">{product.sku}</td>
                    <td scope="col">{product.quantity}</td>
                    <td scope="col">
                      <div className="fw-light">
                        Rp. {separateThousands(product.price)}
                      </div>
                    </td>
                    {isLogin && (
                      <td scope="col">
                        <div>
                          <button
                            onClick={() => {
                              navigate(`/update/${product.id}`);
                            }}
                            type="button"
                            className="btn btn-sm btn-secondary me-1 text-white"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop"
                          >
                            <IconEdit style={{ width: 18 }} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="btn btn-danger btn-sm text-white"
                          >
                            <IconTrash style={{ width: 18 }} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                </tbody>
              </React.Fragment>
            ))}
        </table>
      </div>

      <div className="d-flex flex-column-reverse flex-sm-row justify-content-between align-items-center">
        <small>
          Show data {data && data.data?.length} of {paging.totalElement}
        </small>
        <nav aria-label="Page navigation example">
          <ul className="pagination mb-sm-0">
            <li
              className={`page-item ${!paging.hasPrevious ? "disabled" : ""}`}
            >
              <button
                disabled={!paging.hasPrevious}
                onClick={handlePreviousPage}
                className="page-link"
              >
                Previous
              </button>
            </li>
            {[...Array(paging.totalPages)].map((_, index) => {
              const currentPage = index + 1;
              return (
                <li
                  key={index}
                  className={`page-item ${
                    paging.page === currentPage ? "active" : ""
                  }`}
                >
                  <button
                    onClick={() => navigatePage(currentPage)}
                    className="page-link"
                  >
                    {currentPage}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${!paging.hasNext ? "disabled" : ""}`}>
              <button
                disabled={!paging.hasNext}
                className="page-link"
                onClick={handleNextPage}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default ProductList;
