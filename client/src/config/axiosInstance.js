import axios from "axios";

const instance = axios.create({
  baseURL: "https://journal.piqih.tech/",
});

export default instance;
