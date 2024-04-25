import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

const methods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
} as const;

export { http, methods };
