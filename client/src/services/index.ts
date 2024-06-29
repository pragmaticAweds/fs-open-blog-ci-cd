import { baseUrl } from "@/lib/config/constant";
import { fetchApiAttributes } from "@/lib/types";

const fetchFromApi = async ({
  url,
  method = "get",
  data,
  reqConfig,
}: fetchApiAttributes) => {
  try {
    const res = await fetch(`${baseUrl}/${url}`, {
      method,
      body: JSON.stringify(data as RequestInit["body"]),
      headers: { "Content-Type": "application/json" },
      ...reqConfig,
    });

    const { data: resData, message } = await res.json();

    if (!String(res.status).startsWith("2")) {
      return {
        status: false,
        message: message ?? resData?.message,
      };
    }

    return {
      status: true,
      message,
      data: resData,
    };
  } catch (err) {
    return {
      status: false,
      message: (err as { message: string }).message,
    };
  }
};

export { fetchFromApi };
