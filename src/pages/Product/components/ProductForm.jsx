import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ProductService from "../../../services/ProductService";
import PropTypes from "prop-types";
import { IconX, IconDeviceFloppy } from "@tabler/icons-react";

const createSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nama produk tidak boleh kosong"),
  sku: z.string().min(1, "Kode SKU tidak boleh kosong"),
  price: z
    .string()
    .refine((val) => !isNaN(parseInt(val)), "Harga harus berupa angka")
    .transform((val) => parseInt(val))
    .refine((val) => val >= 0, "Harga harus lebih dari 0"),
  quantity: z
    .string()
    .refine((val) => !isNaN(parseInt(val)), "Kuantitas harus berupa angka")
    .transform((val) => parseInt(val))
    .refine((val) => val >= 0, "Kuantitas harus lebih dari 0"),
  image: z.any(),
});

const productService = ProductService();

function ProductForm() {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    reset,
    setValue,
    trigger,
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(createSchema),
  });
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState(
    "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw"
  );

  const handleImageChange = (e) => {
    setPreviewImage([]);
    const { files } = e.target;
    const urlImage = URL.createObjectURL(files[0]);
    setPreviewImage(urlImage);
  };

  const handleBack = () => {
    clearForm();
    setPreviewImage(
      "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw"
    );
    navigate("/");
  };

  const onSubmit = async (data) => {
    if (data.id) {
      try {
        const form = new FormData();
        const product = {
          id: data.id,
          name: data.name,
          sku: data.sku,
          price: data.price,
          quantity: data.quantity,
        };
        form.append("product", JSON.stringify(product));
        form.append("image", data.image[0]);
        console.log(product);
        console.log(data.image[0]);
        await productService.update(form);
        clearForm();
        navigate("/");
      } catch (err) {
        console.error("Error submitting form:", err);
      }
    } else {
      try {
        const form = new FormData();
        const product = {
          name: data.name,
          sku: data.sku,
          price: data.price,
          quantity: data.quantity,
        };
        form.append("product", JSON.stringify(product));
        form.append("image", data.image[0]);
        console.log(product);
        console.log(data.image);
        await productService.create(form);
        clearForm();
        navigate("/");
      } catch (err) {
        console.error("Error submitting form:", err);
      }
    }
  };

  const clearForm = () => {
    clearErrors();
    reset();
    setPreviewImage([
      "https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw",
    ]);
  };

  useEffect(() => {
    if (id) {
      const getProductById = async () => {
        try {
          const response = await productService.getById(id);
          const currentProduct = response.data;
          setValue("id", currentProduct.id);
          setValue("name", currentProduct.name);
          setValue("sku", currentProduct.sku);
          setValue("price", currentProduct.price.toString());
          setValue("quantity", currentProduct.quantity.toString());
          setValue("image", currentProduct.image);
          setPreviewImage(currentProduct.image.url);
          trigger();
        } catch (error) {
          console.log(error);
          await navigate("/");
          Swal.fire({
            title: "Error",
            text: error,
            icon: "error",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        }
      };
      getProductById();
    } else {
      clearForm();
    }
  }, [id, setValue, trigger]);

  return (
    <>
      <div className="shadow-sm p-4 rounded-2">
        <h2 className="mb-4">Form Product</h2>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mb-3">
            <label htmlFor="name" className="form-label required">
              Nama Produk
            </label>
            <input
              {...register("name")}
              type="text"
              className={`form-control ${errors.name && "is-invalid"}`}
              name="name"
              id="name"
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="sku" className="form-label required">
              Kode SKU Produk
            </label>
            <input
              {...register("sku")}
              type="text"
              className={`form-control ${errors.sku && "is-invalid"}`}
              name="sku"
              id="sku"
            />
            {errors.sku && (
              <div className="invalid-feedback">{errors.sku.message}</div>
            )}
          </div>
          <div className="row-rows-cols-2">
            <div className="mb-3">
              <label htmlFor="price" className="form-label required">
                Harga
              </label>
              <input
                {...register("price")}
                type="number"
                className={`form-control ${errors.price && "is-invalid"}`}
                name="price"
                id="price"
              />
              {errors.price && (
                <div className="invalid-feedback">{errors.price.message}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label required">
                Kuantitas
              </label>
              <input
                {...register("quantity")}
                type="number"
                className={`form-control ${errors.quantity && "is-invalid"}`}
                name="quantity"
                id="quantity"
              />
              {errors.quantity && (
                <div className="invalid-feedback">{errors.quantity.message}</div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              <span className="required">Gambar</span>
              <br />
              <img
                className="img-thumbnail img-fluid"
                width={200}
                height={200}
                src={previewImage}
                alt="product"
              />
            </label>
            <input
              {...register("image", {
                onChange: handleImageChange,
              })}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className={`form-control ${errors.image && "is-invalid"}`}
              name="image"
              id="image"
            />
            {errors.image && (
              <div className="invalid-feedback">{errors.image.message}</div>
            )}
          </div>
          <div className="d-flex gap-2">
            <button
              type="submit"
              disabled={!isValid}
              className="d-flex align-items-center btn btn-primary text-white"
            >
              <i className="me-2">
                <IconDeviceFloppy />
              </i>
              Simpan
            </button>
            <button
              onClick={handleBack}
              type="button"
              className="d-flex align-items-center btn btn-danger text-white"
            >
              <i className="me-2">
                <IconX />
              </i>
              Batal
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProductForm;
