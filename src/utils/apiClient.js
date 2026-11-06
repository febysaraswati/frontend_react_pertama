import axios from "axios";

const token = "3|NtQ3DX814dsn1N26y8sZlcdcq6hMd12sAWh88bnb0cb13f0";
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`, // Gunakan backtick di sini
  },
});

export default apiClient;