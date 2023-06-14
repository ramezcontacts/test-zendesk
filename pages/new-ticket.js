/* eslint-disable @next/next/no-img-element */
import { useForm } from "react-hook-form";
import { useState } from "react";
import Loader from "../components/Loader";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import { endPoints } from "../constant/endpoints";
import { defaultValues } from "../constant";

let baseurl,
  envType,
  _searchQuery,
  _loader = false,
  _loadOrder = false,
  successMessage,
  responseMsg,
  responseCls;
export default function Home() {
  const [active, setActive] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [responseMsg, setResponseMsg] = useState("");
  const [responseCls, setResponseCls] = useState("");
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("This field is required"),
    firstname: Yup.string().required("This field is required"),
    lastname: Yup.string().required("This field is required"),
    orderno: Yup.string().required("This field is required"),
    description: Yup.string().required("This field is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors } = formState;
  function resetFunction() {
    setUserSearchResults([]);
    reset();
  }

  const onSubmitFunction = async (event) => {
    _loader = true;
    setActive(false);
    setSuccessMessage("");

    const _url = endPoints["new-tickets"];

    const response = await fetch(_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
    const data = await response.json();

    _loader = false;
    setActive(true);
    setSuccessMessage(data.responseMsg);
    setResponseCls(data.responseCls);
    data.status == "success"
      ? document.getElementById("new-request-form").reset()
      : "";
    return false;
  };

  return (
    <div>
      <div className="card customer-details">
        <div className="card-body col-md-4">
          <div className="customer-blk">
            <div className="customer-header mb-4">
              <h4 className="mb-2">New request form</h4>
            </div>
            <i className={responseCls}>{successMessage}</i>
          </div>
          <div className="customer-blk ">
            <div className="customer-header  mb-4">
              <form
                id="new-request-form"
                onSubmit={handleSubmit(onSubmitFunction)}
              >
                <div className="form-group">
                  <small>Order no</small>
                  <input
                    name="orderno"
                    type="text"
                    {...register("orderno")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter order no"
                  />
                </div>
                <div className="form-group">
                  <small>Email address</small>
                  <input
                    name="email"
                    type="email"
                    {...register("email")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <small>First name</small>
                  <input
                    type="text"
                    name="firstname"
                    {...register("firstname")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id=""
                    placeholder="Enter first name"
                  />
                </div>
                <div className="form-group">
                  <small>Last name</small>
                  <input
                    type="text"
                    name="lastname"
                    {...register("lastname")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id=""
                    placeholder="Enter last name"
                  />
                </div>
                <div className="form-group">
                  <small>Description</small>
                  <textarea
                    name="description"
                    {...register("description")}
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id=""
                    placeholder="Enter description"
                  />
                </div>
                <button
                  type="submit"
                  className="btn float-right btn-primary"
                  disabled={!active}
                >
                  {_loader ? "Please wait..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
