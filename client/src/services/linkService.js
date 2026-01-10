import api from "../lib/api.js";

//get all links
export const getLinks = async () => {
    const res = await api.get("/api/links");
    return res.data?.data || [];
};

//create link

export const createLink = async (payload) => {
    const res = await api.post("/api/links/create", payload);
    return res.data?.data;
};

export const updateLink = async (id, payload) => {
    const res = await api.patch(`/api/links/${id}`, payload);
    return res.data?.data;
};

export const deleteLink = async (id) => {
    const res = await api.delete(`/api/links/${id}`);
    return res.data;
};

// Preview metadata
export const getLinkPreview = async (url) => {
    const res = await api.post("/api/links/preview", { url });
    return res.data?.data; // returns { title, image, description, icon }
};

export const reorderLinks = async (orderedIds) => {
    const res = await api.patch("/api/links/reorder", { orderedIds });
    return res; // return full axios response
};
